"use client";

import { cn } from "@/lib/cn";
import { FilterBar } from "./FilterBar";

interface DualFilterBarProps<TimeT extends string, TypeT extends string> {
  time: TimeT;
  onTime: (next: TimeT) => void;
  timeOptions: readonly TimeT[];
  type: TypeT;
  onType: (next: TypeT) => void;
  typeOptions: readonly TypeT[];
  showMap?: boolean;
  mapActive?: boolean;
  onToggleMap?: () => void;
}

export function DualFilterBar<TimeT extends string, TypeT extends string>({
  time,
  onTime,
  timeOptions,
  type,
  onType,
  typeOptions,
  showMap,
  mapActive,
  onToggleMap,
}: DualFilterBarProps<TimeT, TypeT>) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-border-soft pb-2.5">
      <FilterBar
        value={time}
        onChange={onTime}
        options={timeOptions}
        showMap={showMap}
        mapActive={mapActive}
        onToggleMap={onToggleMap}
      />
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
        {typeOptions.map((opt) => {
          const active = opt === type;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onType(opt)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-pill px-3 py-1 font-serif text-[12px]",
                active
                  ? "border border-border-bold bg-surface text-ink not-italic"
                  : "border border-border bg-transparent italic text-faint",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
