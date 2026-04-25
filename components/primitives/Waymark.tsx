// The brand mark: a 5-point star polygon. Used as the logomark and as map
// pins. Outline variant for inline use, filled variant for pin markers.

interface WaymarkProps {
  size?: number;
  color?: string;
  className?: string;
}

const POINTS =
  "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2";

export function Waymark({ size = 16, color, className }: WaymarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth="1.75"
      className={className}
    >
      <polygon points={POINTS} />
    </svg>
  );
}

interface WaymarkFilledProps {
  size?: number;
  fill?: string;
  stroke?: string;
}

export function WaymarkFilled({
  size = 14,
  fill = "#C17C4E",
  stroke,
}: WaymarkFilledProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke ?? fill}
      strokeWidth="1"
      strokeLinejoin="round"
    >
      <polygon points={POINTS} />
    </svg>
  );
}
