# Lore Guides — Responsive Layout Implementation

## Context

Lore Guides is a travel guide app. The **recipient experience** (someone receiving a shared guide link) is a **Next.js web app** using Tailwind CSS and Mapbox GL JS. It needs to be fully responsive. The existing mockups were mobile-only — this spec adds desktop and tablet behavior.

The app uses a warm, editorial design language: Georgia serif, earth-tone palette, no pure black/white. Think printed field guide, not tech product.

## Routes

```
/g/[slug]           → Guide view (recipient landing, artifact mode)
/g/[slug]/guide     → Tour guide mode (location-aware, walking around)
/g/[slug]/p/[id]    → Individual place deep link
```

---

## Breakpoints

Use Tailwind's default breakpoints:

| Breakpoint | Width      | Behavior |
|-----------|-----------|----------|
| **Mobile** (default) | < 640px | Single column. Map stacked above place list. Map height: 200px. |
| **sm/md** (Tablet) | 640–1024px | Single column, content centered at max-width 720px. Map taller (280px). 2-column card grid in artifact view. |
| **lg+** (Desktop) | > 1024px | **Split panel layout**: fixed-width list panel on left + persistent sticky map on right. |

---

## Layout Patterns by Route

### `/g/[slug]` — Recipient Landing Page (the most important page)

This is the front door. Someone clicks a shared link and lands here.

**Mobile (<640px):**
- Map stacked at top, full-width, 200px tall
- Author intro / guide header below map (centered text)
- Category filter tabs (horizontal scroll)
- Place list below: single column, each place is a row with number + category + name + neighborhood
- Places expand on tap to show photo, note, vibe, and action buttons
- "I'm here" button in nav bar (top right, accent-colored)

**Desktop (≥1024px):**
- **Split panel layout** — this is the key architectural decision
- **Left panel**: fixed width 420px (min 380, max 480), scrollable, contains:
  - Guide header (author, city, intro text)
  - Category filter tabs
  - Place list (same as mobile but in the left column)
  - Expanded place details inline
- **Right panel**: `flex: 1`, contains:
  - Persistent Mapbox map that fills the remaining viewport
  - Map pins for all places, numbered
  - Active pin highlights when a place is selected/expanded in the list
  - Tooltip on active pin showing place name + neighborhood
- Left panel has `border-right: 1px solid` separator
- Both panels are `height: calc(100vh - nav height)`
- Left panel scrolls independently; map stays fixed

**Tablet (640–1024px):**
- Same as mobile (stacked) but with wider content area (max-width 720px, centered)
- Map can be taller (280px)

### `/g/[slug]/p/[id]` — Place Detail / Deep Link

**Mobile:**
- Stacked: photo → category/name/neighborhood → note → vibe → action buttons → map at bottom

**Desktop (≥1024px):**
- Two-column layout, max-width 960px centered
- **Left column** (flex: 1, max-width 520px): place content — category, name, neighborhood, photo, note, vibe, action buttons
- **Right column** (320px, flex-shrink: 0): sticky sidebar with:
  - Mini Mapbox map (240px tall, rounded corners)
  - "3 of 7 in [Author]'s [City]" context
  - "Also in this guide" — 3 other place links
  - "View all N places →" link back to guide

### `/g/[slug]/guide` — Tour Guide Mode

- **Always full-screen map** regardless of breakpoint. This is inherently mobile-optimized (user is walking around).
- Bottom drawer pattern (drag-up sheet) stays consistent across breakpoints.
- On desktop the drawer can be wider but still anchored to bottom.
- Don't build a split-panel for this — full-screen map is correct.

---

## Nav Bar

Consistent across all breakpoints and routes:

- **Left**: Lore Guides logo (star icon + "Lore Guides" wordmark, Georgia serif)
- **Right**: "I'm here" button (accent background, white text, uppercase, includes map pin icon)
- **Desktop addition**: Between logo and button, show subtle guide metadata inline: "7 places · 2019" in italic muted text
- Same height and bottom border at all sizes
- `position: sticky; top: 0;` always
- Background: `#FAF8F5` (canvas color)
- Border bottom: `1px solid #E8E4DF`
- No hamburger menu at any breakpoint — nav is simple enough to always show inline

---

## Design Tokens (Tailwind Config)

