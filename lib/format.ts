// Tiny formatting helpers used by screen components.

const DAY_MS = 86_400_000;

export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / DAY_MS);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "last month";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

// Deterministic warm color from any seed string. Used as a photo
// placeholder fill before a real photo is uploaded — keeps cards from
// looking identically gray during the empty-photo state.
const PALETTE = [
  "#C17C4E", "#7A8B5E", "#4A6B8B", "#6B4E3D",
  "#8B4E6B", "#C8A05C", "#5C6B8B", "#A68B6B",
  "#B08968", "#8B6F4E", "#4A3728", "#D4A574",
];

export function placeholderColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
