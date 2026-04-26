"use client";

import { cn } from "@/lib/cn";
import { Icon, IconPath } from "./Icon";

interface FilterBarProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: readonly T[];
  showMap?: boolean;
  mapActive?: boolean;
  onToggleMap?: () => void;
}

export function FilterBar<T extends string>({
  value,
  onChange,
  options,
  showMap,
  mapActive,
  onToggleMap,
}: FilterBarProps<T>) {
  return (
    <div className="flex items-center gap-3">
      <div className="scrollbar-none flex flex-1 items-center gap-3 overflow-x-auto pb-0.5">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent px-0 py-0.5 font-serif text-[11px] uppercase",
                active
                  ? "text-ink border-b border-ink"
                  : "text-faint border-b border-transparent",
              )}
              style={{ letterSpacing: "0.12em" }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showMap && (
        <button
          type="button"
          onClick={onToggleMap}
          className={cn(
            "flex shrink-0 items-center gap-1 px-2.5 py-1 font-serif text-[10px] uppercase",
            mapActive
              ? "bg-ink text-bg border-0"
              : "border border-border text-faint",
          )}
          style={{ letterSpacing: "0.14em" }}
        >
          <Icon path={IconPath.mapPin} size={11} />
          Map
        </button>
      )}
    </div>
  );
}
