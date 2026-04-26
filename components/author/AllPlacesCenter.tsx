"use client";

import { useMemo, useState } from "react";
import type { GuideWithCount } from "@/lib/db/guides";
import type { PlaceWithGuides } from "@/lib/db/places";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { useCapture } from "@/components/capture/CaptureProvider";
import { CompactPlaceRow } from "./CompactPlaceRow";
import { cn } from "@/lib/cn";

interface AllPlacesCenterProps {
  places: PlaceWithGuides[];
  guides: GuideWithCount[];
}

type Filter = "all" | "unfiled" | string;

// Center-column content for /home (all-places view). Sticky header with
// title + meta + guide filter pills, then the place list. When the
// filter is "All", places are grouped under guide section headers; for
// any specific filter, just a flat list.
export function AllPlacesCenter({ places, guides }: AllPlacesCenterProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const { open: openCapture } = useCapture();

  const visible = useMemo(() => {
    if (filter === "all") return places;
    if (filter === "unfiled") {
      return places.filter((p) => p.guide_ids.length === 0);
    }
    return places.filter((p) => p.guide_ids.includes(filter));
  }, [places, filter]);

  const needsNotes = places.filter((p) => !p.note).length;

  // For the All filter we group by primary guide. A place belongs to
  // 0 or more guides; for grouping we pick the first guide_id (or
  // "Unfiled" when there's none) and bucket on that.
  const grouped = useMemo(() => {
    if (filter !== "all") return null;
    const buckets = new Map<string, PlaceWithGuides[]>();
    for (const p of visible) {
      const key = p.guide_ids[0] ?? "_unfiled";
      const arr = buckets.get(key) ?? [];
      arr.push(p);
      buckets.set(key, arr);
    }
    // Order: by guide creation order (== sidebar order) then unfiled last
    const ordered: Array<{ key: string; label: string; color: string | null; rows: PlaceWithGuides[] }> = [];
    for (const g of guides) {
      const rows = buckets.get(g.id);
      if (rows && rows.length > 0) {
        ordered.push({ key: g.id, label: g.title, color: g.color, rows });
      }
    }
    const unfiled = buckets.get("_unfiled");
    if (unfiled && unfiled.length > 0) {
      ordered.push({ key: "_unfiled", label: "Unfiled", color: null, rows: unfiled });
    }
    return ordered;
  }, [filter, visible, guides]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-bg px-5 pt-6 sm:px-7">
        <h1 className="m-0 font-serif text-[22px] font-normal text-ink">
          Every place I&rsquo;ve saved
        </h1>
        <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
          {places.length} {places.length === 1 ? "place" : "places"}
          {needsNotes > 0 && ` · ${needsNotes} need notes`}
        </p>
        <div className="scrollbar-none mt-3.5 flex gap-2 overflow-x-auto pb-3.5">
          <FilterPill
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {guides.map((g) => (
            <FilterPill
              key={g.id}
              label={g.title}
              color={g.color}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
            />
          ))}
          <FilterPill
            label="Unfiled"
            active={filter === "unfiled"}
            onClick={() => setFilter("unfiled")}
          />
        </div>
      </header>

      <div className="px-5 sm:px-7">
        {visible.length === 0 ? (
          <p className="py-16 text-center font-serif italic text-[14px] text-faint">
            Nothing here. Try a different filter.
          </p>
        ) : grouped ? (
          grouped.map((group) => (
            <div key={group.key}>
              <GroupHeader label={group.label} count={group.rows.length} color={group.color} />
              {group.rows.map((p) => (
                <CompactPlaceRow key={p.id} place={p} />
              ))}
            </div>
          ))
        ) : (
          visible.map((p) => <CompactPlaceRow key={p.id} place={p} />)
        )}

        <button
          type="button"
          onClick={openCapture}
          className="flex w-full items-center justify-center gap-2 border-0 bg-transparent py-5 font-serif text-[13px] text-faint transition-colors hover:text-ink"
        >
          <Icon path={IconPath.plus} size={14} color="currentColor" />
          Add a place
        </button>
      </div>
    </>
  );
}

function FilterPill({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1 font-sans text-[10px] uppercase",
        active
          ? "border-ink bg-ink text-bg"
          : "border-border bg-transparent text-faint",
      )}
      style={{ letterSpacing: "0.06em" }}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-circle"
          style={{ backgroundColor: active ? "#fff" : color }}
        />
      )}
      {label}
    </button>
  );
}

function GroupHeader({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string | null;
}) {
  return (
    <div className="flex items-center gap-1.5 pt-5 first:pt-3">
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-circle"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className="font-sans text-[9px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </span>
      <span className="font-sans text-[9px] text-faint opacity-60">
        · {count}
      </span>
    </div>
  );
}
