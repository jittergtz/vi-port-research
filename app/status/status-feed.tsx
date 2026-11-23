"use client";

import { useEffect, useState } from "react";
import { leonida } from "../journal-data";
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
      <h2><a className="status-link" href={source}>{title}</a></h2>
      {items.length ? (
        <ul className="entries">
          {items.map((item) => (
            <li key={item.url}>
              <a className="entry" href={item.url}>
                <div className="min-w-0">
                  <p className="entry-meta"><span>{item.ref}</span><span aria-hidden="true">·</span><time dateTime={item.date}>{dateFormat.format(new Date(item.date))}</time></p>
                  <h3>{item.title}</h3>
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

export function StatusFeed() {
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let checking = false;

    async function check() {
      if (document.hidden || checking) return;
      checking = true;
      try {
        const response = await fetch("/api/status", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Status feed unavailable");
        const result: StatusResponse = await response.json();
        setStatus(result);
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
  }, []);

  const data = status?.data;

  return (
    <>
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
              <dt>Reported playability</dt>
              <dd>
                <a className={data.playability === "Not playable" ? "status-link status-warning" : "status-link"} href={`${leonida}#project-status`}>
                  {data.playability ?? "See README"}
                </a>
              </dd>
            </div>
            <div>
              <dt>Latest release</dt>
              <dd>
                <a className={data.release ? "status-link" : "status-link status-warning"} href={data.release?.url ?? `${leonida}/releases`}>
                  {data.release?.title ?? "None published"}
                </a>
              </dd>
            </div>
            <div>
              <dt>Open issues</dt>
              <dd><a className="status-link" href={`${leonida}/issues`}>{numberFormat.format(data.openIssues)}</a></dd>
            </div>
            <div>
              <dt>Open pull requests</dt>
              <dd><a className="status-link" href={`${leonida}/pulls`}>{numberFormat.format(data.openPullRequests)}</a></dd>
            </div>
          </dl>

          <ActivityList title="Latest commits on main" source={`${leonida}/commits/main/`} items={data.commits.map((commit) => ({ ...commit, ref: commit.sha }))} />
          <ActivityList title="Recently updated open issues" source={`${leonida}/issues`} items={data.issues.map((issue) => ({ ...issue, ref: `#${issue.number}` }))} />
          <ActivityList title="Recently updated open pull requests" source={`${leonida}/pulls`} items={data.pullRequests.map((pull) => ({ ...pull, ref: `#${pull.number}` }))} />
        </>
      )}
    </>
  );
}
