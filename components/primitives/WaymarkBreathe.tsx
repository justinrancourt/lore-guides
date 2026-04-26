// Waymark with the Breathe loop applied. The brand book canonical
// loading affordance — used in place of spinners or skeletons.

import { Waymark } from "./Waymark";

interface WaymarkBreatheProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export function WaymarkBreathe({
  size = 40,
  color,
  strokeWidth,
  className,
}: WaymarkBreatheProps) {
  return (
    <span className={`waymark-breathe inline-block ${className ?? ""}`}>
      <Waymark
        size={size}
        color={color}
        strokeWidth={strokeWidth ?? Math.max(1.4, size / 22)}
      />
    </span>
  );
}
