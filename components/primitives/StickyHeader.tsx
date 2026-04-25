import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StickyHeaderProps {
  city: string;
  count: number;
  /** Optional content rendered on the right of the title row (e.g. saved count). */
  rightSlot?: ReactNode;
  /** Optional second row, typically a FilterBar. */
  filters?: ReactNode;
  /** When true, render but don't actually stick. Useful inside a previewed surface. */
  static?: boolean;
}

export function StickyHeader({
  city,
  count,
  rightSlot,
  filters,
  static: isStatic,
}: StickyHeaderProps) {
  return (
    <div
      className={cn(
        "z-[18] border-b border-border bg-bg px-5 pb-2.5 pt-3",
        !isStatic && "sticky top-0",
      )}
    >
      <div
        className={cn(
          "flex items-baseline gap-2.5",
          filters && "mb-2.5",
        )}
      >
        <span
          className="font-serif text-[15px] text-ink"
          style={{ letterSpacing: "-0.005em" }}
        >
          {city}
        </span>
        <span
          className="font-serif text-[11px] uppercase text-faint"
          style={{ letterSpacing: "0.14em" }}
        >
          {count} places
        </span>
        {rightSlot && <span className="ml-auto">{rightSlot}</span>}
      </div>
      {filters}
    </div>
  );
}
