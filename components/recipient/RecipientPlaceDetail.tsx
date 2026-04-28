"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { TimeSensitiveFlag } from "@/components/primitives/TimeSensitiveFlag";
import { PhotoBlock } from "@/components/primitives/PhotoBlock";
import { PlaceCoverCard } from "@/components/place/PlaceCoverCard";
import { placeholderColor } from "@/lib/format";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import {
  toggleSavePlace,
  type SavePlaceFormState,
} from "@/lib/actions/saved-places";
import { MapPanel, type MapPin } from "./MapPanel";

interface RecipientPlaceDetailProps {
  guideSlug: string;
  guideTitle: string;
  guideCity: string | null;
  guideCountry: string | null;
  authorName: string;
  place: PlaceWithGuidesAndPhotos;
  siblings: PlaceWithGuidesAndPhotos[];
  /** This place's 1-based position in the guide. */
  index: number;
  totalPlaces: number;
  /** Server-resolved initial save state for the current user. */
  initiallySaved: boolean;
}

export function RecipientPlaceDetail({
  guideSlug,
  guideTitle,
  guideCity,
  guideCountry,
  authorName,
  place,
  siblings,
  index,
  totalPlaces,
  initiallySaved,
}: RecipientPlaceDetailProps) {
  const action = toggleSavePlace.bind(null, guideSlug, place.id);
  const [state, dispatch, pending] = useActionState<SavePlaceFormState, FormData>(
    action,
    { error: null, saved: initiallySaved },
  );
  const saved = state.saved ?? initiallySaved;
  const cover = place.photos[0];

  const pins: MapPin[] = [
    { id: place.id, index, lat: place.lat, lng: place.lng },
  ];

  const mapsUrl = place.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${place.name} ${place.address}`,
      )}`
    : null;

  const sidebar = (
    <aside className="lg:sticky lg:top-[80px] lg:w-[320px] lg:shrink-0">
      <div className="overflow-hidden border border-border-bold">
        <div className="h-[200px] w-full sm:h-[240px]">
          <MapPanel pins={pins} active={place.id} />
        </div>
      </div>
      <p className="m-0 mt-3 text-center font-serif italic text-[12px] text-faint">
        {index} of {totalPlaces} in {authorName}&rsquo;s {guideTitle}
      </p>

      {siblings.length > 0 && (
        <div className="mt-4 border border-border-soft bg-surface px-3 py-3">
          <p
            className="m-0 mb-2 font-sans text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.12em" }}
          >
            Also in this guide
          </p>
          <ul className="m-0 list-none p-0">
            {siblings.slice(0, 3).map((s) => (
              <li
                key={s.id}
                className="border-b border-border-soft py-2 last:border-b-0"
              >
                <Link
                  href={`/g/${guideSlug}/p/${s.id}`}
                  className="block"
                >
                  <p className="m-0 font-serif text-[13px] text-ink">{s.name}</p>
                  {s.neighborhood && (
                    <p className="m-0 mt-0.5 font-serif italic text-[11px] text-faint">
                      {s.neighborhood}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/g/${guideSlug}`}
            className="mt-3 inline-block font-serif text-[12px] text-accent"
          >
            View all {totalPlaces} places →
          </Link>
        </div>
      )}
    </aside>
  );

  const body = (
    <div className="lg:max-w-[520px] lg:flex-1">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {place.best_time && (
          <span
            className="font-serif text-[11px] uppercase text-accent"
            style={{ letterSpacing: "0.12em" }}
          >
            {place.best_time}
            {place.type ? ` · ${place.type}` : ""}
          </span>
        )}
        {place.time_sensitive && (
          <TimeSensitiveFlag text={place.time_sensitive} />
        )}
      </div>
      <h1
        className="m-0 font-serif text-[28px] font-normal leading-[1.15] text-ink sm:text-[32px]"
        style={{ letterSpacing: "-0.015em" }}
      >
        {place.name}
      </h1>
      {place.neighborhood && (
        <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
          {place.neighborhood}
        </p>
      )}

      <div className="mt-6">
        {cover ? (
          <PhotoBlock
            src={cover.url}
            color={placeholderColor(place.id)}
            caption={cover.caption ?? undefined}
          />
        ) : (
          <PlaceCoverCard
            name={place.name}
            neighborhood={place.neighborhood}
            city={guideCity}
            country={guideCountry}
            position={index}
          />
        )}
      </div>

      {place.note && (
        <p className="m-0 mt-5 font-serif text-[15px] leading-[1.85] text-ink-muted sm:text-[16px]">
          {place.note}
        </p>
      )}
      {place.vibe && (
        <p className="m-0 mt-4 font-serif italic text-[13px] text-faint">
          &ldquo;{place.vibe}&rdquo;
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-accent px-4 py-2.5 font-serif text-[11px] uppercase text-on-accent"
            style={{ letterSpacing: "0.06em" }}
          >
            <Icon path={IconPath.external} size={11} color="currentColor" />
            Get directions
          </a>
        )}
        <form action={dispatch} className="inline-block">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 border border-border-bold bg-transparent px-4 py-2.5 font-serif text-[11px] uppercase text-ink disabled:opacity-50"
            style={{ letterSpacing: "0.06em" }}
          >
            <Icon
              path={IconPath.bookmark}
              size={11}
              color={saved ? "#C17C4E" : "currentColor"}
              fill={saved ? "#C17C4E" : "none"}
            />
            {pending ? "Saving…" : saved ? "Saved" : "Save place"}
          </button>
        </form>
        {state.error && (
          <p className="m-0 mt-2 w-full font-serif italic text-[12px] text-accent">
            {state.error}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[960px] px-5 py-8 sm:px-8 sm:py-10 lg:flex lg:items-start lg:gap-10">
      {body}
      <div className="mt-8 lg:mt-0">{sidebar}</div>
    </div>
  );
}
