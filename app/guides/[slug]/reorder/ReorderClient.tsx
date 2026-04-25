"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BEST_TIMES, type BestTime } from "@/lib/types";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { reorderPlacesInGuide } from "@/lib/actions/places";

interface ReorderClientProps {
  guideId: string;
  guideSlug: string;
  places: PlaceWithGuidesAndPhotos[];
}

// Drag-to-reorder, grouped by best_time. Drags stay within their group —
// crossing into a different time bucket would mean changing the place's
// best_time, which is an edit-place flow, not reorder.
export function ReorderClient({
  guideId,
  guideSlug,
  places: initial,
}: ReorderClientProps) {
  const [places, setPlaces] = useState(initial);
  const [pending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
  );

  // Bucket once per render. Keys preserve display order across drags.
  const buckets = useMemo(() => {
    const groups: Array<[BestTime | "Unscheduled", PlaceWithGuidesAndPhotos[]]> = [];
    for (const time of BEST_TIMES) {
      const inBucket = places.filter((p) => p.best_time === time);
      if (inBucket.length > 0) groups.push([time, inBucket]);
    }
    const unscheduled = places.filter((p) => !p.best_time);
    if (unscheduled.length > 0) groups.push(["Unscheduled", unscheduled]);
    return groups;
  }, [places]);

  const persist = (next: PlaceWithGuidesAndPhotos[]) => {
    setPlaces(next);
    startTransition(async () => {
      await reorderPlacesInGuide(
        guideSlug,
        guideId,
        next.map((p) => p.id),
      );
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Active and over must be in the same bucket; ignore cross-bucket
    // drops (the SortableContext per bucket already prevents this).
    const oldIndex = places.findIndex((p) => p.id === active.id);
    const newIndex = places.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    if (places[oldIndex].best_time !== places[newIndex].best_time) return;

    persist(arrayMove(places, oldIndex, newIndex));
  };

  if (places.length === 0) {
    return (
      <p className="px-5 pt-12 text-center font-serif italic text-[14px] text-faint">
        No places to reorder.
      </p>
    );
  }

  return (
    <div className="px-5 pb-16 pt-5">
      <p className="m-0 mb-5 font-serif italic text-[13px] text-faint">
        Drag to reorder. Grouped by time of day.
        {pending && <span className="ml-2 text-accent">· Saving…</span>}
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {buckets.map(([time, inBucket]) => (
          <section key={time} className="mb-7">
            <h2
              className="m-0 mb-2 font-serif text-[10px] uppercase text-accent"
              style={{ letterSpacing: "0.18em" }}
            >
              {time}
            </h2>
            <SortableContext
              items={inBucket.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {inBucket.map((p) => (
                <ReorderRow key={p.id} place={p} />
              ))}
            </SortableContext>
          </section>
        ))}
      </DndContext>
    </div>
  );
}

function ReorderRow({ place }: { place: PlaceWithGuidesAndPhotos }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: place.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-1.5 flex cursor-grab touch-none items-center gap-3 border border-border bg-surface px-3 py-3 active:cursor-grabbing"
    >
      <DragHandle />
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate font-serif text-[14px] text-ink">
          {place.name}
        </p>
        {place.neighborhood && (
          <p className="m-0 mt-0.5 truncate font-serif italic text-[12px] text-faint">
            {place.neighborhood}
          </p>
        )}
      </div>
      {place.type && (
        <span
          className="shrink-0 font-serif text-[10px] uppercase text-faint"
          style={{ letterSpacing: "0.14em" }}
        >
          {place.type}
        </span>
      )}
    </div>
  );
}

function DragHandle() {
  return (
    <svg
      width="9"
      height="13"
      viewBox="0 0 9 13"
      fill="none"
      className="shrink-0 text-faint"
    >
      <circle cx="2" cy="2" r="1" fill="currentColor" />
      <circle cx="7" cy="2" r="1" fill="currentColor" />
      <circle cx="2" cy="6.5" r="1" fill="currentColor" />
      <circle cx="7" cy="6.5" r="1" fill="currentColor" />
      <circle cx="2" cy="11" r="1" fill="currentColor" />
      <circle cx="7" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}
