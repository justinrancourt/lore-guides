"use client";

import { useState } from "react";
import type { GuideRow } from "@/lib/db/guides";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { MapPanel, type MapPin } from "./MapPanel";
import { RecipientCover } from "./RecipientCover";
import { RecipientGuideContent } from "./RecipientGuideContent";
import { EndOfGuideCTA } from "./EndOfGuideCTA";

interface RecipientLandingShellProps {
  guide: GuideRow;
  authorName: string;
  places: PlaceWithGuidesAndPhotos[];
}

// Top-level orchestrator for /g/[slug]. Owns the active-place state so
// the map and the place list can stay in sync. Renders three layouts:
// mobile stacked, tablet stacked-with-max-width, desktop split-panel.
export function RecipientLandingShell({
  guide,
  authorName,
  places,
}: RecipientLandingShellProps) {
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);

  const pins: MapPin[] = places.map((p, i) => ({
    id: p.id,
    index: i + 1,
    lat: p.lat ?? undefined,
    lng: p.lng ?? undefined,
  }));

  const content = (
    <>
      <RecipientCover
        guide={guide}
        authorName={authorName}
        placeCount={places.length}
      />
      <RecipientGuideContent
        authorName={authorName}
        places={places}
        activePlaceId={activePlaceId}
        onActiveChange={setActivePlaceId}
      />
      <EndOfGuideCTA authorName={authorName} guideTitle={guide.title} />
    </>
  );

  return (
    <>
      {/* Mobile + tablet: stacked. Map on top, content below. */}
      <div className="lg:hidden">
        <div className="h-[200px] w-full sm:h-[280px]">
          <MapPanel
            pins={pins}
            active={activePlaceId}
            onPinClick={setActivePlaceId}
          />
        </div>
        <div className="mx-auto max-w-[720px]">{content}</div>
      </div>

      {/* Desktop ≥ 1024: split panel. Fixed-width scrollable list on the
          left, persistent map on the right. */}
      <div className="hidden h-[calc(100vh-57px)] lg:flex">
        <div className="w-[420px] min-w-[380px] max-w-[480px] overflow-y-auto border-r border-border">
          {content}
        </div>
        <div className="relative flex-1">
          <MapPanel
            pins={pins}
            active={activePlaceId}
            onPinClick={setActivePlaceId}
          />
        </div>
      </div>
    </>
  );
}
