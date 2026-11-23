"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icons";
import { entries, snapshot, topics } from "./journal-data";

export function JournalList() {
  const [topic, setTopic] = useState<(typeof topics)[number] | "All">("All");
  const visibleEntries = topic === "All" ? entries : entries.filter((entry) => entry.topic === topic);

  return (
    <section id="journal" aria-labelledby="journal-heading">
      <div className="journal-heading">
        <h2 id="journal-heading" className="section-label">Latest notes</h2>
        <div className="filters" role="group" aria-label="Filter notes by topic">
          {(["All", ...topics] as const).map((filter) => (
            <button key={filter} type="button" aria-pressed={filter === topic} onClick={() => setTopic(filter)}>
              {filter}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">{visibleEntries.length} {visibleEntries.length === 1 ? "note" : "notes"} shown</p>
      <ul className="entries">
        {visibleEntries.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/journal/${entry.slug}`} className="entry">
              <div>
                <p className="entry-meta"><span>{entry.topic}</span><span aria-hidden="true">·</span><time dateTime={snapshot.date}>{snapshot.dateLabel}</time></p>
                <h3>{entry.title}</h3>
                <p className="entry-summary">{entry.summary}</p>
              </div>
              <Icon name="arrow" className="entry-arrow" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