```js
// tailwind.config.js extend
colors: {
  canvas: '#FAF8F5',
  surface: '#F2EDE6',
  sunken: '#EDE7DE',
  ink: '#2D2A26',
  'ink-muted': '#4A4540',
  'ink-faint': '#9C8E7C',
  accent: '#C17C4E',
  'accent-warm': '#D4A574',
  'accent-deep': '#9B5E38',
  sage: '#7A8B5E',
  'sage-muted': '#A8B890',
  border: '#E8E4DF',
  'border-soft': '#F0EBE4',
  'border-bold': '#D0C8BE',
},
fontFamily: {
  serif: ['Georgia', 'Times New Roman', 'serif'],
  sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
},
```

---

## Design Constants

| Property | Value |
|----------|-------|
| List panel width (desktop) | 420px (min 380, max 480) |
| Content max-width (artifact/centered views) | 720px |
| Reading line-length (notes, intro text) | 520px max |
| Card grid gap | 20px |
| Desktop nav padding | 14px 32px |
| Mobile nav padding | 16px 20px |
| Map min-height (mobile, stacked) | 200px |
| Map min-height (desktop, inline) | 280px |
| Map height (desktop, persistent split) | 100% of panel (viewport minus nav) |
| Place card photo height (card grid) | 100px |
| Place detail photo height (desktop) | 200px |

---

## Typography Scale

All in Georgia serif unless noted:

| Role | Size | Weight | Style |
|------|------|--------|-------|
| City name (h1) | 28px mobile, 32px desktop | 400 | normal |
| Place name (h3) | 16px | 400 | normal |
| Author intro | 14-16px | 400 | italic |
| Place note | 14-16px | 400 | normal, line-height 1.85 |
| Category label | 11px | 400 | uppercase, letter-spacing 0.08em, accent color |
| Metadata | 11-12px | 400 | italic, ink-faint color |
| Section labels | 9px (sans-serif) | 600 | uppercase, letter-spacing 0.12em |
| Button text | 11px | 400 | uppercase, letter-spacing 0.06-0.08em |

---

## Map Styling

- Use Mapbox GL JS with a custom style that matches the palette
- Map background: `#F0EAE0` (warm parchment)
- Water: `#D9E8EC` (muted blue)
- Road grid: `#D8D0C4` at 0.5px, subtle
- Pins: `#8C7B6B` default, `#C17C4E` (accent) for active/selected
- Active pin gets white border and subtle box-shadow
- Numbered pins (1, 2, 3...) matching the place list order
- Pin tooltip on hover/active: white card with place name + neighborhood, subtle shadow, small caret pointing down

---

## Place Photos

- Photos render with `object-fit: cover` and a subtle warm color wash overlay
- Overlay uses the place's `photoColor` value with `mix-blend-mode: multiply` at low opacity
- Plus a gentle radial vignette: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)`
- `border-radius: 2px`
- This treatment ties varied photography back to the guide's warm palette

---

## Things to Avoid

1. **Don't hide the map on desktop** — in the split layout, the map is always visible. That's the whole point.
2. **Don't let text go full-width** — reading content (notes, intros) stays ≤520px line-length even on wide screens.
3. **No hamburger menu** — nav is simple enough to show inline at all sizes.
4. **No sticky footer or bottom CTA on desktop** — "I'm here" lives in the nav bar.
5. **No more than 2-column card grid** — cards get too narrow and notes become unreadable at 3+.
6. **Don't put the map below the fold on mobile** — it should be the first visual element after the header.
7. **No generic UI framework styling** — this is editorial and warm, not Material/Bootstrap.
8. **Don't use Inter, Roboto, or system sans as the primary font** — Georgia serif is the brand.

---

## Implementation Priority

1. **Recipient landing page** (`/g/[slug]`) with the desktop split-panel layout — this is the highest traffic page
2. **Place detail** (`/g/[slug]/p/[id]`) with the two-column desktop layout
3. **Tour guide mode** (`/g/[slug]/guide`) — already mobile-first, just make sure it doesn't break on desktop
4. **OG meta tags and server-side rendering** for link previews

---

## Reference Files

The interactive mockups for these screens are in the project as JSX files:
- `lore-sharing-flow.jsx` — Flow 8, includes the mobile recipient landing (screen 8.3)
- `lore-flow6-guide-artifact.jsx` — Flow 6, the guide artifact view
- `lore-flow7-tour-guide.jsx` — Flow 7, tour guide mode
- `lore-responsive-guide.jsx` — Desktop layout mockups and this spec in visual form
- `lore-style-guide-v2.jsx` — Full design system reference
