// Recipient-side cover. Smaller than the author Cover so it fits the
// split-panel left column on desktop. Single component, scales via the
// breakpoint utilities — same DOM at every width.

import type { GuideRow } from "@/lib/db/guides";

interface RecipientCoverProps {
  guide: GuideRow;
  authorName: string;
  placeCount: number;
}

export function RecipientCover({
  guide,
  authorName,
  placeCount,
}: RecipientCoverProps) {
  const meta = [
    `${placeCount} places`,
    guide.year,
    guide.context,
  ].filter(Boolean) as string[];

  return (
    <div className="px-5 pb-5 pt-8 text-center sm:px-8 sm:pt-10">
      <p
        className="m-0 mb-3 font-serif text-[11px] uppercase text-accent"
        style={{ letterSpacing: "0.18em" }}
      >
        A guide by {authorName}
      </p>
      <h1
        className="m-0 mb-1 font-serif text-[28px] font-normal leading-[1.15] text-ink sm:text-[32px]"
        style={{ letterSpacing: "-0.015em" }}
      >
        {guide.title}
      </h1>
      {guide.country && (
        <p className="m-0 font-serif text-[14px] text-faint sm:text-[15px]">
          {guide.country}
        </p>
      )}
      <div className="mx-auto my-5 h-px w-8 bg-accent" />
      {guide.intro && (
        <p className="mx-auto m-0 max-w-[340px] font-serif italic text-[14px] leading-[1.8] text-ink-muted sm:text-[15px]">
          &ldquo;{guide.intro}&rdquo;
        </p>
      )}
      {meta.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-3 font-serif text-[11px] text-faint">
          {meta.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="mr-3 text-border">·</span>}
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
