"use client";

import { useState } from "react";
import type { Place } from "@/lib/types";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { TimeSensitiveFlag } from "@/components/primitives/TimeSensitiveFlag";
import { PhotoBlock } from "@/components/primitives/PhotoBlock";
import { cn } from "@/lib/cn";

interface RecipientPlaceRowProps {
  place: Place;
  index: number;
  authorName: string;
  saved: boolean;
  onToggleSaved: () => void;
}

export function RecipientPlaceRow({
  place,
  index,
  authorName,
  saved,
  onToggleSaved,
}: RecipientPlaceRowProps) {
  const [expanded, setExpanded] = useState(false);
  const ordinal = String(index).padStart(2, "0");

  return (
    <div className="flex items-baseline gap-4 border-t border-border py-5">
      <span
        className="w-5 shrink-0 font-serif text-[12px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {ordinal}
      </span>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <span className="block font-serif text-place text-ink">
          {place.name}
        </span>
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
                  {authorName}&rsquo;s note
                </p>
                <p className="m-0 font-serif text-[14px] leading-[1.7] text-ink-muted">
                  {place.note}
                </p>
              </>
            )}
            {place.photoColor && (
              <PhotoBlock color={place.photoColor} caption={place.photoCaption} />
            )}
          </div>
        )}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSaved();
        }}
        aria-label={saved ? "Saved" : "Save place"}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center self-start border-0 bg-transparent",
        )}
      >
        <Icon
          path={IconPath.bookmark}
          size={18}
          color={saved ? "#C17C4E" : "#9C8E7C"}
          fill={saved ? "#C17C4E" : "none"}
          stroke={1.5}
        />
      </button>
    </div>
  );
}
