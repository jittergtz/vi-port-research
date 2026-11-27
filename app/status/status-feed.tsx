"use client";

import { useEffect, useState } from "react";
import { projects } from "../project-data";
import { statusCheckInterval, statusRefreshMinutes, type StatusResponse } from "../status-data";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const numberFormat = new Intl.NumberFormat();

function ActivityList({ title, source, items }: {
  title: string;
  source: string;
  items: { title: string; url: string; date: string; ref: string }[];
}) {
  return (
    <section className="status-activity">
      <h3><a className="status-link" href={source}>{title}</a></h3>
      {items.length ? (
        <ul className="entries">
          {items.map((item) => (
            <li key={item.url}>
              <a className="entry" href={item.url}>
                <div className="min-w-0">
                  <p className="entry-meta"><span>{item.ref}</span><span aria-hidden="true">·</span><time dateTime={item.date}>{dateFormat.format(new Date(item.date))}</time></p>
                  <h4>{item.title}</h4>
                </div>
                <span aria-hidden="true" className="entry-arrow">↗</span>
              </a>
            </li>
          ))}
        </ul>
      ) : <p className="entry-summary">No activity to show.</p>}
    </section>
  );
}

type Project = (typeof projects)[number];

export function StatusFeed() {
  const [project, setProject] = useState<Project>(projects[0]);

  return (
    <section className="status-activity" aria-labelledby="activity-heading">
      <h2 id="activity-heading">Live GitHub activity</h2>
      <div className="filters status-filters" role="group" aria-label="Choose a repository">
        {projects.map((item) => (
          <button key={item.id} type="button" aria-pressed={item.id === project.id} onClick={() => setProject(item)}>
            {item.name}
          </button>
        ))}
      </div>
      <RepositoryFeed key={project.id} project={project} />
    </section>
  );
}

function RepositoryFeed({ project }: { project: Project }) {
  const repoUrl = `https://github.com/${project.repo}`;
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let checking = false;

    async function check() {
      if (document.hidden || checking) return;
      checking = true;
      try {
        const response = await fetch(`/api/status?project=${project.id}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Status feed unavailable");
        const result: StatusResponse = await response.json();
        if (!controller.signal.aborted) setStatus(result);
      } catch {
        if (!controller.signal.aborted) {
          setStatus((previous) => ({ data: previous?.data ?? null, stale: true }));
        }
      } finally {
        checking = false;
      }
    }

    void check();
    const timer = window.setInterval(check, statusCheckInterval);
    document.addEventListener("visibilitychange", check);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [project.id]);

  const data = status?.data;

  return (
    <>
      <p className="status-freshness"><a className="status-link" href={repoUrl}>View {project.name} on GitHub</a></p>
      <p className="status-freshness" role="status">
        {data ? (
          <>
            {status.stale ? "Refresh failed · Last successful check " : "Last checked "}
            <time dateTime={data.checkedAt}>{dateFormat.format(new Date(data.checkedAt))}</time>
          </>
        ) : status ? "GitHub status is temporarily unavailable. This page will retry automatically." : "Checking GitHub…"}
      </p>
      <p className="status-cadence">GitHub refreshes about every {statusRefreshMinutes} minutes while this page is open.</p>
      {data && (
        <>
          <dl className="status-metrics">
            <div>
              <dt>Latest GitHub release</dt>
              <dd>
                <a className={data.release ? "status-link" : "status-link status-warning"} href={data.release?.url ?? `${repoUrl}/releases`}>
                  {data.release?.title ?? "None published"}
                </a>
              </dd>
            </div>
            <div>
              <dt>Open issues</dt>
              <dd><a className="status-link" href={`${repoUrl}/issues`}>{numberFormat.format(data.openIssues)}</a></dd>
            </div>
            <div>
              <dt>Open pull requests</dt>
              <dd><a className="status-link" href={`${repoUrl}/pulls`}>{numberFormat.format(data.openPullRequests)}</a></dd>
            </div>
          </dl>

          <ActivityList title="Latest commits" source={`${repoUrl}/commits/HEAD/`} items={data.commits.map((commit) => ({ ...commit, ref: commit.sha }))} />
          <ActivityList title="Recently updated open issues" source={`${repoUrl}/issues`} items={data.issues.map((issue) => ({ ...issue, ref: `#${issue.number}` }))} />
          <ActivityList title="Recently updated open pull requests" source={`${repoUrl}/pulls`} items={data.pullRequests.map((pull) => ({ ...pull, ref: `#${pull.number}` }))} />
        </>
      )}
    </>
  );
}
