# Lore Guides — Product Requirements Document

> **Purpose of this document:** This is the single source of truth for building Lore Guides. It consolidates decisions from the concept doc, open questions doc, and design handoff into a clear build spec. When in doubt, this document wins.

---

## What We're Building

A web application where people save places they love, organize them into guides, and share those guides with friends via link. The shared guide is the product's live demo — a recipient reads it, saves places from it, and (ideally) signs up to build their own.

The entire product — author and recipient — is a single Next.js web app.

---

## Technical Stack

```
┌─────────────────────────────┐
│   Next.js Web App           │
│   Author + Recipient        │
│   (Vercel hosting)          │
└─────────────┬───────────────┘
              │
     ┌────────▼────────┐
     │    Supabase      │
     │  Database        │
     │  Auth            │
     │  Storage         │
     │  Edge Functions  │
     └────────┬─────────┘
              │
    ┌─────────▼──────────┐
    │  Google Places API  │
    │  (search + details) │
    └────────────────────┘
    ┌─────────────────────┐
    │  Mapbox GL JS       │
    │  (map rendering)    │
    └─────────────────────┘
```

- **Next.js** (App Router) — all UI, SSR for public guides
- **Tailwind CSS** — styling, configured with the design token palette
- **Supabase** — Postgres database, auth (magic link email), file storage for photos, Edge Functions for background jobs
- **Google Places API** — autocomplete search when adding places, Place ID resolution for details
- **Mapbox GL JS** — map rendering with a custom parchment-toned style
- **Vercel** — hosting and deployment

---

## Auth & Accounts

- **Open signup.** No invite codes, no waitlist. Anyone can create an account.
- **Auth method:** Supabase Auth with email magic link (passwordless). No passwords.
- **Google Sign-In** as a secondary option (natural given Google Places integration).
- **Recipients do not need an account** to view a shared guide. The guide page is public and server-rendered.
- **Account is required to:** create guides, add places, save places from others' guides.

---

## Data Model

### The Core Relationship: Places ↔ Guides

**Places are the atom. Guides are curated views over them.**

A place exists independently. It can belong to zero guides (unfiled), one guide, or many guides. This is a many-to-many relationship managed by a join table. The design handoff's `GUIDE.places` array is mock data — do not implement places as an array column on guides.

**For MVP: one place can belong to multiple guides.** The concept doc says "cut for MVP — one guide per place." The design handoff's places-first model contradicts this (a place can live in many guides, or none). The places-first model is correct — the join table supports it cleanly, and the "Best bars I've ever been" theme guide from the mock data only works if places span guides.

### Schema

