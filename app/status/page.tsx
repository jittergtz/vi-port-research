import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSkyline } from "../animated-skyline";
import { overview } from "../journal-data";
import { cgbj, projects, researchDate, researchDateLabel } from "../project-data";
import { StatusFeed } from "./status-feed";

export const metadata: Metadata = {
  title: "Project Status",
  description: "Compare GTA VI PC milestones and live GitHub activity across community projects.",
};

export default function StatusPage() {
  return (
    <main id="main-content" className="shell reading status-page flex-1">
      <AnimatedSkyline monochrome />
      <header className="intro">
        <h1>Project status</h1>
        <p>VIctory reached the opening mission. PortWatch reports player movement in CGBJ’s private build. A playable build remains unverified.</p>
        <Link className="status-link" href={`/journal/${overview.slug}`}>Read the progress report</Link>
      </header>

      <section aria-labelledby="milestones-heading">
        <h2 id="milestones-heading" className="section-label">Public milestones</h2>
        <p className="status-freshness">Sources checked <time dateTime={researchDate}>{researchDateLabel}</time></p>
        <ul className="entries">
          {[cgbj, ...projects].map((project) => (
            <li key={project.id}>
              <a className="entry" href={project.source}>
                <div>
                  <p className="entry-meta">{project.name}</p>
                  <h3>{project.milestone}</h3>
                  <p className="entry-summary">{project.summary}</p>
                </div>
                <span aria-hidden="true" className="entry-arrow">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <StatusFeed />
    </main>
  );
}
