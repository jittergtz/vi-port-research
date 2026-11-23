import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "../../icons";
import { HighlightedText } from "../../highlighted-text";
import { entries, overview, snapshot } from "../../journal-data";

const posts = [overview, ...entries];

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <main id="main-content" className="shell reading flex-1">
      <Link className="back-link" href="/#journal"><Icon name="back" /> Back to journal</Link>
      <Suspense fallback={<p className="article-summary" role="status">Loading article…</p>}>
        <ArticleContent params={params} />
      </Suspense>
    </main>
  );
}

async function ArticleContent({ params }: Pick<PageProps<"/journal/[slug]">, "params">) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <header>
        <p className="eyebrow article-topic">{post.topic}</p>
        <h1>{post.title}</h1>
        <p className="article-summary"><HighlightedText text={post.summary} highlights={post.summaryHighlights} /></p>
        <p className="article-meta">
          <time dateTime={snapshot.date}>{snapshot.dateLabel}</time>
          {post.topic !== "Overview" && <><span aria-hidden="true">·</span>GitHub snapshot</>}
        </p>
      </header>
      <div className="article-body">
        {post.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p><HighlightedText text={section.text} highlights={section.highlights} /></p>
            <ul aria-label="Sources" className="article-sources">
              {section.sources.map((source) => (
                <li key={source.href}><a href={source.href}>{source.label}</a></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
