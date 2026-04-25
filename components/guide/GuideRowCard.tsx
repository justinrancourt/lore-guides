import Link from "next/link";
import type { Guide } from "@/lib/types";

interface GuideRowCardProps {
  guide: Guide;
  count: number;
}

export function GuideRowCard({ guide, count }: GuideRowCardProps) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="flex items-start gap-4 border-t border-border px-0 py-5"
    >
      <div
        className="h-[52px] w-[72px] shrink-0"
        style={{ backgroundColor: guide.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-serif text-[18px] text-ink">{guide.title}</span>
          <span
            className="shrink-0 font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            {guide.type}
          </span>
        </div>
        <p className="m-0 mt-1 font-serif italic text-[12px] text-faint">
          {guide.scope ? `${guide.scope} · ` : ""}
          {count} places
        </p>
      </div>
    </Link>
  );
}
