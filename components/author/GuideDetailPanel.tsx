import Link from "next/link";
import type { GuideRow } from "@/lib/db/guides";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { MapPanel, type MapPin } from "@/components/recipient/MapPanel";
import { PublishControl } from "@/components/guide/PublishControl";
import { siteUrl } from "@/lib/site-url";

interface GuideDetailPanelProps {
  guide: GuideRow;
  places: PlaceWithGuidesAndPhotos[];
}

// Right-panel content when a specific guide is selected. Per the spec:
// header (dot + city + scope), intro quote, stats (places / with-notes /
// with-photos), publish toggle + share-link copy, reorder shortcut, map
// preview, by-category breakdown.
export async function GuideDetailPanel({ guide, places }: GuideDetailPanelProps) {
  const withNotes = places.filter((p) => p.note && p.note.length > 0).length;
  const withPhotos = places.filter((p) => p.photos.length > 0).length;

  const pins: MapPin[] = places
    .slice(0, 12)
    .map((p, i) => ({ id: p.id, index: i + 1, lat: p.lat, lng: p.lng }));

  const categoryCounts = new Map<string, number>();
  for (const p of places) {
    const key = p.type ?? "Untyped";
    categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
  }
  const sortedCategories = Array.from(categoryCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  const publicUrl = `${await siteUrl()}/g/${guide.slug}`;

  return (
    <div className="flex flex-col gap-6 px-6 py-7">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-[9px] w-[9px] rounded-circle"
            style={{ backgroundColor: guide.color }}
          />
          <span
            className="font-sans text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            {guide.context ?? guide.year ?? guide.type}
          </span>
        </div>
        <h2 className="m-0 mb-1 font-serif text-[22px] font-normal text-ink">
          {guide.title}
        </h2>
        <p className="m-0 mb-3 font-serif italic text-[12px] text-faint">
          {places.length} {places.length === 1 ? "place" : "places"}
          {guide.year ? ` · ${guide.year}` : ""}
        </p>
        {guide.intro && (
          <p className="m-0 font-serif italic text-[13px] leading-[1.7] text-ink-muted">
            &ldquo;{guide.intro}&rdquo;
          </p>
        )}
      </div>

      <div className="h-px w-6 bg-accent" />

      <div className="flex gap-6">
        <Stat value={places.length} label="Places" />
        <Stat value={withNotes} label="With notes" />
        <Stat value={withPhotos} label="With photos" />
      </div>

      <PublishControl
        guideId={guide.id}
        isPublic={guide.is_public}
        publicUrl={publicUrl}
      />

      {places.length > 1 && (
        <Link
          href={`/guides/${guide.slug}/reorder`}
          className="inline-flex w-full items-center justify-center gap-1.5 border border-border bg-transparent px-4 py-2.5 font-serif text-[11px] uppercase text-ink"
          style={{ letterSpacing: "0.08em" }}
        >
          Reorder places
        </Link>
      )}

      {pins.length > 0 && (
        <div className="h-[160px] w-full overflow-hidden border border-border-bold">
          <MapPanel pins={pins} />
        </div>
      )}

      {sortedCategories.length > 0 && (
        <div>
          <p
            className="m-0 mb-2.5 font-sans text-[9px] font-semibold uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            By category
          </p>
          {sortedCategories.map(([cat, count]) => (
            <div
              key={cat}
              className="flex items-center justify-between border-b border-border-soft py-1.5 last:border-b-0"
            >
              <span className="font-serif text-[12px] text-ink-muted">
                {cat}
              </span>
              <span className="font-serif text-[12px] text-faint">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="m-0 mb-0.5 font-serif text-[20px] text-ink">{value}</p>
      <p
        className="m-0 font-sans text-[9px] uppercase text-faint"
        style={{ letterSpacing: "0.1em" }}
      >
        {label}
      </p>
    </div>
  );
}
