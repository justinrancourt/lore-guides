# PlaceCoverCard — Implementation Spec

> Placeholder cover image for place cards when no photo is present.  
> Direction: **Postcard × Lithograph** — double inset border, halftone dot vignette, centered editorial typography.

---

## When It Renders

This component renders **only when `photo_url` is null/empty** on a place. It replaces the photo slot in the place card with a generated cover using the place's own data. No user color customization — the palette is fixed to the brand system.

---

## Data Inputs

All fields come from the `places` table + parent `guides` table.

| Prop | Source | Type | Required | Example |
|------|--------|------|----------|---------|
| `name` | `places.name` | string | yes | `"Bodega Casa Montaña"` |
| `neighborhood` | `places.neighborhood` | string | yes | `"El Cabanyal"` |
| `city` | `guides.city` | string | yes | `"Valencia"` |
| `country` | `guides.country` | string | yes | `"Spain"` |
| `position` | `places.sort_order` | number | yes | `12` |

**Not used:** `vibe`, `note`, `category`, `time_sensitive`, `google_place_id`. Keep the cover simple — these fields serve other UI surfaces.

---

## Dimensions & Container

- **Aspect ratio:** 3:2 (matches photo slot)
- **Reference size:** 480 × 320 — component should be width-responsive, maintaining aspect ratio via `aspect-ratio: 3/2` or a padding-bottom trick
- **Border radius:** 3px (matches card system)
- **Overflow:** hidden
- **Position:** relative (child layers are absolute)

---

## Visual Layers (back to front)

### 1. Background
- Solid fill: `sunken` / `#EDE7DE`

### 2. Halftone Dot Texture
- SVG overlay, absolutely positioned, full bleed
- **Opacity:** 0.05
- **Dot generation algorithm:**
  ```
  For a 48×32 grid (10px spacing):
    hash = sin(x * 127.1 + y * 311.7) * 43758.5453
    r = fract(hash)
    if r > 0.4:
      cx_norm = x / 48, cy_norm = y / 32
      dist = sqrt((cx_norm - 0.5)² + (cy_norm - 0.5)²)
      dotRadius = r * 1.6 * (0.2 + dist * 1.1)
      → render circle at (x*10+5, y*10+5) with radius dotRadius
  ```
- Dots filled with `ink` / `#2D2A26`
- This creates a vignette effect — dots are larger at edges, smaller/sparser at center
- **Performance note:** Generate dots once, not on every render. This is deterministic — same output every time, so can be memoized or even baked into a static SVG string.

### 3. Edge Vignette
- `box-shadow: inset 0 0 70px rgba(45, 42, 38, 0.07)`

### 4. Outer Border
- Absolutely positioned, inset 14px from all edges
- `border: 1px solid` `borderBold` / `#D0C8BE`

### 5. Inner Border
- Absolutely positioned, inset 18px from all edges
- `border: 0.5px solid` `border` / `#E8E4DF`

### 6. Content (centered flex column)

Padding: `36px 56px`. Flex column, `justify-content: center`, `align-items: center`.

**6a. City · Country** (top label)
- Font: Georgia (serif), 11px
- Letter-spacing: 0.22em
- Text-transform: uppercase
- Color: `inkFaint` / `#9C8E7C`
- Margin-bottom: 12px
- Format: `"{city} · {country}"` — use a middle dot (`·`), not a bullet

**6b. Place Name** (hero)
- Font: Georgia (serif), 38px
- Line-height: 1.08
- Letter-spacing: -0.01em
- Color: `ink` / `#2D2A26`
- Text-align: center
- Margin-bottom: 16px
- **Line-breaking rule:** If name has 4+ words, break after word 2. This keeps the visual weight balanced. For 3 or fewer words, single line.
  ```
  words = name.split(" ")
  if words.length > 3:
    line1 = words[0..1].join(" ")
    line2 = words[2..].join(" ")
  else:
    single line
  ```
- **Long name handling:** If the name exceeds the container at 38px, allow the text to wrap naturally rather than shrinking the font. The double border provides a natural visual boundary.

**6c. Neighborhood** (sub-label)
- Font: Georgia (serif), 11px
- Letter-spacing: 0.22em
- Text-transform: uppercase
- Color: `inkFaint` / `#9C8E7C`
- Margin-bottom: 16px

**6d. Diamond Divider**
- Horizontal layout: `[28px rule] [4px diamond] [28px rule]`
- Rules: 0.5px height, `borderBold` / `#D0C8BE`
- Diamond: 4×4px square rotated 45°, filled `accent` / `#C17C4E`, opacity 0.6
- Gap between elements: 8px

**6e. Position Number** (bottom)
- Font: system sans-serif, 9px
- Letter-spacing: 0.35em
- Text-transform: uppercase
- Color: `inkFaint` / `#9C8E7C`, opacity 0.6
- Margin-top: 14px
- Format: `"N° {position}"` — use the actual numero sign (N°), not "No."

---

## Color Reference (all from brand tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `sunken` | `#EDE7DE` | Background fill |
| `ink` | `#2D2A26` | Place name, halftone dots |
| `inkFaint` | `#9C8E7C` | City/country, neighborhood, position |
| `accent` | `#C17C4E` | Diamond in divider |
| `border` | `#E8E4DF` | Inner border |
| `borderBold` | `#D0C8BE` | Outer border, divider rules |

---

## Typography Reference

| Element | Family | Size | Weight | Style | Spacing |
|---------|--------|------|--------|-------|---------|
| City · Country | Georgia, serif | 11px | normal | normal | 0.22em, uppercase |
| Place name | Georgia, serif | 38px | normal | normal | -0.01em |
| Neighborhood | Georgia, serif | 11px | normal | normal | 0.22em, uppercase |
| Position (N°) | System sans | 9px | normal | normal | 0.35em, uppercase |

---

## Component Interface (React/Next.js)

```tsx
interface PlaceCoverCardProps {
  name: string;
  neighborhood: string;
  city: string;
  country: string;
  position: number;
}

// Usage
<PlaceCoverCard
  name="Bodega Casa Montaña"
  neighborhood="El Cabanyal"
  city="Valencia"
  country="Spain"
  position={12}
/>
```

---

## Implementation Notes

- **SSR-safe:** The halftone generation is deterministic (no `Math.random()`), so it produces identical output server- and client-side. No hydration mismatch risk.
- **Memoization:** Halftone dots are the same every render. Compute once and cache. A `useMemo` with empty deps, or extract to a constant outside the component entirely.
- **Accessibility:** Add `role="img"` and `aria-label="{name}, {neighborhood}, {city}"` to the outer container so screen readers announce it meaningfully.
- **Responsive:** The component should fill its parent's width and maintain 3:2 via `aspect-ratio`. All internal sizing is relative to the reference 480×320 — if you need pixel-perfect scaling, use a viewBox-based SVG approach for the entire card instead of DOM elements.
- **No user theming:** Colors are hardcoded to brand tokens. No props for color customization.

---

## File Location

Suggest: `components/place/PlaceCoverCard.tsx`

Depends on: brand token constants (wherever those live in the codebase — likely a `tokens.ts` or `theme.ts` file).
