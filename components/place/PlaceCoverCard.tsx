// Postcard × Lithograph cover. Renders when a place has no user photo
// — full spec in docs/place-cover-card-spec.md. Layers, back to front:
// sunken fill → halftone vignette → inset edge shadow → double border
// → centered editorial type stack.

import { cn } from "@/lib/cn";
import { generateHalftone } from "@/lib/halftone";

interface PlaceCoverCardProps {
  name: string;
  neighborhood?: string | null;
  city?: string | null;
  country?: string | null;
  /** 1-based ordinal within a guide. Omitted when no guide context. */
  position?: number;
  className?: string;
}

// Hero card always uses the same grid + center, so the dots are
// identical across all places. Compute once at module load.
const HERO_W = 480;
const HERO_H = 320;
const HERO_DOTS = generateHalftone(HERO_W, HERO_H, 48, 32);

export function PlaceCoverCard({
  name,
  neighborhood,
  city,
  country,
  position,
  className,
}: PlaceCoverCardProps) {
  const heading = renderHeading(name);
  const topLabel = [city, country].filter(Boolean).join(" · ");
  const ariaLabel = [name, neighborhood, city].filter(Boolean).join(", ");

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "relative w-full overflow-hidden bg-sunken",
        className,
      )}
      style={{
        aspectRatio: "3 / 2",
        borderRadius: "3px",
        boxShadow: "inset 0 0 70px rgba(45, 42, 38, 0.07)",
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${HERO_W} ${HERO_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.05 }}
      >
        {HERO_DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#2D2A26" />
        ))}
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute border border-border-bold"
        style={{ inset: "14px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute border border-border"
        style={{ inset: "18px", borderWidth: "0.5px" }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ padding: "36px 56px" }}
      >
        {topLabel && (
          <p
            className="m-0 mb-3 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.22em" }}
          >
            {topLabel}
          </p>
        )}

        <h2
          className="m-0 mb-4 font-serif text-ink"
          style={{
            fontSize: "38px",
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            fontWeight: 400,
          }}
        >
          {heading}
        </h2>

        {neighborhood && (
          <p
            className="m-0 mb-4 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.22em" }}
          >
            {neighborhood}
          </p>
        )}

        <DiamondDivider />

        {position != null && (
          <p
            className="m-0 mt-3.5 font-sans text-[9px] uppercase text-faint"
            style={{ letterSpacing: "0.35em", opacity: 0.6 }}
          >
            N° {position}
          </p>
        )}
      </div>
    </div>
  );
}

// Spec: 4+ words → break after word 2 (balanced two-line stack).
// 3 or fewer → single line.
function renderHeading(name: string): React.ReactNode {
  const words = name.trim().split(/\s+/);
  if (words.length <= 3) return name;
  const line1 = words.slice(0, 2).join(" ");
  const line2 = words.slice(2).join(" ");
  return (
    <>
      {line1}
      <br />
      {line2}
    </>
  );
}

function DiamondDivider() {
  return (
    <div className="flex items-center" style={{ gap: "8px" }}>
      <span
        aria-hidden
        className="bg-border-bold"
        style={{ width: "28px", height: "0.5px" }}
      />
      <span
        aria-hidden
        className="bg-accent"
        style={{
          width: "4px",
          height: "4px",
          transform: "rotate(45deg)",
          opacity: 0.6,
        }}
      />
      <span
        aria-hidden
        className="bg-border-bold"
        style={{ width: "28px", height: "0.5px" }}
      />
    </div>
  );
}

