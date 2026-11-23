import type { Metadata } from "next";
import { AnimatedSkyline } from "../animated-skyline";
import { leonida } from "../journal-data";
import { StatusFeed } from "./status-feed";

export const metadata: Metadata = {
  title: "Leonida Status",
  description: "Live GitHub activity and reported playability for the Leonida PC port project.",
};

export default function StatusPage() {
  return (
    <main id="main-content" className="shell reading status-page flex-1">
      <AnimatedSkyline monochrome />
      <header className="intro">
        <h1>Leonida status</h1>
        <p>Reported playability, recent commits, and open work from the public repository.</p>
        <a className="status-link" href={leonida}>View Leonida on GitHub</a>
      </header>
      <StatusFeed />
    </main>
  );
}
