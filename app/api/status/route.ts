import { connection } from "next/server";
import { projects } from "../../project-data";
import {
  githubPollInterval,
  type Discussion,
  type RepositoryStatus,
  type StatusResponse,
} from "../../status-data";

const api = "https://api.github.com";

type SearchResult = {
  total_count: number;
  incomplete_results: boolean;
  items: { title: string; html_url: string; number: number; updated_at: string }[];
};

type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; committer: { date: string } };
};

type GitHubRelease = {
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string;
};

type RepositoryCache = {
  snapshot: RepositoryStatus | null;
  refresh: Promise<void> | null;
  nextRefreshAt: number;
  stale: boolean;
};

const repositoryCaches = new Map<string, RepositoryCache>();
let githubRetryAt = 0;

async function github(path: string) {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(api + path, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "vi-port-research",
      "X-GitHub-Api-Version": "2026-03-10",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const retryAfter = Number(response.headers.get("retry-after"));
    const reset = response.headers.get("x-ratelimit-remaining") === "0"
      ? Number(response.headers.get("x-ratelimit-reset")) * 1000
      : 0;
    if (retryAfter > 0 || reset > 0) {
      githubRetryAt = Math.max(githubRetryAt, Date.now() + retryAfter * 1000, reset);
    }
    throw new Error(`GitHub API returned ${response.status}`);
  }
  return response;
}

async function openItems(repo: string, kind: "issue" | "pr") {
  const query = new URLSearchParams({
    q: `repo:${repo} is:${kind} is:open`,
    sort: "updated",
    order: "desc",
    per_page: "5",
  });
  const result: SearchResult = await (await github(`/search/issues?${query}`)).json();
  if (result.incomplete_results) throw new Error("GitHub search returned incomplete results");
  const items: Discussion[] = result.items.map((item) => ({
    title: item.title,
    url: item.html_url,
    date: item.updated_at,
    number: item.number,
  }));
  return { count: result.total_count, items };
}

async function refreshStatus(repo: string, cache: RepositoryCache) {
  const repoApi = `/repos/${repo}`;

  try {
    const [issues, pulls, commits, releases] = await Promise.allSettled([
      openItems(repo, "issue"),
      openItems(repo, "pr"),
      github(`${repoApi}/commits?per_page=5`).then((res) => res.json() as Promise<GitHubCommit[]>),
      github(`${repoApi}/releases?per_page=1`).then((res) => res.json() as Promise<GitHubRelease[]>),
    ]);
    if (issues.status !== "fulfilled" || pulls.status !== "fulfilled" || commits.status !== "fulfilled" || releases.status !== "fulfilled") {
      throw new Error("GitHub snapshot could not be completed");
    }

    const release = releases.value[0];
    cache.snapshot = {
      checkedAt: new Date().toISOString(),
      openIssues: issues.value.count,
      openPullRequests: pulls.value.count,
      issues: issues.value.items,
      pullRequests: pulls.value.items,
      commits: commits.value.map(({ sha, html_url, commit }) => ({
        sha: sha.slice(0, 7),
        title: commit.message.split("\n")[0],
        url: html_url,
        date: commit.committer.date,
      })),
      release: release ? {
        title: release.name || release.tag_name,
        url: release.html_url,
        date: release.published_at,
      } : null,
    };
    cache.stale = false;
    cache.nextRefreshAt = Date.now() + githubPollInterval;
  } catch {
    cache.stale = true;
    cache.nextRefreshAt = Date.now() + 120_000;
  }
}

export async function GET(request: Request) {
  await connection();

  const projectId = new URL(request.url).searchParams.get("project") ?? projects[0].id;
  const project = projects.find(({ id }) => id === projectId);
  if (!project) {
    return Response.json({ error: "Unknown project" }, { status: 400 });
  }

  let cache = repositoryCaches.get(project.repo);
  if (!cache) {
    cache = { snapshot: null, refresh: null, nextRefreshAt: 0, stale: false };
    repositoryCaches.set(project.repo, cache);
  }

  if (!cache.refresh && Date.now() >= Math.max(cache.nextRefreshAt, githubRetryAt)) {
    cache.refresh = refreshStatus(project.repo, cache).finally(() => { cache.refresh = null; });
  }
  await cache.refresh;

  const body: StatusResponse = {
    data: cache.snapshot,
    stale: cache.stale || Date.now() >= cache.nextRefreshAt,
  };
  return Response.json(body, {
    status: body.data ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
