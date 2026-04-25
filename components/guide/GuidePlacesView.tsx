"use client";

import { useMemo, useState } from "react";
import type { Place } from "@/lib/types";
import { BEST_TIMES, PLACE_TYPES } from "@/lib/types";
import { PlaceRow } from "@/components/place/PlaceRow";
import { DualFilterBar } from "@/components/primitives/DualFilterBar";
import { StickyHeader } from "@/components/primitives/StickyHeader";

const TIME_OPTIONS = ["All", ...BEST_TIMES] as const;
const TYPE_OPTIONS = ["All", ...PLACE_TYPES] as const;

type TimeFilter = (typeof TIME_OPTIONS)[number];
type TypeFilter = (typeof TYPE_OPTIONS)[number];

interface GuidePlacesViewProps {
  city: string;
  places: Place[];
}

export function GuidePlacesView({ city, places }: GuidePlacesViewProps) {
  const [time, setTime] = useState<TimeFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");

  const visible = useMemo(
    () =>
      places.filter(
        (p) =>
          (time === "All" || p.bestTime === time) &&
          (type === "All" || p.type === type),
      ),
    [places, time, type],
  );

  return (
    <>
      <StickyHeader
        city={city}
        count={visible.length}
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
            <PlaceRow key={p.id} place={p} index={i + 1} />
          ))
        )}
      </div>
    </>
  );
}
