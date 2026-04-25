# Handoff: Lore Guides — Places-first redesign

## Overview

**Lore Guides** is a product for creating and sharing personal city guides with friends. This handoff covers a full redesign pass across every major flow, triggered by a design audit (28 findings) and a model shift from **guide-first** to **places-first**.

### The key conceptual change

- **Places are the atom.** A user can save a place without filing it anywhere — an "unfiled" place.
- **Guides are curated views over places**, not containers. A guide can be a City, Region, Trip, or Theme. One place can live in many guides, or none.
- **The default home tab is "My Places"**, not Guides. Users collect first, curate second. Guides live in a second tab.
- **Recipients (non-users) can save individual places**, not just whole guides. The product is about collecting, so every place surfaced publicly gets its own "Save place" affordance.

### Scope of this handoff

Every flow in the product is mocked:

- **Flow 0 · Places-first model** — new `My Places` shoebox, world map across all saved places, capture sheet, revised onboarding, new guide-creation flow with type-picker (City / Region / Trip / Theme)
- **Flow 1 · Onboarding** — 4 screens, invite-only positioning
- **Flow 2 · Home** — **deprecated** in favor of the places-first home in Flow 0 (kept for reference)
- **Flow 3 · Add a place** — search → annotate, dual taxonomy (Best time + Type)
- **Flow 4 · Start a new guide** — intro screen
- **Flow 5 · Import from Google Maps** — paste → review → annotate, one-by-one
- **Flow 6 · Guide artifact** — refreshed from the audit; author view (6 screens) + recipient view (4 screens for non-users on mobile web)
- **Flow 9 · Editing** — full edit + reorder

Also included: 3 "before vs after" comparison rows for the biggest Flow 6 deltas (cover behavior, drafts surface, taxonomy).

---

## About the Design Files

**The files in this bundle are design references created in HTML.** They are prototypes showing intended look and behavior — not production code to copy directly. The inline styles, Babel-in-browser setup, and `Object.assign(window, ...)` module wiring are artifacts of the design environment, not recommendations.

Your task is to **recreate these designs in the target codebase's existing environment** (React, SwiftUI, React Native, etc.), using its established patterns, component library, and styling approach. If no codebase exists yet, choose the most appropriate framework for a mobile-first product with shareable web views — React Native + a web marketing/recipient surface is a reasonable starting point.

---

## Fidelity

**High-fidelity.** All colors, typography, spacing, copy, and interaction intent are final-intent. Recreate pixel-perfectly, adapting only to match your codebase's component conventions. The design tokens section below is exhaustive.

---

## How to view the designs

Open `Lore Guides - All Flows.html` in a modern browser. The page is a Figma-style canvas — pan with click-drag, zoom with scroll. Sections are labeled top-to-bottom; every artboard has a label and a unique ID.

Relevant source files (JSX, browser-transpiled via Babel):
- `tokens.jsx` — all design tokens (colors, typography, spacing, etc.)
- `primitives.jsx` — shared primitives (`Phone`, `NavBar`, `Waymark`, `PlaceMap`, `PhotoBlock`, `FilterBar`, `DualFilterBar`, `TimeSensitiveFlag`, `DayTripPill`, etc.)
- `screens-places.jsx` — Flow 0 (places-first model) screens
- `screens-flows.jsx` — Flows 1, 2, 3, 4, 5, 9 screens
- `screens-author.jsx` — Flow 6 author view (6 screens)
- `screens-recipient.jsx` — Flow 6 recipient view (4 screens)
- `screens-compare.jsx` — before/after comparison strips
- `design-canvas.jsx` — canvas presentation chrome (not part of product)
- `tweaks-panel.jsx` — runtime tweak controls (not part of product)

---

## Design Tokens

All tokens are defined once in `tokens.jsx`. Implement these as your theme/palette.

### Color — foundation

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#1E1915` | Primary text, primary button backgrounds |
| `inkMuted` | `#4A4038` | Body copy, secondary emphasis |
| `faint` | `#8A7F75` | Tertiary text, meta, labels |
| `bg` | `#F5EFE6` | Page background (warm cream) |
| `bgDeep` | `#E8DFD1` | Secondary surface, sticky headers |
| `surface` | `#EDE5D7` | Card backgrounds, inputs |
| `border` | `#D8CDBA` | Hairline borders |
| `borderBold` | `#B8A992` | Emphasized borders, dividers |

### Color — accent & semantic

