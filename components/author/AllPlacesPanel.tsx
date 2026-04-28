import type { GuideWithCount } from "@/lib/db/guides";
import type { PlaceWithGuides } from "@/lib/db/places";
import { MapPanel, type MapPin } from "@/components/recipient/MapPanel";

interface AllPlacesPanelProps {
  places: PlaceWithGuides[];
  guides: GuideWithCount[];
}

// Right-panel content when "All places" is selected in the sidebar.
// Per the spec: overview map, stats grid, "N need notes" nudge,
// breakdown by guide with progress bars, breakdown by category.
export function AllPlacesPanel({ places, guides }: AllPlacesPanelProps) {
  const total = places.length;
  const withNotes = places.filter((p) => p.note && p.note.length > 0).length;
  const withPhotos = places.filter((p) => p.cover_url !== null).length;
  const needsNotes = total - withNotes;

  // Numbered pins on the overview map. Cap at 20 so a user with 100+
  // saved places doesn't drown the right panel.
  const pins: MapPin[] = places
    .slice(0, 20)
    .map((p, i) => ({
      id: p.id,
      index: i + 1,
      lat: p.lat,
      lng: p.lng,
    }));

  // By-guide counts (only counts guides that have at least one place).
  const guideCounts = guides
    .map((g) => ({
      guide: g,
      count: places.filter((p) => p.guide_ids.includes(g.id)).length,
    }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count);

  // By-category counts. "Unfiled" bucket is everything with no type.
  const categoryCounts = new Map<string, number>();
  for (const p of places) {
    const key = p.type ?? "Untyped";
    categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
  }
  const sortedCategories = Array.from(categoryCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="flex flex-col gap-6 px-6 py-7">
      <div className="h-[200px] w-full overflow-hidden border border-border-bold">
        <MapPanel pins={pins} />
      </div>

      <Section label="Overview">
        <div className="grid grid-cols-2 gap-2.5">
          <Stat value={total} label="Total places" />
          <Stat value={guides.length} label="Guides" />
          <Stat value={withNotes} label="With notes" />
          <Stat value={withPhotos} label="With photos" />
        </div>
      </Section>

      {needsNotes > 0 && (
        <div className="border border-banner-border bg-banner-bg px-4 py-3.5">
          <p className="m-0 mb-0.5 font-serif text-[13px] text-accent-deep">
            {needsNotes} {needsNotes === 1 ? "place" : "places"} without notes
          </p>
          <p className="m-0 font-serif italic text-[11px] text-faint">
            A place without your note is just a pin.
          </p>
        </div>
      )}

      {guideCounts.length > 0 && (
        <Section label="By guide">
          <div className="flex flex-col gap-3">
            {guideCounts.map(({ guide, count }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={guide.id}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-serif text-[13px] text-ink">
                      <span
                        className="h-[7px] w-[7px] rounded-circle"
                        style={{ backgroundColor: guide.color }}
                      />
                      {guide.title}
                    </span>
                    <span className="font-serif text-[12px] text-faint">
                      {count}
                    </span>
                  </div>
                  <div className="h-[3px] overflow-hidden bg-border-soft">
                    <div
                      className="h-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: guide.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {sortedCategories.length > 0 && (
        <Section label="By category">
          <div>
            {sortedCategories.map(([cat, count]) => (
              <div
                key={cat}
                className="flex items-center justify-between border-b border-border-soft py-1.5 last:border-b-0"
              >
                <span className="font-serif text-[12px] text-ink-muted">
                  {cat}
                </span>
                <span className="font-serif text-[12px] text-faint">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="m-0 mb-2.5 font-sans text-[9px] font-semibold uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-surface px-3 py-3">
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
