import Link from "next/link";
import { cn } from "@/lib/cn";
import { placeholderColor, relativeDate } from "@/lib/format";
import type { GuideRow } from "@/lib/db/guides";
import type { PlaceWithGuides } from "@/lib/db/places";

interface MyPlacesCardProps {
  place: PlaceWithGuides;
  guides: GuideRow[];
}

export function MyPlacesCard({ place, guides }: MyPlacesCardProps) {
  const placeGuides = guides.filter((g) => place.guide_ids.includes(g.id));
  return (
    <Link
      href={`/places/${place.id}`}
      className="block border-t border-border px-0 py-5"
    >
      <div className="flex items-start gap-4">
        <div
          className="h-14 w-14 shrink-0"
          style={{ backgroundColor: placeholderColor(place.id) }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-serif text-[16px] text-ink">
              {place.name}
            </span>
            {place.type && (
              <span
                className="shrink-0 font-serif text-[10px] uppercase text-faint"
                style={{ letterSpacing: "0.14em" }}
              >
                {place.type}
              </span>
            )}
          </div>
          <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
            {place.neighborhood ?? "—"}
            <span className="not-italic"> · saved {relativeDate(place.created_at)}</span>
          </p>
          {place.note && (
            <p
              className="m-0 mt-1.5 font-serif text-[13px] leading-[1.55] text-ink-muted"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {place.note}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {placeGuides.map((g) => (
              <span
                key={g.id}
                className="inline-flex items-center gap-1 rounded-pill border border-border px-2 py-0.5 font-serif text-[10px] uppercase text-faint"
                style={{ letterSpacing: "0.12em" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-circle"
                  style={{ backgroundColor: g.color }}
                />
                {g.title}
              </span>
            ))}
            {placeGuides.length === 0 && (
              <span
                className={cn(
                  "rounded-pill border border-banner-border bg-banner-bg px-2 py-0.5 font-serif text-[10px] uppercase text-banner-icon",
                )}
                style={{ letterSpacing: "0.12em" }}
              >
                Unfiled
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