| Token | Hex | Usage |
|---|---|---|
| `accent` | `#B8663D` | Primary accent (terracotta/burnt sienna), links, active states, Waymark |
| `accentDeep` | `#8A4A2B` | Hover/pressed accent |
| `accentLight` | `#E8D4C4` | Accent tint backgrounds |
| `sage` | `#7A8B5E` | Unfiled-place pin color, nature tones |
| `sky` | `#4A6B8B` | Secondary color tones |
| `plum` | `#8B4E6B` | Secondary color tones |
| `bannerBg` | `#F2E6D3` | Drafts banner, unfiled-places banner bg |
| `bannerBorder` | `#D4BE9A` | Banner border |
| `bannerIcon` | `#A67A3E` | Banner icon tint |

### Color — map canvas

| Token | Hex | Usage |
|---|---|---|
| `mapBg` | `#EBE1CF` | Parchment map base |
| `mapWater` | `#C5D4D8` | Water bodies on map |
| `mapGreen` | `#B5C199` | Parks/green spaces on map |

### Typography

**Serif (primary):** `Georgia, "Times New Roman", serif` — used for 99% of type. The product has a literary voice; do not substitute a neo-grotesque.

**Sans (primary):** `"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif` — used only for map numeric labels, pin numbers, and system affordances. Do not use sans for body copy.

**Type scale (all sizes in px):**

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero / cover title | 44 | 400 | 1.05 | -0.015em |
| Screen title | 26 | 400 | 1.15 | -0.015em |
| Section title | 22–24 | 400 | 1.2 | -0.01em |
| Place name | 19 | 400 | 1.25 | -0.005em |
| Body | 14–16 | 400 | 1.65 | normal |
| Body italic (voice) | 14–15 | 400 italic | 1.55 | normal |
| Meta / neighborhood | 12–13 | 400 italic | 1.4 | normal |
| Eyebrow / label (uppercase) | 10–12 | 400 | 1.2 | 0.12em–0.22em |
| Button label (uppercase) | 12 | 400 | 1 | 0.14em |

Italics are used heavily — for neighborhoods, voice ("Why I love it"), sub-labels, and in-between states.

### Spacing

Base unit **4px**. Common steps: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32.

Screen padding: **20px horizontal** (mobile, 375–390pt viewport), **16px** for dense content like map view.

### Borders & shadows

- Hairline: `1px solid #D8CDBA`
- Bold: `1px solid #B8A992`
- **No rounded corners** on cards, banners, buttons, or inputs. Sharp rectangles throughout. This is core to the literary/print aesthetic — do not add `border-radius` to product surfaces.
- Pills (filter chips, DayTrip flag): `border-radius: 999px`
- Circular controls (capture FAB, pin backgrounds): `border-radius: 50%`
- Shadow (rare): `0 6px 18px rgba(30, 25, 20, 0.15)` for floating peek cards; `0 6px 18px rgba(0, 0, 0, 0.25)` for the FAB

### Brand element: The Waymark

A custom ornamental glyph used as the brand mark and as map pins. Rendered inline as SVG — see `Waymark` in `primitives.jsx`. Four-petal compass-rose-like shape. Always appears at 11–18px in product UI; up to 40px on hero moments. Color is always `C.accent` except when it's a map pin on an active place (then white on accent fill).

---

## The Dual-Facet Taxonomy

**Locked decision.** Every place is tagged with two orthogonal facets:

1. **Best time** (single value): `Morning` · `Afternoon` · `Evening` · `Night` · `Any time`
2. **Type** (single value): `Coffee` · `Food` · `Drinks` · `Market` · `Shop` · `Landmark` · `Park` · `Museum` · `Activity`

Both facets are filterable independently. In `FilterBar` you toggle one axis; in `DualFilterBar` (guide list + map views) you toggle both. The eyebrow line on a place row shows both: `Morning · Coffee`.

**Time-sensitive flag**: a separate orthogonal marker (clock glyph + warm ink) indicating "only open / only good at specific times, like Thursdays 5–7pm". Independent of Best time.

**Day Trip pill**: another orthogonal marker for places that require a dedicated day (a distant village, a hike). Rendered as a pill, not an eyebrow.

---

## Screens / Views

### Section 0 — Places-first model (the new foundation)

