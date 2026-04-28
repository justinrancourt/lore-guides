// Square sibling of PlaceCoverCard for list/row contexts. Same DNA
// (parchment + halftone + accent diamond + serif name) but stripped
// down for small sizes. Every thumbnail is name-seeded — same name
// always produces the same tint and halftone center.

import { generateHalftone } from "@/lib/halftone";
import { hashFloat, hashStr } from "@/lib/name-hash";
import { cn } from "@/lib/cn";

interface PlaceCoverThumbnailProps {
  name: string;
  /** Pixel dimension; component is always square. */
  size?: number;
  className?: string;
}

const TINTS = [
  "#EDE7DE",
  "#EBE4D8",
  "#E8E3DD",
  "#F0E8DC",
  "#E9E1D4",
  "#ECE5DA",
];

export function PlaceCoverThumbnail({
  name,
  size = 72,
  className,
}: PlaceCoverThumbnailProps) {
  const tint = TINTS[hashStr(name) % TINTS.length];
  const centerX = 0.3 + hashFloat(name, 1) * 0.4;
  const centerY = 0.3 + hashFloat(name, 2) * 0.4;
  const dots = generateHalftone(size, size, 12, 12, centerX, centerY, 0.45);
  const display = name.length > 18 ? name.slice(0, 16) + "…" : name;
  const fontSize = size <= 56 ? 8 : 9;

  return (
    <div
      role="img"
      aria-label={name}
      className={cn("relative shrink-0 overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        borderRadius: "3px",
        backgroundColor: tint,
        boxShadow: "inset 0 0 20px rgba(45, 42, 38, 0.06)",
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size} ${size}`}
        style={{ opacity: 0.05 }}
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#2D2A26" />
        ))}
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: "4px",
          border: "0.75px solid #D0C8BE",
          borderRadius: "2px",
        }}
      />

      <span
        aria-hidden
        className="absolute"
        style={{
          top: size * 0.22,
          left: "50%",
          width: "4px",
          height: "4px",
          backgroundColor: "#C17C4E",
          opacity: 0.5,
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
      />

      <div
        className="absolute flex items-center justify-center"
        style={{
          left: 0,
          right: 0,
          bottom: size * 0.18,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <span
          className="text-center text-ink"
          style={{
            fontFamily: "Georgia, serif",
            fontSize,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {display}
        </span>
      </div>
    </div>
  );
}
