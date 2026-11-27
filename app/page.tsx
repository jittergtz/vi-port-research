import Link from "next/link";
import { Icon } from "./icons";
import { JournalList } from "./journal-list";
import { overview } from "./journal-data";
import { AnimatedSkyline } from "./animated-skyline";
import { HighlightedText } from "./highlighted-text";

export default function Home() {
  return (
    <main id="main-content" className="shell home flex-1">
      <AnimatedSkyline />
      <section className="intro" aria-labelledby="home-heading">
        <h1 id="home-heading">GTA VI Port Research</h1>
        <p>An independent journal tracking community efforts to run the Xbox Series build of GTA VI on PC.</p>
      </section>

      <section className="featured" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="section-label">Latest progress report</h2>
        <Link className="entry" href={`/journal/${overview.slug}`}>
          <div>
            <h3>{overview.title}</h3>
            <p className="entry-summary"><HighlightedText text={overview.summary} highlights={overview.summaryHighlights} /></p>
          </div>
          <Icon name="arrow" className="entry-arrow" />
        </Link>
      </section>

      <JournalList />
      <aside id="scope" aria-labelledby="scope-heading" className="scope">
        <h2 id="scope-heading" className="section-label">Project tracker</h2>
        <Link className="entry" href="/status">
          <div>
            <h3>Compare projects</h3>
            <p className="entry-summary">See how far each project has reached and follow its GitHub activity.</p>
          </div>
          <Icon name="arrow" className="entry-arrow" />
        </Link>
      </aside>
    </main>
  );
}