**Home · My Places (default tab)** — `Screen_Home_V2`
- Nav: Logo left, more-menu right
- Tab order: **My places** (active) · Guides · Shared
- Screen title: "Every place I've saved" + count + unfiled count as italic meta
- Prominent unfiled-places banner (warm banner bg, Waymark icon, count, italic sub, chevron right)
- Horizontal scroll of guide filter chips — first chip "All" (active, dark), then guide chips each with a color dot and name in uppercase eyebrow style, ending with "Unfiled"
- Vertical list of `MyPlacesCard` — each card: small color-tagged photo block, place name (serif 16), italic neighborhood + type meta, and small guide-chip(s) showing which guide(s) it belongs to
- Floating circular capture FAB (52px, ink bg, plus icon) at bottom-right — triggers capture sheet from anywhere in the app

**Home · Guides tab** — `Screen_Home_V2_GuidesTab`
- Same nav + tab strip (Guides active)
- Screen title: "Your guides" + meta "N guides · curated views over your places"
- Vertical list of `GuideRowCard` — small color swatch, guide name, italic meta ("scope · N places"), small uppercase type label right-aligned (City / Region / Trip / Theme)
- Dashed-border "Start a new guide" button at bottom

**My Places · all saved** — `Screen_MyPlaces_All`
- Deep-dive view. Same place-card list as Home, but with guide-filter strip more prominent and filters above
- Purpose: the "shoebox" — every place regardless of guide, filterable

**My Places · unfiled filter** — `Screen_MyPlaces_Unfiled`
- Filtered to only places with no guide
- Eyebrow: "Unfiled", title: "Places without a home", italic meta explaining the state
- Dashed "Build a guide from these" CTA below the list

**My Places · world map** — `Screen_MyPlaces_Map`
- View toggle at top: List / **Map** (active)
- Guide filter strip (same as Home)
- Parchment-toned world canvas (`WorldCanvas`) — abstract landmass shapes, grid lines, water. Not geographically accurate; ok as-is for design intent. Real implementation should use Mapbox with a custom parchment style.
- Pin overlay: `MapPinOne` for single places (guide color bg + white Waymark), `MapPinCluster` for zoom-clustered groups (warm bg + number)
- Bottom: legend / place count

**My Places · map · place peek** — `Screen_MyPlaces_Map_PlacePeek`
- Same map state with one pin active + floating peek card at bottom showing place detail

**Place · unfiled detail** — `Screen_MyPlaces_Detail`
- Hero color block (guide-less = neutral sage), place name, vibe quote
- Prompt banner: "This place doesn't belong to a guide yet" with "File it" CTA
- Note, address, neighborhood, type, time
- Bottom actions

**Capture · 5-second sheet** — `Screen_Capture_Sheet`
- Modal sheet over dimmed home
- "What did you find?" — search input for place
- "Your note" field (optional — can be filled later)
- Row at bottom: "Save to My Places" (default) | "File in guide →" (jumps to guide-picker)

**Capture · file in guide (picker)** — `Screen_Capture_GuidePicker`
- Same sheet, second step
- List of user's guides with checkbox; one pre-checked as "Suggested" based on heuristics (city match, theme match)

**New guide · pick shape** — `Screen_NewGuide_V2_TypePicker`
- Step 1 of guide creation
- Title: "What shape is it?"
- Four options as tappable cards: City · Region · Trip · Theme — each with a one-line description

**New guide · theme** — `Screen_NewGuide_V2_Theme`
- Step 2, theme-specific fields
- "A guide to" + title
- Scope (optional, placeholder: worldwide / regional / hyper-specific)
- "Why this guide" textarea — the curatorial mission statement

**Home · empty (first run)** — `Screen_Home_Empty`
- Same tab strip (My Places active)
- Illustration (compass), title "Nothing here yet — that's fine.", italic copy, primary "Save a place" + secondary "Start a guide", and an italic link "Or import from Google Maps"

**Onboarding 1.4′ · first place** — `Screen_OnbV2_FirstPlace`
- Alternative to 1.4 (first city) — prompts user to save their first place directly, embracing the places-first model

---

### Section 1 — Onboarding (`screens-flows.jsx`)

- **1.1 Welcome** — Waymark mark centered, "Lore Guides" wordmark, tagline in italic, primary "Get started" button, "Have an invite?" link
- **1.2 Invite-only** — Envelope illustration, copy explaining invite-only, text input for invite code, primary "Continue"
- **1.3 Your name** — Step 1/3, single-line name input
- **1.4 First city** — Step 3/3, map illustration, city picker — the last onboarding step before home

---

### Section 2 — Home (legacy, pre-places-first)

