// Deterministic hashes from a place name. Used by PlaceCoverThumbnail
// to vary tint and halftone center per place — same name → same look.

export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function hashFloat(s: string, salt = 0): number {
  const h = hashStr(s + String(salt));
  return (h % 10000) / 10000;
}
