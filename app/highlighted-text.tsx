import type { ReactNode } from "react";

export type TextHighlight = { phrase: string; color: "orange" | "pink" };

export function HighlightedText({ text, highlights = [] }: {
  text: string;
  highlights?: readonly TextHighlight[];
}) {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const { phrase, color } of highlights) {
    const start = text.indexOf(phrase, cursor);
    if (start === -1) continue;
    parts.push(text.slice(cursor, start));
    parts.push(<span key={start} className={`text-highlight-${color}`}>{phrase}</span>);
    cursor = start + phrase.length;
  }

  return <>{parts}{text.slice(cursor)}</>;
}