```sql
-- ─── Users ────────────────────────────────────────────────────────────────
create table profiles (
  id              uuid primary key references auth.users on delete cascade,
  email           text unique not null,
  display_name    text not null,
  avatar_url      text,
  home_city       text,
  created_at      timestamptz default now()
);

-- ─── Guides ───────────────────────────────────────────────────────────────
-- A guide can be a city, region, trip, or theme. The "type" field controls
-- which metadata is relevant and how the guide presents itself.
create table guides (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references profiles on delete cascade,
  title           text not null,          -- "Valencia", "Best bars I've ever been"
  type            text not null check (type in ('city', 'region', 'trip', 'theme')),
  scope           text,                   -- "Spain", "Worldwide", "Spring 2024"
  city            text,                   -- primary city (nullable for themes)
  country         text,                   -- (nullable for themes/regions)
  slug            text unique not null,   -- URL slug: "justin-valencia"
  intro           text,                   -- author's letter about this guide
  color           text default '#C17C4E', -- cover accent color (hex)
  year            text,                   -- "2019", "Ongoing"
  context         text,                   -- "Lived there", "Visited 3x"
  is_public       boolean default false,
  is_archived     boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── Places ───────────────────────────────────────────────────────────────
-- A place exists independently of any guide. It is owned by a user.
create table places (
  id              uuid primary key default gen_random_uuid(),
  created_by      uuid not null references profiles on delete cascade,
  google_place_id text,                   -- anchors to Google Places for freshness
  name            text not null,
  address         text,
  neighborhood    text,
  lat             double precision,
  lng             double precision,
  best_time       text check (best_time in ('Morning', 'Afternoon', 'Evening', 'Night', 'Any time')),
  type            text check (type in ('Coffee', 'Food', 'Drinks', 'Market', 'Shop', 'Landmark', 'Park', 'Museum', 'Activity')),
  note            text,                   -- author's personal note (the whole point)
  vibe            text,                   -- one-liner ("Golden hour breakfast")
  time_sensitive  text,                   -- e.g. "Best before 9am", "Opens at 7pm"
  day_trip        boolean default false,
  is_draft        boolean default false,  -- true = imported but not yet annotated
  last_verified   timestamptz,            -- last Google Places freshness check
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── Place Photos ─────────────────────────────────────────────────────────
-- Multiple photos per place, ordered. Stored in Supabase Storage.
create table place_photos (
  id              uuid primary key default gen_random_uuid(),
  place_id        uuid not null references places on delete cascade,
  storage_path    text not null,          -- path in Supabase Storage bucket
  caption         text,
  sort_order      integer default 0,
  created_at      timestamptz default now()
);

-- ─── Guide ↔ Place join table ─────────────────────────────────────────────
-- Many-to-many. A place can appear in multiple guides.
-- sort_order is per-guide (a place may be #3 in one guide and #7 in another).
create table guide_places (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid not null references guides on delete cascade,
  place_id        uuid not null references places on delete cascade,
  sort_order      integer default 0,
  created_at      timestamptz default now(),
  unique (guide_id, place_id)             -- no duplicates
);

-- ─── Saved places (recipient collecting) ──────────────────────────────────
-- When a recipient saves a place from someone else's guide.
-- This does NOT create a copy — it references the original place.
create table saved_places (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles on delete cascade,
  place_id        uuid not null references places on delete cascade,
  source_guide_id uuid references guides, -- which guide they found it in
  saved_at        timestamptz default now(),
  unique (user_id, place_id)
);

-- ─── Guide shares (tracking) ─────────────────────────────────────────────
create table guide_shares (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid not null references guides on delete cascade,
  shared_at       timestamptz default now()
);

-- ─── Sequences (V2 — schema now, UI later) ───────────────────────────────
create table sequences (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid not null references guides on delete cascade,
  name            text not null,
  created_at      timestamptz default now()
);

create table sequence_places (
  id              uuid primary key default gen_random_uuid(),
  sequence_id     uuid not null references sequences on delete cascade,
  place_id        uuid not null references places on delete cascade,
  sort_order      integer default 0,
  transition_note text                    -- "Walk 8 mins north to the next stop"
);
```

### Row-Level Security

- **Authors** can read/write their own profiles, guides, places, and guide_places.
- **Public guides** (`is_public = true`) are readable by anyone, including unauthenticated requests. All places linked to a public guide are also readable.
- **Private guides** are readable only by the author.
- **No user can write to another user's data.**
- **Saved places** are readable/writable only by the user who saved them.

### Storage

- **Bucket:** `place-photos` (public for public guides, private otherwise)
- **Path structure:** `{user_id}/{place_id}/{filename}.jpg`
- **Upload:** client-side upload via Supabase Storage JS client
- **Image processing:** resize to max 1200px wide on upload (Supabase Edge Function or client-side before upload)
- **CDN:** Supabase Storage serves via CDN automatically

---

## URL Structure

```
/                                   — marketing / landing (later)
/login                              — magic link login
/signup                             — account creation
/home                               — My Places (default tab)
/home/guides                        — Guides tab
/home/shared                        — Shared tab
/places/[id]                        — single place detail (author view)
/guides/new                         — create new guide flow
/guides/[slug]                      — author's guide view (editable)
/guides/[slug]/edit                 — guide settings (intro, cover, privacy)
/guides/[slug]/add                  — add a place to this guide
/guides/[slug]/import               — import from Google Maps
/g/[slug]                           — public recipient view (no auth required)
/g/[slug]/p/[placeId]               — public single place deep link
```

