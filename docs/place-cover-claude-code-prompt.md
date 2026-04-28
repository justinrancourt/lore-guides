# Place Cover Components — Claude Code Implementation Prompt

## Context

We need two components that render placeholder covers for places that don't have a photo yet. They share the same visual DNA (parchment, halftone dots, editorial serif typography) but are sized for different contexts:

1. **PlaceCoverCard** — Hero size, used on place detail views. Aspect ratio 3:2, reference size 480×320.
2. **PlaceCoverThumbnail** — List/row size, used in place lists and guide cards. Square, typically 56–80px.

Both render only when `photo_url` is null/empty on a place record.

## Stack

- Next.js (React, TypeScript)
- Tailwind is available but these components use inline styles — the values are precise enough that utility classes would fight more than help
- Supabase backend (the data shape below matches the DB schema)

## Brand Tokens

Use these exact values. Define them in a shared constants file if one doesn't exist, or import from the existing theme/tokens file.

```ts
const tokens = {
  color: {
    canvas:     "#FAF8F5",
    surface:    "#F2EDE6",
    sunken:     "#EDE7DE",
    ink:        "#2D2A26",
    inkMuted:   "#4A4540",
    inkFaint:   "#9C8E7C",
    accent:     "#C17C4E",
    accentWarm: "#D4A574",
    border:     "#E8E4DF",
    borderBold: "#D0C8BE",
  },
  font: {
    serif: "'Georgia', 'Times New Roman', serif",
    sans:  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};
```

No user color customization. Palette is fixed to brand.

---

## Shared: Halftone Dot Generator

Both components use the same deterministic halftone algorithm. Extract this as a shared utility.

```ts
// utils/halftone.ts

interface Dot {
  x: number;
  y: number;
  r: number;
}

/**
 * Attempt a deterministic pseudo-random hash.
 * Uses sin-based hash — same inputs always produce same outputs. SSR-safe.
 */
function sinHash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

/**
 * Generate halftone dots with a vignette distribution.
 * Dots are larger at edges, smaller/sparser near center.
 *
 * @param width - pixel width of the container
 * @param height - pixel height of the container
 * @param cols - grid columns (controls density)
 * @param rows - grid rows (controls density)
 * @param centerX - normalized vignette center X (0–1), default 0.5
 * @param centerY - normalized vignette center Y (0–1), default 0.5
 * @param threshold - minimum hash value to render a dot (higher = fewer dots)
 */
export function generateHalftone(
  width: number,
  height: number,
  cols: number,
  rows: number,
  centerX = 0.5,
  centerY = 0.5,
  threshold = 0.4
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
      const dist = Math.sqrt((normX - centerX) ** 2 + (normY - centerY) ** 2);
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
```

**Performance:** The output is deterministic. Memoize with `useMemo` keyed on the inputs, or for the hero card (which always uses the same grid), extract as a module-level constant.

---

## Shared: Name-Based Hash Utilities

The thumbnail uses the place name to seed visual variation (tint, halftone center). Extract these:

```ts
// utils/nameHash.ts

/** Deterministic integer hash from a string */
export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Returns a float 0–1 derived from the string + optional salt */
export function hashFloat(s: string, salt: number = 0): number {
  const h = hashStr(s + String(salt));
  return (h % 10000) / 10000;
}
```

---

## Component 1: PlaceCoverCard (Hero)

**File:** `components/place/PlaceCoverCard.tsx`

### Props

```ts
interface PlaceCoverCardProps {
  name: string;          // places.name — always present
  neighborhood: string;  // places.neighborhood — from geocoded address
  city: string;          // guides.city — from parent guide
  country: string;       // guides.country — from parent guide
  position: number;      // places.sort_order — position in guide
}
```

### Dimensions

- Aspect ratio: 3:2, maintained via `aspect-ratio: 3/2`
- Width: fills parent container
- Reference dimensions for the spec below: 480×320
- Border radius: 3px
- Overflow: hidden
- Position: relative

### Visual Layers (back to front)

**Layer 1 — Background**
- `backgroundColor: #EDE7DE` (sunken)

**Layer 2 — Halftone SVG**
- Absolutely positioned, full bleed
- Grid: 48 columns × 32 rows (10px spacing at reference size)
- Center: (0.5, 0.5) — fixed for the hero card
- Threshold: 0.4
- Dot fill: `#2D2A26` (ink)
- SVG opacity: 0.05
- The SVG viewBox should match the reference size (480 320) so dots scale proportionally when the container resizes

**Layer 3 — Edge Vignette**
- `box-shadow: inset 0 0 70px rgba(45, 42, 38, 0.07)`

**Layer 4 — Outer Border**
- Absolutely positioned div, inset 14px from all edges
- `border: 1px solid #D0C8BE` (borderBold)

**Layer 5 — Inner Border**
- Absolutely positioned div, inset 18px from all edges
- `border: 0.5px solid #E8E4DF` (border)

**Layer 6 — Content**
- Absolutely positioned, full bleed, flex column, center/center
- Padding: 36px 56px

Content stack, top to bottom:

| Element | Font | Size | Spacing | Color | Margin |
|---------|------|------|---------|-------|--------|
| City · Country | Georgia, serif | 11px | 0.22em, uppercase | #9C8E7C | mb: 12px |
| Place Name | Georgia, serif | 38px | -0.01em | #2D2A26 | mb: 16px |
| Neighborhood | Georgia, serif | 11px | 0.22em, uppercase | #9C8E7C | mb: 16px |
| Diamond Divider | — | — | — | — | — |
| Position (N°) | System sans | 9px | 0.35em, uppercase | #9C8E7C @ 0.6 opacity | mt: 14px |

**City · Country format:** `"{city} · {country}"` — middle dot (·), not bullet (•)

