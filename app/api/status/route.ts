import { connection } from "next/server";
import {
  githubPollInterval,
  type Discussion,
  type RepositoryStatus,
  type StatusResponse,
} from "../../status-data";

const repo = "ItsNotRexed/Leonida";
const repoApi = `/repos/${repo}`;
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

let lastSnapshot: RepositoryStatus | null = null;
let refreshInFlight: Promise<void> | null = null;
let nextRefreshAt = 0;
let refreshFailed = false;

async function github(path: string, accept = "application/vnd.github+json") {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(api + path, {
    headers: {
      Accept: accept,
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
    nextRefreshAt = Math.max(nextRefreshAt, Date.now() + retryAfter * 1000, reset);
    throw new Error(`GitHub API returned ${response.status}`);
  }
  return response;
}

async function openItems(kind: "issue" | "pr") {
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

function readPlayability(readme: string) {
  const section = readme.split(/^## +/m).find((part) => /^Project status[ \t]*\r?\n/i.test(part));
  const row = section?.split(/\r?\n/).find((line) => /^\s*\|\s*Booting, story mode/i.test(line));
  const value = row?.split("|")[2]?.replace(/[\p{Extended_Pictographic}\uFE0F*]/gu, "").trim();
  if (value && /^no\b/i.test(value)) return "Not playable";
  if (value && /^yes\b/i.test(value)) return "Playable";
  return null;
}

async function refreshStatus() {
  try {
    const [issues, pulls, commits, releases, readme] = await Promise.allSettled([
      openItems("issue"),
      openItems("pr"),
      github(`${repoApi}/commits?sha=main&per_page=5`).then((res) => res.json() as Promise<GitHubCommit[]>),
      github(`${repoApi}/releases?per_page=1`).then((res) => res.json() as Promise<GitHubRelease[]>),
      github(`${repoApi}/readme`, "application/vnd.github.raw+json").then((res) => res.text()),
    ]);
    if (issues.status !== "fulfilled" || pulls.status !== "fulfilled" || commits.status !== "fulfilled" || releases.status !== "fulfilled" || readme.status !== "fulfilled") {
      throw new Error("GitHub snapshot could not be completed");
    }

    const release = releases.value[0];
    lastSnapshot = {
      checkedAt: new Date().toISOString(),
      playability: readPlayability(readme.value),
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
    refreshFailed = false;
    nextRefreshAt = Date.now() + githubPollInterval;
  } catch {
    refreshFailed = true;
    nextRefreshAt = Math.max(nextRefreshAt, Date.now() + 120_000);
  }
}

export async function GET() {
  await connection();

  if (!refreshInFlight && Date.now() >= nextRefreshAt) {
    refreshInFlight = refreshStatus().finally(() => { refreshInFlight = null; });
  }
  await refreshInFlight;

  const body: StatusResponse = { data: lastSnapshot, stale: refreshFailed };
  return Response.json(body, {
    status: lastSnapshot ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
