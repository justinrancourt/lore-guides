import Link from "next/link";
import type { PlaceWithGuides } from "@/lib/db/places";
import { placeholderColor, relativeDate } from "@/lib/format";

interface CompactPlaceRowProps {
  place: PlaceWithGuides;
}

// Spec design: 48px photo thumb · place name + category eyebrow ·
// neighborhood · date · 2-line note clamp · "Needs a note" hint when
// the place has none. Whole row links to the full place detail.
export function CompactPlaceRow({ place }: CompactPlaceRowProps) {
  const needsNote = !place.note || place.note.trim().length === 0;

  return (
    <Link
      href={`/places/${place.id}`}
      className="flex items-start gap-3.5 border-b border-border-soft py-4 transition-colors hover:bg-surface/40"
    >
      <div
        className="h-12 w-12 shrink-0 overflow-hidden bg-surface"
        style={{ backgroundColor: placeholderColor(place.id) }}
      >
        {place.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.cover_url}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.85)" }}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="m-0 font-serif text-[15px] font-normal text-ink">
            {place.name}
          </h3>
          {place.type && (
            <span
              className="shrink-0 font-sans text-[9px] uppercase text-faint"
              style={{ letterSpacing: "0.12em" }}
            >
              {place.type}
            </span>
          )}
        </div>
        <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
          {place.neighborhood ?? "—"}
          <span className="not-italic"> · {relativeDate(place.created_at)}</span>
        </p>
        {place.note && (
          <p
            className="m-0 mt-1.5 font-serif text-[13px] leading-[1.6] text-ink-muted"
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
        {needsNote && (
          <p className="m-0 mt-1.5 font-serif italic text-[12px] text-accent-deep opacity-70">
            Needs a note
          </p>
        )}
      </div>
    </Link>
  );
}
