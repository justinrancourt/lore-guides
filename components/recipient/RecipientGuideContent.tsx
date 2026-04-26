"use client";

import { useMemo, useState } from "react";
import { BEST_TIMES } from "@/lib/types";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { cn } from "@/lib/cn";
import { RecipientPlaceRow } from "./RecipientPlaceRow";

const TIME_OPTIONS = ["All", ...BEST_TIMES] as const;
type TimeFilter = (typeof TIME_OPTIONS)[number];

interface RecipientGuideContentProps {
  guideSlug: string;
  authorName: string;
  places: PlaceWithGuidesAndPhotos[];
  /** Server-resolved set of place_ids the current user has already
   *  saved. Each row owns its own optimistic toggle from there. */
  initialSavedPlaceIds: Set<string>;
  /** Notify the parent of the active place (for map sync). When the
   *  parent passes activePlaceId, that pin highlights on the map. */
  activePlaceId?: string | null;
  onActiveChange?: (id: string | null) => void;
}

// The scrollable content of the recipient guide view. Used inside both
// the mobile stacked layout and the desktop split-panel left column.
// Per the spec the recipient view filters by time only, not the
// dual-axis used in the author guide view.
export function RecipientGuideContent({
  guideSlug,
  authorName,
  places,
  initialSavedPlaceIds,
  activePlaceId,
  onActiveChange,
}: RecipientGuideContentProps) {
  const [time, setTime] = useState<TimeFilter>("All");

  const visible = useMemo(
    () =>
      time === "All" ? places : places.filter((p) => p.best_time === time),
    [places, time],
  );

  return (
    <>
      <div className="border-b border-border-soft px-5 sm:px-8">
        <div className="scrollbar-none flex items-center gap-4 overflow-x-auto pb-2.5 pt-1">
          {TIME_OPTIONS.map((opt) => {
            const active = opt === time;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setTime(opt)}
                className={cn(
                  "shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent px-0 py-2 font-serif text-[11px] uppercase",
                  active
                    ? "border-b-[1.5px] border-ink text-ink"
                    : "border-b-[1.5px] border-transparent text-faint",
                )}
                style={{ letterSpacing: "0.1em" }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 sm:px-8">
        {visible.length === 0 ? (
          <p className="py-12 text-center font-serif italic text-[14px] text-faint">
            Nothing matches that time of day.
          </p>
        ) : (
          visible.map((p, i) => (
            <RecipientPlaceRow
              key={p.id}
              place={p}
              index={i + 1}
              authorName={authorName}
              guideSlug={guideSlug}
              initiallySaved={initialSavedPlaceIds.has(p.id)}
              isActive={activePlaceId === p.id}
              onToggleActive={(next) =>
                onActiveChange?.(next ? p.id : null)
              }
            />
          ))
        )}
      </div>
    </>
  );
}
