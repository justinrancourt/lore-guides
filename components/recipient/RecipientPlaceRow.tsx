"use client";

import { Icon, IconPath } from "@/components/primitives/Icon";
import { TimeSensitiveFlag } from "@/components/primitives/TimeSensitiveFlag";
import { PhotoBlock } from "@/components/primitives/PhotoBlock";
import { cn } from "@/lib/cn";
import { placeholderColor } from "@/lib/format";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";

interface RecipientPlaceRowProps {
  place: PlaceWithGuidesAndPhotos;
  index: number;
  authorName: string;
  saved: boolean;
  onToggleSaved: () => void;
  /** Active = expanded + map pin highlighted. Single source of truth
   *  lives in the parent (RecipientLandingShell) so the map and list
   *  stay in sync without duplicated local state. */
  isActive?: boolean;
  /** Toggle handler — fires with the next active state. */
  onToggleActive?: (next: boolean) => void;
}

export function RecipientPlaceRow({
  place,
  index,
  authorName,
  saved,
  onToggleSaved,
  isActive,
  onToggleActive,
}: RecipientPlaceRowProps) {
  const ordinal = String(index).padStart(2, "0");
  const cover = place.photos[0];

  const handleExpand = () => onToggleActive?.(!isActive);

  return (
    <div
      className={cn(
        "flex items-baseline gap-4 border-t border-border py-5 transition-colors",
        isActive && "bg-[rgba(193,124,78,0.05)]",
      )}
    >
      <span
        className="w-5 shrink-0 font-serif text-[12px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {ordinal}
      </span>
      <button
        type="button"
        onClick={handleExpand}
        className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <span className="block font-serif text-place text-ink">{place.name}</span>
        <div className="mb-2.5 mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {place.best_time && place.type && (
            <span
              className="font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.12em" }}
            >
              {place.best_time} · {place.type}
            </span>
          )}
          {place.neighborhood && (
            <span className="font-serif italic text-meta text-faint">
              {place.neighborhood}
            </span>
          )}
          {place.time_sensitive && (
            <TimeSensitiveFlag text={place.time_sensitive} />
          )}
        </div>
        {place.vibe && (
          <p className="m-0 font-serif italic text-[14px] text-ink-muted">
            {place.vibe}
          </p>
        )}
        {isActive && (
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
            {cover && (
              <PhotoBlock
                src={cover.url}
                color={placeholderColor(place.id)}
                caption={cover.caption ?? undefined}
              />
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
        className="flex h-8 w-8 shrink-0 items-center justify-center self-start border-0 bg-transparent"
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
