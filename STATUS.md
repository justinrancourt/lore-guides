# Status

Current state of the Lore Guides codebase. Read this first when picking
the project back up — distinguishes shipped from stubbed at a glance so
you don't accidentally treat placeholder UI as production behavior.

## What's real

**Author experience** — fully wired against Supabase.
- Three-column shell on desktop (`AuthorShell`): 220px sidebar / center / 300px right panel.
- Mobile: bottom tab bar (Places / Guides / Shared) replaces the sidebar.
- All CRUD: create guide, add place (search + manual), edit place, reorder, photo upload (client-side resize, Supabase Storage, signed URLs), publish toggle, delete.
- Right panels are contextual: `AllPlacesPanel` on `/home`, `GuideDetailPanel` on `/guides/<slug>`, `PlaceDetailPanel` on `/places/<id>`.

**Recipient experience** — fully wired, public.
- `/g/[slug]` — split-panel landing on desktop (420px scrollable list + persistent map placeholder right), stacked on mobile. Map placeholder swaps to real Mapbox as a one-file change in `components/recipient/MapPanel.tsx`.
- `/g/[slug]/p/[id]` — place deep link, two-column on desktop with sticky map sidebar.
- Save Guide + Save Place both persist to `saved_guides` / `saved_places` and surface on the recipient's `/home/shared`.

**Auth** — magic link via Supabase. Proxy at root (`proxy.ts`, Next 16's renamed middleware) gates `(app)` routes. `currentProfile()` is `React.cache`'d so multi-component renders dedupe to one DB hit.

**Schema** — see `supabase/migrations/`. All tables from the PRD plus `saved_guides`. Two locked deviations from PRD:
- 4-type taxonomy (`Eat / Drink / See / Do`) instead of PRD's 9.
- No `day_trip` field.
- Best time has 4 values (no "Any time").

## What's stubbed

These render real UI but the underlying capability is deferred. Don't mistake them for finished features.

| Surface | Stub | Real version lives in |
|---|---|---|
| Map (every recipient route) | `MapPanel` renders parchment + arbitrary numbered pins | Phase 2 — Mapbox GL JS |
| Tour Guide Mode | `/g/[slug]/guide` is a "coming soon" page | V2 |
| Google Places search (add-place) | `lib/places-search.ts` returns hard-coded fixtures | Phase 2 — Google Places Autocomplete proxy |
| OG image | Plain meta tags only | Phase 3 — dynamic OG via Vercel OG |
| Google Maps import | No UI yet | Phase 4 |

## What's deferred (no code yet)

Per the original PRD plan; nothing started.
- Modal overlays for add/edit/create on desktop (currently full-page, works fine).
- Atomic place + guide_places insert. Today the action does two writes; if the second fails an orphan place is left behind. Needs a Postgres RPC.
- Email notifications.
- Staleness refresh Edge Function.
- Multi-photo crop UI.

## Conventions worth remembering

- **Sharp rectangles only.** Tailwind `borderRadius` defaults to `none`; the only valid radii are `sm: 2px`, `pill: 9999px`, `circle: 50%`. Anything else means a `rounded-md` slipped in — fix it.
- **Georgia serif everywhere.** `font-sans` is for map labels and tiny system labels only.
- **Color tokens only**, no raw hex in classNames. SVG `color`/`fill` props are an exception (no Tailwind there).
- **Server reads in `lib/db/`**, server actions in `lib/actions/`. Both server-only — never call from client components.
- **Three Supabase clients** (`lib/supabase/`): `browser`, `server`, plus the proxy uses its own inline `createServerClient` for cookie write-through. Don't cross-mix.
- **No FAB anywhere.** Quick-add lives behind inline "+ Add a place" CTAs that pop the capture sheet. The mockup's design language doesn't include a FAB.

## Suggested next work, roughly ordered

1. **Mapbox** — when the token lands, replace the body of `components/recipient/MapPanel.tsx`. Color palette already matches the spec (`map-bg`, `map-water`, `map-pin`).
2. **Real Google Places search** — proxy through a Next route handler; swap `lib/places-search.ts` body. Same export signature, no UI changes.
3. **Modal-ify add/edit/create on desktop** — Justin specifically said he hates modals when this came up earlier; revisit only if user feedback wants it.
4. **`saved_places` UX hooks** — show a "saved from X" badge on `MyPlacesCard` when a place came in via recipient save (the schema column `source_guide_id` already records this).
5. **OG image generation** — Vercel OG, dynamic per-guide. Falls under Phase 3 polish.

## Env vars

See `.env.local.example`. Production-relevant:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required.
- `NEXT_PUBLIC_SITE_URL` — set on Vercel so magic-link callbacks and copy-to-clipboard share links don't trust `x-forwarded-host` (which is spoofable on misconfigured deployments).
- `ALLOW_DEV_SEED` — dev-only. Surfaces a "Seed Valencia guide" button on `/home`. Don't set in prod.

## Dev quirks to know

- Pinned to port 3001 (`pnpm dev`) so the Supabase auth allow-list URL doesn't drift.
- Don't `rm -rf .next` while the dev server is running — corrupts Turbopack cache. Stop the server first.
- Don't `pkill -f "next dev"` — kills any sibling project's dev server too. Use `lsof -ti:3001 | xargs kill`.