**Place Name line-breaking:** If the name has 4+ words, insert a `<br />` after word 2. Otherwise, single line. Allow natural text wrapping for very long names rather than shrinking the font.

```tsx
const words = name.split(" ");
const nameDisplay = words.length > 3
  ? <>{words.slice(0, 2).join(" ")}<br />{words.slice(2).join(" ")}</>
  : name;
```

**Diamond Divider layout:** Horizontal flex, gap 8px:
- 28px wide × 0.5px tall rule, color `#D0C8BE`
- 4×4px square, rotated 45°, filled `#C17C4E` (accent), opacity 0.6
- 28px wide × 0.5px tall rule, color `#D0C8BE`

**Position format:** `"N° {position}"` — use the numero sign (N°), not "No."

### Accessibility

- Outer container: `role="img"` and `aria-label="{name}, {neighborhood}, {city}"`

---

## Component 2: PlaceCoverThumbnail (List)

**File:** `components/place/PlaceCoverThumbnail.tsx`

### Props

```ts
interface PlaceCoverThumbnailProps {
  name: string;          // places.name
  size?: number;         // pixel dimension, default 72. Component is always square.
}
```

Only the name is needed. The thumbnail is simpler and uses the name to seed its visual variation.

### Dimensions

- Square: `size × size` (default 72px)
- Border radius: 3px
- Overflow: hidden
- Position: relative
- `flex-shrink: 0` (so it doesn't collapse in flex layouts)

### Name-Seeded Variation

The place name deterministically controls:

1. **Background tint** — selected from a fixed set of 6 warm parchment tones:
   ```ts
   const tints = [
     "#EDE7DE", // base sunken
     "#EBE4D8", // slightly warmer
     "#E8E3DD", // cooler gray
     "#F0E8DC", // lighter warm
     "#E9E1D4", // deeper parchment
     "#ECE5DA", // mid neutral
   ];
   const tint = tints[hashStr(name) % tints.length];
   ```

2. **Halftone vignette center** — shifted off-center per place:
   ```ts
   const centerX = 0.3 + hashFloat(name, 1) * 0.4; // range 0.3–0.7
   const centerY = 0.3 + hashFloat(name, 2) * 0.4; // range 0.3–0.7
   ```

3. **Name truncation:**
   ```ts
   const displayName = name.length > 18 ? name.slice(0, 16) + "…" : name;
   ```

### Visual Layers (back to front)

**Layer 1 — Background**
- `backgroundColor:` the name-seeded tint (see above)

**Layer 2 — Halftone SVG**
- Grid: 12×12 (coarser than hero — fewer dots for small size)
- Center: name-seeded (centerX, centerY)
- Threshold: 0.45 (slightly sparser)
- Dot fill: `#2D2A26` (ink)
- Dot radius scaling: multiply by `(size / 12) / 10` to scale to the actual pixel size — i.e. `dotRadius * 0.8` at the default grid spacing
- SVG opacity: 0.05

**Layer 3 — Edge Vignette**
- `box-shadow: inset 0 0 20px rgba(45, 42, 38, 0.06)` (tighter than hero)

**Layer 4 — Single Border**
- Absolutely positioned, inset 4px from all edges
- `border: 0.75px solid #D0C8BE` (borderBold)
- Single border only (not double) — the inner border from the hero doesn't read at this size

**Layer 5 — Diamond Accent**
- Absolutely positioned at top: `size * 0.22`, horizontally centered
- 4×4px square, rotated 45°, filled `#C17C4E` (accent), opacity 0.5
- `transform: translate(-50%, -50%) rotate(45deg)`

**Layer 6 — Place Name**
- Anchored to the bottom third: `bottom: size * 0.18`
- Absolutely positioned, left: 0, right: 0
- Flex, justify-content: center
- Horizontal padding: 10px
- Font: Georgia (serif)
- Size: 8px if `size <= 56`, otherwise 9px
- Line-height: 1.25
- Letter-spacing: -0.01em
- Color: `#2D2A26` (ink)
- Text-align: center

### Accessibility

- Outer container: `role="img"` and `aria-label="{name}"`

---

## Integration Notes

### Where to render each

- **PlaceCoverCard**: Place detail hero, guide view expanded cards, any context where the photo slot is 3:2 and >200px wide
- **PlaceCoverThumbnail**: Place list rows, guide card grids, any context where the photo slot is square and <120px

### Conditional rendering pattern

```tsx
// In a place card component:
{place.photo_url ? (
  <img src={place.photo_url} alt={place.name} ... />
) : (
  <PlaceCoverCard
    name={place.name}
    neighborhood={place.neighborhood}
    city={guide.city}
    country={guide.country}
    position={place.sort_order}
  />
)}

// In a place list row:
{place.photo_url ? (
  <img src={place.photo_url} alt={place.name} ... />
) : (
  <PlaceCoverThumbnail name={place.name} size={72} />
)}
```

### File structure

```
components/place/
  PlaceCoverCard.tsx
  PlaceCoverThumbnail.tsx
utils/
  halftone.ts
  nameHash.ts
```

### Testing checklist

- [ ] Hero card renders correctly with all data fields populated
- [ ] Hero card line-breaks names with 4+ words after word 2
- [ ] Hero card handles very long place names (>40 chars) without overflow
- [ ] Thumbnail renders at 56, 64, 72, and 80px without visual artifacts
- [ ] Different place names produce visibly different thumbnail tints and halftone patterns
- [ ] Same place name always produces the same thumbnail (deterministic)
- [ ] No hydration mismatch warnings in dev console (SSR-safe)
- [ ] Both components render the halftone without visible flicker on mount
- [ ] aria-label is present and meaningful on both components
- [ ] Components render correctly when placed inside flex and grid parents
