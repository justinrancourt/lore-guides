// Deterministic halftone vignette — same inputs always produce the same
// dot pattern. SSR-safe (no Math.random), so server- and client-side
// renders match. Used by PlaceCoverCard (hero) and PlaceCoverThumbnail
// (square list size).

export interface Dot {
  x: number;
  y: number;
  r: number;
}

function sinHash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

// Larger dots at the edges, sparser in the middle = vignette feel.
// `centerX` / `centerY` shift the bright spot off-center (used by the
// thumbnail to vary each place's pattern).
export function generateHalftone(
  width: number,
  height: number,
  cols: number,
  rows: number,
  centerX = 0.5,
  centerY = 0.5,
  threshold = 0.4,
): Dot[] {
  const spacingX = width / cols;
  const spacingY = height / rows;
  const dots: Dot[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r = sinHash(x, y);
      if (r <= threshold) continue;

      const normX = x / cols;
      const normY = y / rows;
      const dist = Math.sqrt(
        (normX - centerX) ** 2 + (normY - centerY) ** 2,
      );
      const dotRadius = r * 1.6 * (0.2 + dist * 1.1);

      dots.push({
        x: x * spacingX + spacingX / 2,
        y: y * spacingY + spacingY / 2,
        r: dotRadius,
      });
    }
  }

  return dots;
}
