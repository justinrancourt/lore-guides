"use client";

import { useMemo, useState } from "react";
import { BEST_TIMES, PLACE_TYPES } from "@/lib/types";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { DualFilterBar } from "@/components/primitives/DualFilterBar";
import { StickyHeader } from "@/components/primitives/StickyHeader";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { RecipientPlaceRow } from "./RecipientPlaceRow";

const TIME_OPTIONS = ["All", ...BEST_TIMES] as const;
const TYPE_OPTIONS = ["All", ...PLACE_TYPES] as const;

type TimeFilter = (typeof TIME_OPTIONS)[number];
type TypeFilter = (typeof TYPE_OPTIONS)[number];

interface RecipientGuideViewProps {
  city: string;
  authorName: string;
  places: PlaceWithGuidesAndPhotos[];
}

export function RecipientGuideView({
  city,
  authorName,
  places,
}: RecipientGuideViewProps) {
  const [time, setTime] = useState<TimeFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const visible = useMemo(
    () =>
      places.filter(
        (p) =>
          (time === "All" || p.best_time === time) &&
          (type === "All" || p.type === type),
      ),
    [places, time, type],
  );

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="flex gap-2 px-5 pb-3 pt-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 bg-ink py-2.5 font-serif text-[12px] uppercase text-bg"
          style={{ letterSpacing: "0.14em" }}
        >
          <Icon path={IconPath.bookmark} size={14} />
          Save guide
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-border bg-transparent px-4 py-2.5 font-serif text-[12px] uppercase text-ink-muted"
          style={{ letterSpacing: "0.14em" }}
        >
          <Icon path={IconPath.mapPin} size={14} />
          Map
        </button>
      </div>

      <StickyHeader
        city={city}
        count={visible.length}
        rightSlot={
          saved.size > 0 ? (
            <span className="inline-flex items-center gap-1 font-serif text-[11px] uppercase text-accent" style={{ letterSpacing: "0.14em" }}>
              <Icon path={IconPath.bookmark} size={12} fill="#C17C4E" color="#C17C4E" />
              {saved.size} saved
            </span>
          ) : null
        }
        filters={
          <DualFilterBar
            time={time}
            onTime={setTime}
            timeOptions={TIME_OPTIONS}
            type={type}
            onType={setType}
            typeOptions={TYPE_OPTIONS}
          />
        }
      />

      <div className="px-5">
        {visible.length === 0 ? (
          <p className="py-12 text-center font-serif italic text-[14px] text-faint">
            Nothing matches that filter — try another combination.
          </p>
        ) : (
          visible.map((p, i) => (
            <RecipientPlaceRow
              key={p.id}
              place={p}
              index={i + 1}
              authorName={authorName}
              saved={saved.has(p.id)}
              onToggleSaved={() => toggleSaved(p.id)}
            />
          ))
        )}
      </div>
    </>
  );
}
