"use client";

import { cn } from "@/lib/cn";

// Parchment-textured map placeholder. Same prop signature the eventual
// Mapbox component will have — when the real map ships, replace the
// body of this file and nothing upstream needs to change.
//
// Pins are positioned by index (deterministic spread across the panel)
// rather than lat/lng, so they look intentional in the placeholder.

export interface MapPin {
  id: string;
  /** 1-based ordinal shown in the pin badge. */
  index: number;
  /** Optional real coordinates — ignored by the placeholder, used by
   *  the Mapbox replacement. */
  lat?: number;
  lng?: number;
}

interface MapPanelProps {
  pins: MapPin[];
  /** Currently-selected pin id (highlights + raises). */
  active?: string | null;
  onPinClick?: (id: string) => void;
  className?: string;
}

// Deterministic non-geographic spread. Lays N pins around an inner
// rectangle so the placeholder reads like a map without pretending to
// be Valencia or anywhere specific. Mapbox swap replaces this entirely.
function pinPosition(i: number, total: number): { x: number; y: number } {
  if (total === 1) return { x: 50, y: 50 };
  // Loose spiral that avoids the corners and the right-edge water area.
  const angle = (i / total) * Math.PI * 2 + 0.3;
  const radius = 22 + ((i * 7) % 12);
  const cx = 42;
  const cy = 50;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

export function MapPanel({ pins, active, onPinClick, className }: MapPanelProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-map-bg",
        className,
      )}
      role="img"
      aria-label="Map placeholder — Mapbox arriving in a future update"
    >
      {/* Water area on the right edge, faded into the parchment */}
      <div
        aria-hidden
        className="absolute right-0 top-0 h-full w-[35%] bg-map-water opacity-60"
      />
      <div
        aria-hidden
        className="absolute right-[33%] top-0 h-full w-[8%] opacity-60"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(217, 232, 236, 0.4))",
        }}
      />

      {/* Subtle road / district grid */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="78%" x2="100%" y2="78%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.5" />
        <line x1="55%" y1="0" x2="55%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
        <path
          d="M0 40 Q80 55 160 35 Q240 20 350 50"
          stroke="#CADBD5"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
      </svg>

      {/* Pins */}
      {pins.map((pin, i) => {
        const { x, y } = pinPosition(i, pins.length);
        const isActive = pin.id === active;
        return (
          <button
            key={pin.id}
            type="button"
            onClick={() => onPinClick?.(pin.id)}
            className={cn(
              "absolute flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-circle font-sans text-[10px] font-semibold text-on-accent transition-all",
              isActive
                ? "z-10 h-[28px] w-[28px] bg-accent shadow-[0_2px_8px_rgba(193,124,78,0.35)] ring-2 ring-bg"
                : "bg-map-pin shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-bg",
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`Pin ${pin.index}`}
          >
            {pin.index}
          </button>
        );
      })}

      {/* Faint placeholder attribution. Replaced by Mapbox copyright once
          the real map ships. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1.5 right-2 font-sans text-[9px] text-faint opacity-60"
      >
        Map preview
      </span>
    </div>
  );
}