`Screen_Home` in `screens-flows.jsx` — **deprecated**. Tab order was updated to match the new model (My places · My guides · Shared with me) for consistency. The canonical home is Section 0's `Screen_Home_V2`. Do not implement the legacy version.

---

### Section 3 — Add a place

**3.1 Search** — search input with "What are you adding?" placeholder, live-suggestion list below (place name, address, small Waymark)

**3.2 Note + category** — chosen place name as title, italic address, fields:
- "Your note" textarea (renamed from "Why I love it" per audit)
- Best time row — inline chip row
- Type row — inline chip row
- Time-sensitive toggle + optional window ("Thu 5–7pm")
- Day trip toggle
- "Open in Maps" link

---

### Section 4 — Start a new guide (legacy intro)

**4.1 New guide intro** — kept for reference. Under places-first, users typically create guides from the type-picker (`Screen_NewGuide_V2_TypePicker`). This screen still applies for city-scoped guides as the "relationship + when + intro" capture.

---

### Section 5 — Import from Google Maps

**5.1 Paste** — step dots (Paste · Review · Annotate · Done), large textarea for pasted Maps URL or list, primary "Find places"

**5.2 Review** — list of found places with checkboxes (all pre-checked), place name + address, count at top

**5.3 Annotate** — one place at a time, "1 of N drafts" in nav, same fields as 3.2, "Save & next" primary action

---

### Section 6 — Guide artifact (the core flow — audit refresh)

**Author view (viewing your own guide):**

- **6.1 Cover** — full-bleed color block (user-picked guide color), city name serif 44, italic author byline, tap-to-reveal places below. Cover **collapses** on scroll (not sticky) — per audit finding.
- **6.2 List scrolled** — sticky mini-header with city name + count + filters, place rows with eyebrow (Time · Type), name, italic neighborhood, vibe quote, photos (if any)
- **6.3 Place detail** — tap-expanded place row with full body copy, photos, time-sensitive flag, type, map thumbnail, "Open in Maps" link
- **6.4 Map view** — filter bar, full-bleed parchment map fills to bottom of phone, Waymark pins with numbered badges, floating peek card at bottom for active place. **Map reaches the bottom of the phone frame.**
- **6.5 Drafts sheet open** — the drafts banner tapped reveals a modal bottom sheet listing all draft places (audit-recommended "modal sheet" pattern)
- **6.6 Filtered by Evening** — filter applied, other rows gone, italic "Showing Evening places" at bottom

**Recipient view (non-user on mobile web):**

- **6.R1 Cover** — same cover but with a top banner "Built by [author] · Get Lore Guides" (soft CTA)
- **6.R2 Place detail (recipient)** — place detail with **per-place "Save this place" CTA** (bookmark icon + label) — this is the collecting hook: a recipient can save individual places they like, encouraging them to sign up and build their own guide from the collection
- **6.R3 Save prompt** — tap "Save this place" → sheet asks them to create an account / accept the invite to collect
- **6.R4 End-of-guide footer** — after last place, a "Save whole guide" secondary CTA and "Build your own guide of [city]" with a few example guide shapes

---

### Section 9 — Editing

**9.1 Edit place · full** — same fields as add-place, in edit mode, with "Delete place" at bottom in muted warning tone

**9.2 Reorder places** — list of places with drag handles, italic "Drag to reorder. Grouped by time of day." — places grouped by Best Time with light section dividers

---

## Interactions & Behavior

### Navigation

- Primary tabs (Home): in-screen tab strip, underlined active tab, no bottom tab bar (product uses screen-level navigation to keep the literary aesthetic)
- Back: text "Back" with chevron left in serif at 13px
- Cancel (modals): "✕ Cancel" in faint color

### Cover collapse (6.1 → 6.2)

On scroll, the cover collapses from full-bleed hero into a slim sticky header with city name + count. Transition: scroll-linked (not time-linked). The audit recommended this over a sticky-cover pattern.

### Drafts banner → sheet (6.2 → 6.5)

Drafts count shows as a warm-banner row pinned under sticky header. Tap → slides up modal bottom sheet from bottom, dimmed overlay, `✕` to dismiss. Draft rows in sheet are tappable and route to annotate screen (flow 5.3 or 3.2 depending on origin).

### Map pin interactions (6.4)

- Tap pin → pin becomes "active" (accent-filled, with numbered badge below), peek card at bottom updates
- Tap peek card → expands to full Place Detail (6.3)
- Pinch-zoom and pan are Mapbox-default in production

