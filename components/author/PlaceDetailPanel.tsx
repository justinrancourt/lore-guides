import Link from "next/link";
import type { GuideRow } from "@/lib/db/guides";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { MapPanel, type MapPin } from "@/components/recipient/MapPanel";

interface PlaceDetailPanelProps {
  place: PlaceWithGuidesAndPhotos;
  filedIn: GuideRow[];
}

// Right-panel content for /places/[id]. Shows where the place is filed
// + a single-pin map placeholder + an Edit shortcut. The center column
// owns the actual content; this panel is contextual.
export function PlaceDetailPanel({ place, filedIn }: PlaceDetailPanelProps) {
  const pins: MapPin[] = [{ id: place.id, index: 1 }];

  return (
    <div className="flex flex-col gap-6 px-6 py-7">
      <div className="h-[160px] w-full overflow-hidden border border-border-bold">
        <MapPanel pins={pins} active={place.id} />
      </div>

      <div>
        <p
          className="m-0 mb-2.5 font-sans text-[9px] font-semibold uppercase text-faint"
          style={{ letterSpacing: "0.14em" }}
        >
          Filed in
        </p>
        {filedIn.length === 0 ? (
          <p className="m-0 font-serif italic text-[13px] text-faint">
            Unfiled. Add this place to a guide to share it.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filedIn.map((g) => (
              <Link
                key={g.id}
                href={`/guides/${g.slug}`}
                className="flex items-center gap-2 border border-border-soft px-3 py-2 transition-colors hover:bg-surface/60"
              >
                <span
                  className="h-2 w-2 rounded-circle"
                  style={{ backgroundColor: g.color }}
                />
                <span className="min-w-0 flex-1 truncate font-serif text-[13px] text-ink">
                  {g.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        href={`/places/${place.id}/edit`}
        className="inline-flex w-full items-center justify-center border border-border bg-transparent px-4 py-2.5 font-serif text-[11px] uppercase text-ink"
        style={{ letterSpacing: "0.08em" }}
      >
        Edit place
      </Link>

      {place.address && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-[13px] text-accent"
        >
          Open in Maps →
        </a>
      )}
    </div>
  );
}
