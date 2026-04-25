import type { GuideRow } from "@/lib/db/guides";

interface CoverProps {
  guide: GuideRow;
  authorName: string;
  placeCount: number;
  compact?: boolean;
}

export function Cover({ guide, authorName, placeCount, compact }: CoverProps) {
  const padding = compact ? "px-6 pt-9 pb-8" : "px-6 pt-12 pb-10";
  const cityClass = compact ? "text-hero" : "text-cover";
  const meta = [
    `${placeCount} places`,
    guide.year,
    guide.context,
  ].filter(Boolean) as string[];

  return (
    <div className={`text-center ${padding}`}>
      <p
        className="m-0 mb-3.5 font-serif text-[11px] uppercase text-accent"
        style={{ letterSpacing: "0.18em" }}
      >
        A guide by {authorName}
      </p>
      <h1 className={`m-0 mb-1 font-serif font-normal text-ink ${cityClass}`}>
        {guide.title}
      </h1>
      {guide.country && (
        <p
          className="m-0 mb-7 font-serif text-[12px] uppercase text-faint"
          style={{ letterSpacing: "0.2em" }}
        >
          {guide.country}
        </p>
      )}
      <div className="mx-auto mb-7 h-px w-8 bg-accent" />
      {guide.intro && (
        <p className="mx-auto m-0 max-w-intro font-serif italic text-[15px] leading-[1.85] text-ink-muted">
          &ldquo;{guide.intro}&rdquo;
        </p>
      )}
      {meta.length > 0 && (
        <div className="mt-[22px] flex flex-wrap justify-center font-serif text-[12px] text-faint">
          {meta.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="mx-2.5 text-[#DDD7CE]">·</span>}
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
