"use client";

import { cn } from "@/lib/cn";

interface ChipSelectProps<T extends string> {
  value: T | null;
  onChange: (next: T) => void;
  options: readonly T[];
}

export function ChipSelect<T extends string>({
  value,
  onChange,
  options,
}: ChipSelectProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-pill border px-2.5 py-[5px] font-serif text-[12px]",
              active
                ? "border-ink bg-surface text-ink"
                : "border-border bg-transparent text-faint",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