**Slug generation:** `{author_first_name}-{title_slugified}` — e.g., `justin-valencia`, `justin-best-bars-ive-ever-been`. Numeric suffix on collision.

---

## The Dual-Facet Taxonomy

Every place has two independent classification axes:

1. **Best time** (required, single value): `Morning` · `Afternoon` · `Evening` · `Night` · `Any time`
2. **Type** (required, single value): `Coffee` · `Food` · `Drinks` · `Market` · `Shop` · `Landmark` · `Park` · `Museum` · `Activity`

Both are filterable. The guide list view exposes both filter rows (`DualFilterBar` from the design handoff). Time is the primary axis (top row, underlined active tab style). Type is the secondary axis (pill chips below).

**Additional orthogonal markers (not part of the taxonomy):**
- **Time-sensitive flag** (`time_sensitive` field): freeform text like "Best before 9am", "Opens at 7pm", "Thu 5–7pm only". Displayed with a clock glyph in warm ink. Independent of best_time.
- **Day trip flag** (`day_trip` boolean): rendered as a bordered pill. A day trip place still has a best_time value.

---

## Design System Summary

The full design token spec is in the design handoff README. Key principles for implementation:

- **Typography:** Georgia serif for 99% of text. System sans only for map numeric labels and system affordances. The typeface IS the brand.
- **Color:** Warm earth palette. `#FAF8F5` background. `#C17C4E` accent (terracotta). Never pure black or white.
- **No border-radius** on cards, banners, buttons, inputs. Sharp rectangles. This is core to the literary/print aesthetic. Exceptions: pills (filter chips, day-trip flag) get `border-radius: 999px`. Circular elements (FAB, avatar) get `50%`.
- **Spacing:** 4px base unit. Screen padding: 20px horizontal.
- **Shadows:** rare. `0 6px 18px rgba(30,25,20,0.15)` for floating peek cards.
- **The Waymark:** custom SVG star/compass-rose glyph. Used as the brand mark and as map pins. See `Waymark` component in the design handoff's `primitives.jsx`.

---

## Screens & Flows

### Author Experience (authenticated)

