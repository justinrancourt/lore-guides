"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  enabled: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}

export function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-[22px] w-10 shrink-0 transition-colors duration-200 rounded-pill",
        enabled ? "bg-accent" : "bg-border-bold",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[3px] block h-4 w-4 rounded-circle bg-white transition-all duration-200",
          enabled ? "left-[21px]" : "left-[3px]",
        )}
      />
    </button>
  );
}
