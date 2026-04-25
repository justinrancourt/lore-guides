"use client";

import { useState } from "react";
import type { Place } from "@/lib/types";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { TimeSensitiveFlag } from "@/components/primitives/TimeSensitiveFlag";
import { PhotoBlock } from "@/components/primitives/PhotoBlock";

interface PlaceRowProps {
  place: Place;
  index: number;
}

export function PlaceRow({ place, index }: PlaceRowProps) {
  const [expanded, setExpanded] = useState(false);
  const ordinal = String(index).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="block w-full cursor-pointer border-t border-border bg-transparent px-0 py-5 text-left"
    >
      <div className="flex items-baseline gap-4">
        <span
          className="w-5 shrink-0 font-serif text-[12px] uppercase text-faint"
          style={{ letterSpacing: "0.14em" }}
        >
          {ordinal}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className="font-serif text-place text-ink"
            >
              {place.name}
            </span>
          </div>
          <div className="mb-2.5 mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {place.bestTime && place.type && (
              <span
                className="font-serif text-[11px] uppercase text-faint"
                style={{ letterSpacing: "0.12em" }}
              >
                {place.bestTime} · {place.type}
              </span>
            )}
            {place.neighborhood && (
              <span className="font-serif italic text-meta text-faint">
                {place.neighborhood}
              </span>
            )}
            {place.timeSensitive && (
              <TimeSensitiveFlag text={place.timeSensitive} />
            )}
          </div>
          {place.vibe && (
            <p className="m-0 font-serif italic text-[14px] text-ink-muted">
              {place.vibe}
            </p>
          )}
          {expanded && (
            <div className="mt-3.5">
              {place.note && (
                <>
                  <p
                    className="m-0 mb-1.5 font-serif text-[11px] uppercase text-faint"
                    style={{ letterSpacing: "0.14em" }}
                  >
                    Your note
                  </p>
                  <p className="m-0 font-serif text-[14px] leading-[1.7] text-ink-muted">
                    {place.note}
                  </p>
                </>
              )}
              {place.photoColor && (
                <PhotoBlock
                  color={place.photoColor}
                  caption={place.photoCaption}
                />
              )}
            </div>
          )}
        </div>
        <span className="shrink-0 self-start pt-1">
          <Icon
            path={expanded ? IconPath.chevDown : IconPath.chevRight}
            size={14}
            color="#9C8E7C"
          />
        </span>
      </div>
    </button>
  );
}
