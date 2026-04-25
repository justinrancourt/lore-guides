"use client";

import { useState } from "react";
import type { GuideRow } from "@/lib/db/guides";
import type { PlaceWithGuides } from "@/lib/db/places";
import { cn } from "@/lib/cn";
import { MyPlacesCard } from "./MyPlacesCard";

interface MyPlacesListProps {
  places: PlaceWithGuides[];
  guides: GuideRow[];
  unfiledCount: number;
}

type Filter = "all" | "unfiled" | string;

export function MyPlacesList({
  places,
  guides,
  unfiledCount,
}: MyPlacesListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? places
      : filter === "unfiled"
        ? places.filter((p) => p.guide_ids.length === 0)
        : places.filter((p) => p.guide_ids.includes(filter));

  return (
    <>
      <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 py-3">
        <FilterChip
          label="All"
          variant="solid"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {guides.map((g) => (
          <FilterChip
            key={g.id}
            label={g.title}
            color={g.color}
            active={filter === g.id}
            onClick={() => setFilter(g.id)}
          />
        ))}
        <FilterChip
          label="Unfiled"
          active={filter === "unfiled"}
          onClick={() => setFilter("unfiled")}
          subtle={unfiledCount === 0}
        />
      </div>
      <div className="px-5">
        {visible.length === 0 ? (
          <p className="py-12 text-center font-serif italic text-[14px] text-faint">
            No places match this filter.
          </p>
        ) : (
          visible.map((p) => (
            <MyPlacesCard key={p.id} place={p} guides={guides} />
          ))
        )}
      </div>
    </>
  );
}

function FilterChip({
  label,
  color,
  active,
  variant,
  subtle,
  onClick,
}: {
  label: string;
  color?: string;
  active?: boolean;
  variant?: "solid";
  subtle?: boolean;
  onClick: () => void;
}) {
  if (variant === "solid") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "shrink-0 whitespace-nowrap rounded-pill px-3 py-1 font-serif text-[11px] uppercase",
          active ? "bg-ink text-bg" : "bg-surface text-faint",
        )}
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1 font-serif text-[11px] uppercase",
        active ? "border-ink text-ink" : "border-border text-faint",
        subtle && "opacity-60",
      )}
      style={{ letterSpacing: "0.14em" }}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-circle"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </button>
  );
}
