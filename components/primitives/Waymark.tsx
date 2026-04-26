// The Waymark — Lore Guides' brand mark. Two overlapping diamonds form
// a four-pointed compass star with a center dot. Spec: brand-book §2.1.
//
// Always rendered from code, never as a raster. The construction is
// proportional to `size`: outer extent = 44%, waist = 8% of canvas.
//
// Inner element classes (waymark-v / -h / -dot) are the hooks the
// Breathe animation in app/animations.css targets.

interface WaymarkProps {
  /** Square canvas size in px. The brand book lockups (§2.3) are 13,
   *  24, 32, 40, 56, 80 — same component scales to any of them. */
  size?: number;
  /** Stroke color. Defaults to ink (#2D2A26). For dark variants pass
   *  the canvas color; on accent backgrounds pass on-accent (#FFF). */
  color?: string;
  /** Override the default stroke width. The brand book maps stroke per
   *  size (§2.3) — auto-derived here as max(1, size/16). */
  strokeWidth?: number;
  className?: string;
}

export function Waymark({
  size = 16,
  color = "#2D2A26",
  strokeWidth,
  className,
}: WaymarkProps) {
  const c = size / 2;
  const outer = size * 0.44;
  const waist = size * 0.08;
  // Default stroke roughly matches the brand book lockup table —
  // ~1px @ 13–16, 1.6px @ 56, 2px @ 32 (favicon override case).
  const sw = strokeWidth ?? Math.max(1, size / 16);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label="Lore Guides"
      className={className}
    >
      {/* Vertical diamond */}
      <path
        className="waymark-v"
        d={`M${c} ${c - outer} L${c + waist} ${c} L${c} ${c + outer} L${c - waist} ${c} Z`}
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {/* Horizontal diamond */}
      <path
        className="waymark-h"
        d={`M${c - outer} ${c} L${c} ${c - waist} L${c + outer} ${c} L${c} ${c + waist} Z`}
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {/* Center dot */}
      <circle
        className="waymark-dot"
        cx={c}
        cy={c}
        r={sw * 0.7}
        fill={color}
        opacity={0.65}
      />
    </svg>
  );
}