**My Places** (`/home`) — the default landing page
- Tab strip: My Places (active) · Guides · Shared
- Title: "Every place I've saved" + total count + unfiled count
- Unfiled-places banner (warm banner with Waymark icon, count, chevron)
- Horizontal scroll of guide filter chips (All, then each guide by name, then "Unfiled")
- Vertical list of place cards — each shows: color photo thumbnail, name, italic neighborhood + type meta, small guide-chip(s)
- Map toggle in the filter strip (same pattern as guide view's `FilterBar`) — switches to world map with all pins, Mapbox parchment style, peek card on tap
- Floating capture FAB (52px circle, ink bg, plus icon) at bottom-right

**Guides** (`/home/guides`)
- Same tab strip (Guides active)
- Title: "Your guides" + meta count
- Vertical list of guide row cards — color swatch, name, italic scope + count, type label (City/Region/Trip/Theme)
- Dashed-border "Start a new guide" button at bottom

**Capture sheet**
- Triggered by FAB from anywhere
- Modal bottom sheet: "Capture a place" title, search input, optional note field
- "Save to My Places" (default, unfiled) or "File in guide →" (opens guide picker)

**New guide — type picker**
- "What shape is it?" — four tappable cards: City · Region · Trip · Theme
- Each with a one-line hint

**New guide — details**
- Title input, scope (optional), color picker, "Why this guide" textarea
- For city-type: city search, country auto-fill, year, context ("Lived there" etc.)

**Add a place**
- Google Places autocomplete search
- Selected: place name/address shown, then annotation fields:
  - "Your note" textarea (required for publishing — drafts can skip)
  - Best time chips (single select)
  - Type chips (single select)
  - Time-sensitive toggle + freeform text
  - Day trip toggle
  - Photo upload (multiple, ordered)

**Import from Google Maps**
- User pastes a Google Maps shared list URL (supports `maps.app.goo.gl` short links and full `google.com/maps` URLs)
- Server-side: a headless browser scraping service (Apify's Google Maps Shared List Scraper or similar) opens the URL, scrolls to load all places, and extracts place names, addresses, coordinates, and ratings
- Each extracted place is then matched against Google Places API to get a full Place ID, neighborhood, type, and hours
- Three-step UI flow: Paste link → Review found places (checkboxes, all pre-checked) → Annotate one-by-one
- Annotate uses same fields as Add a Place
- Skip is allowed — skipped places become drafts (`is_draft = true`)
- Only places with notes appear in the shared guide
- Error state: "We couldn't find any places in that link" with guidance on how to share a list (not a single pin)
- Technical note: the scraping approach is fragile — Google can change their DOM at any time. Build with a clean abstraction layer so the scraping service can be swapped without touching the UI. Include a fallback message if parsing fails: "Having trouble? Try sharing a different list, or add places one by one."

**Guide view (author, editable)**
- Cover: full-width color block, city name large serif, author byline, intro text
- Cover **collapses on scroll** into a slim sticky header with city + count + filter bar
- Dual filter bar (time primary + type secondary)
- Drafts banner below sticky header: "N places need your notes" → tapping opens a modal bottom sheet listing drafts
- Place rows: number, name, time · type eyebrow, italic neighborhood, vibe quote, photo (if any)
- Tap a place to expand inline: full note, photos, time-sensitive flag, day-trip pill, "Open in Maps" link
- Map toggle: filters + Mapbox map with Waymark pins, peek card at bottom for active pin
- Guide footer: Waymark + "Lore Guides" branding, faded

**Edit place**
- All fields from Add a Place, pre-filled
- Photo gallery (horizontal strip, add/remove/reorder)
- "Delete place" at bottom in muted warning tone

**Reorder places**
- Drag-handle list, grouped by best_time sections
- "Drag to reorder. Grouped by time of day."

### Recipient Experience (unauthenticated, public web)

**Guide landing page** (`/g/[slug]`)
- Server-rendered for SEO
- Minimal chrome: Lore Guides logo + Share button in top bar
- Cover with author byline
- "Save guide" + "Map" CTA buttons below cover
- Dual filter bar
- Place rows (same layout as author, but read-only)
- Tap place to expand: author's note, photos, "Open in Maps" / "Website" links
- Per-place bookmark/save button (prompts login if not authenticated)
- Sticky header on scroll (city + count + "N saved" indicator)

**Place detail** (`/g/[slug]/p/[placeId]`)
- Full place view: name, time · type, neighborhood, vibe quote, photo, author's note with avatar
- "Save this place" sticky CTA at bottom
- "Open in Maps" + "Website" action links

**Bottom-of-guide CTA**
- After the last place: "That's all [author]'s [city]."
- CTA card: Waymark, "Keep this guide", description, "Create account · save guide" primary button, "Sign in" secondary
- Below: "Or simply bookmark this page — it'll always be here."

**Conversion philosophy:** No hard gates. Ever. The recipient experience must be flawless because it IS the product demo. Soft nudge after engagement (saving a place, reaching the bottom), never a wall.

---

## Tour Guide Mode (V2)

Not in scope for initial build. The design exists (Flow 7 in earlier project files) but adds significant complexity (geolocation, real-time reordering, visited-state tracking). Build the artifact mode first, validate sharing, then layer tour guide mode on top.

When built, it will be a mode toggle on the recipient view — "I'm here" button that requests geolocation and switches to distance-sorted, time-aware presentation.

---

## What's Deferred

| Feature | When | Why |
|---|---|---|
| Tour guide mode | V2 | Geolocation + real-time reordering is complex; artifact mode validates the core loop |
| Sequences / itineraries | V2 | Schema is ready (see above), UI adds creation complexity |
| Instagram import | V2+ | No official API, engineering risk |
| Push notifications | V2 | Email notifications first |
| Staleness refresh | V2 | Edge Function that checks Google Places for closures; nice-to-have, not blocking |
| Example "Myspace Tom" guide | Post-launch | Requires editorial content creation |

---

## Development Phases

**Phase 1 — The Core Loop**
- Supabase: project setup, schema, auth (magic link + Google), RLS policies, storage bucket
- Next.js: project scaffold, Tailwind config with design tokens
- Author: signup/login, My Places + Guides tabs, create guide, add a place (with Google Places search), guide view (artifact mode, no map yet)
- Capture sheet (quick-add from anywhere via FAB)
- Edit place, reorder places
- Photo upload (multiple per place, Supabase Storage)
- My Places with filters and map toggle
- Recipient: public guide view at `/g/[slug]` (SSR, read-only, no save functionality yet)
- Seed: Valencia guide with all 7 places from mock data
- **Goal:** The full authoring loop works — add, edit, photograph, organize, share

**Phase 2 — Map & Drafts**
- Map view (Mapbox with custom parchment style, Waymark pins, peek card)
- Drafts system (banner + modal sheet)
- **Goal:** The guide feels complete — list and map, with a clean path for unfinished places

**Phase 3 — Recipient Polish & Conversion**
- Per-place save (bookmark) for recipients (requires account)
- "Save guide" flow (requires account)
- Bottom-of-guide conversion CTA
- Individual place deep link (`/g/[slug]/p/[id]`)
- OG image generation for link previews
- Share tracking (guide_shares table)
- **Goal:** The recipient-to-author flywheel is wired up

**Phase 4 — Growth & Polish**
- Import from Google Maps (paste → review → annotate via scraping service)
- Onboarding flow (welcome → name → first place or import)
- Empty states (empty guide, empty home, no results)
- Email notifications ("Sarah opened your Valencia")
- Public/private toggle with SEO for public guides
- Guide archiving
- Staleness refresh Edge Function
- **Goal:** Ready for real users beyond friends-and-family

---

## Open Questions (Remaining)

1. **Custom Mapbox style** — needs to be created in Mapbox Studio before the map view is buildable. Match: `#F0EAE0` background, `#D9E8EC` water, `#D8E8CC` green, muted roads, no default labels except neighborhoods.

2. **OG image generation** — for link previews when guides are shared. Options: Vercel OG (easy, dynamic), or a static fallback. Decide during Phase 3.

3. **Google Maps import scraping service** — the import flow uses a headless browser service (Apify or similar) to extract places from shared list URLs. This is a third-party dependency that could break if Google changes their DOM. Evaluate Apify's Google Maps Shared List Scraper API, or build a self-hosted Playwright scraper as a Supabase Edge Function or standalone microservice. Budget ~$0.01–0.05 per import run via Apify.

4. **Photo handling on web** — file input with client-side resize (canvas API) before uploading to Supabase Storage. Max 1200px wide, JPEG compression. No crop UI for MVP — just resize and upload.

---

## Design Reference Files

The design handoff bundle contains screen-level mockups as interactive HTML/JSX prototypes. These are **design references, not production code.** Recreate the designs using Next.js + Tailwind, matching pixel-level fidelity on typography, color, spacing, and component patterns.

Key files:
- `tokens.jsx` — all design tokens (colors, typography, icon paths, mock data)
- `primitives.jsx` — shared component patterns (Phone frame is presentation chrome — skip it; NavBar, Cover, FilterBar, DualFilterBar, PlaceMap, PhotoBlock, etc. are product components — implement them)
- `screens-places.jsx` — Flow 0 (places-first home, capture, My Places)
- `screens-flows.jsx` — Flows 1–5, 9 (onboarding, add place, import, editing)
- `screens-author.jsx` — Flow 6 author view (6 screens)
- `screens-recipient.jsx` — Flow 6 recipient view (4 screens)
- `README.md` — design handoff with full token tables and screen descriptions

Files to **skip** (presentation chrome only): `design-canvas.jsx`, `tweaks-panel.jsx`, `ios-frame.jsx`, `screens-compare.jsx`.