### Capture FAB

Present on Home (both tabs) and My Places. Tap → Capture sheet (Flow 0). Persists across screens.

### Filter bars

`FilterBar` (single axis) — time OR type chips in a horizontal scroll row, active chip has ink bg + cream text, inactive has bordered transparent bg. Right-aligned "Map" toggle when applicable.

`DualFilterBar` (both axes) — two stacked single-axis rows with soft divider between. Used on guide list + map views where dual facet is exposed.

### Animation principles

- All transitions 200–260ms, ease-in-out
- Cover collapse is scroll-linked, not timed
- Sheet slides: 280ms, ease-out on open, ease-in on close
- No spring animations, no bounces — the product is quiet and considered

---

## State Management

### Per-place

```
Place {
  id: string
  name: string
  address: string
  neighborhood: string | null
  note: string              // renamed from "Why I love it"
  bestTime: "Morning" | "Afternoon" | "Evening" | "Night" | "AnyTime"
  type: "Coffee" | "Food" | "Drinks" | "Market" | "Shop" |
        "Landmark" | "Park" | "Museum" | "Activity"
  timeSensitive: string | null   // e.g. "Thu 5–7pm"
  dayTrip: boolean
  photos: string[]                // URLs
  coords: { lat, lng } | null
  guideIds: string[]              // can be empty → "unfiled"
  createdAt: timestamp
  createdBy: userId
}
```

### Per-guide

```
Guide {
  id: string
  title: string
  type: "city" | "region" | "trip" | "theme"
  scope: string | null            // e.g. "Valencia, Spain" or "Worldwide"
  color: hex                      // user-picked cover color
  intro: string                   // "Why this guide"
  authorId: userId
  createdAt: timestamp
  // Note: guide does NOT own places; places reference guides via guideIds.
  // This inversion enables one place to appear in many guides and no places
  // to be "orphaned" when a guide is deleted.
}
```

### Per-user

- `myPlaces: Place[]` — all places this user has saved
- `myGuides: Guide[]` — all guides this user has authored
- `savedPlaces: { placeId, originalGuideId, originalAuthorId }[]` — places saved from others' guides (the collecting hook)
- `sharedGuides: Guide[]` — guides shared with this user

### Draft state

Import flow (5.x) creates `draft` places — Place objects with `isDraft: true`. They appear in a drafts banner on the relevant guide until annotated. Drafts sheet surfaces all drafts across all of the user's guides + unfiled.

---

## Assets

All visuals in the design are hand-drawn inline SVG or canvas-rendered — no external images. For production:

- Place photos: user-uploaded, expected 4:3 or 1:1 aspect — implement a crop-on-upload flow
- Map: Mapbox with a custom style matching `mapBg / mapWater / mapGreen` tokens. The illustrative canvas in these mocks is a placeholder.
- Waymark: single SVG asset, embed inline (or as a React component). See `Waymark` in `primitives.jsx`.

---

## Files in this bundle

- `README.md` — this file
- `Lore Guides - All Flows.html` — entry point, open in browser
- `Lore Guides - Flow 6 Refreshed.html` — Flow 6-only view (earlier artifact, subset of All Flows)
- `tokens.jsx` — design tokens
- `primitives.jsx` — shared primitive components
- `screens-places.jsx` — Section 0 (places-first model) screens
- `screens-flows.jsx` — Sections 1–5, 9 screens
- `screens-author.jsx` — Section 6 author view
- `screens-recipient.jsx` — Section 6 recipient view
- `screens-compare.jsx` — before/after strips for audit findings
- `design-canvas.jsx`, `tweaks-panel.jsx`, `ios-frame.jsx` — presentation chrome only, not part of the product

---

## Open questions for product & engineering

1. **Social graph scope** — invite-only is established, but the recipient flow assumes public URLs. Clarify: are guides shared via public link, or only to invited accounts?
2. **Claim a place** — if User A saves a place created by User B, should it become User A's own place (with a reference back), or a read-only copy? The current design implies a referenced copy.
3. **Search infrastructure** — Add-place search (3.1) and capture sheet search assume a places API (Mapbox Places, Google Places, Foursquare). Pick one.
4. **Offline-first** — guide viewing (especially 6.x during travel) should work offline. Cache guide + place data aggressively on open.
5. **Import source format** — Flow 5 handles Google Maps list URLs. Other sources (Apple Maps, TripAdvisor, raw CSV) are not in scope for v1.
