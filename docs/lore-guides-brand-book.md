# Lore Guides — Brand Book

The definitive reference for the Lore Guides visual identity, design system, and implementation standards. This document is the single source of truth — use it in Claude Code, hand it to a contractor, or reference it when making any design decision.

---

## 1. Brand Essence

**What Lore Guides is:** A personal places layer that lets people save the spots they love and turn that into a guided experience for a friend.

**What it feels like:** A well-traveled person's field guide. Warm, editorial, unhurried — closer to a printed Wildsam guide than a tech product. The author's voice is always the loudest thing in the room. The technology is invisible.

**The one principle:** "A place without your note is just a pin." The note is the product. Everything else is delivery.

**Tagline:** *Your places, your words.*

---

## 2. The Waymark — Logo Mark

The logo mark is called "The Waymark" — two overlapping diamonds forming a four-pointed compass star with a center dot. It is always rendered from code (SVG on web, SwiftUI Shape on iOS), never as a raster image.

### 2.1 Construction

The mark is built inside a square canvas of size `s`, where `c = s / 2` (center point):

```
Vertical diamond:   M(c, c - s×0.44)  L(c + s×0.08, c)  L(c, c + s×0.44)  L(c - s×0.08, c)  Z
Horizontal diamond: M(c - s×0.44, c)  L(c, c - s×0.08)  L(c + s×0.44, c)  L(c, c + s×0.08)  Z
Center dot:         circle at (c, c), radius = strokeWidth × 0.7, opacity 0.65
```

Both diamonds use `stroke-linejoin: round` and `fill: none`. The proportions are fixed: outer extent = 44% of canvas, waist = 8% of canvas.

### 2.2 Wordmark

The wordmark reads **Lore Guides** (two words, title case). Set in Georgia serif, `letter-spacing: 0.1em`, `font-weight: 400`. In compact contexts, "Lore" alone is acceptable. Never use a custom font file — Georgia is the brand typeface.

### 2.3 Lockup Sizes

| Context              | Mark size | Stroke width | Wordmark | Notes                              |
|----------------------|-----------|-------------|----------|------------------------------------|
| Splash screen        | 56px      | 1.6px       | 22px     | Centered, tagline below in italic  |
| Nav bar              | 13px      | 1.0px       | 13px     | Inline, mark + wordmark            |
| Tab bar icon         | 24px      | 1.3px       | —        | Mark only                          |
| Favicon / app icon   | 32px      | 2.0px       | —        | Mark only                          |
| Loading state        | 40px      | 1.8px       | —        | Mark only, Breathe animation       |
| Web og:image         | 80px      | 1.8px       | 28px     | Centered on canvas background      |

### 2.4 Color Variants

The mark works on three backgrounds:

- **On canvas (#FAF8F5):** stroke = ink (#2D2A26) — the default
- **On ink (#2D2A26):** stroke = canvas (#FAF8F5) — dark variant
- **On accent (#C17C4E):** stroke = onAccent (#FFFFFF) — accent variant

Never place the mark on busy backgrounds or photographs.

### 2.5 Clear Space

Minimum clear space around the mark = 50% of the mark's canvas size on all sides. The wordmark, when paired, sits directly below with 18px gap at splash size (scale proportionally).

---

## 3. Waymark Animation Treatments

Four named animations. Use the right one for the moment. All are CSS-only on web, translatable to SwiftUI `withAnimation` / Core Animation on iOS.

### 3.1 Draw In (Splash)

For app launch / first open. The mark draws itself onto the page. Plays once.

- Vertical diamond draws on via stroke-dashoffset (0–60% of 1.8s)
- Horizontal diamond follows with 20% delay (20–70%)
- Center dot scales in from 0 with overshoot at 55–85%
- Wordmark fades up from 6px below (45–70%)
- Tagline fades up from 4px below (60–85%)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Total duration: 1.8–2.2s

### 3.2 Compass Settle (First Launch Alternative)

Both diamonds start rotated in opposite directions (V: +25°, H: −30°) and settle into alignment like compass needles finding north. More dramatic than Draw In — use for onboarding or a special first-launch moment. Plays once.

- Damped oscillation: overshoot → undershoot → settle (4 keyframe passes)
- Center dot scales in after diamonds settle (55–85%)
- Easing: `cubic-bezier(0.2, 0, 0.3, 1)`
- Total duration: 2.0s

### 3.3 Breathe (Loading / Waiting)

Both diamonds pulse together with a gentle phase offset — the mark inhales as one shape. For any waiting state. Loops infinitely.

- Scale range: 1.0 → 1.07 → 1.0
- Horizontal diamond delays 0.35s behind vertical (phase offset, not opposing)
- Center dot scales 1.0 → 1.15 → 1.0 with 0.15s delay
- Easing: `cubic-bezier(0.45, 0, 0.55, 1)` (sine approximation)
- Period: 3.0s per cycle

### 3.4 Tap Response (Interaction)

Quick squeeze-and-bounce on tap. For nav icon or interactive moments. Plays on user action, never blocks interaction.

- Whole mark: scale(1) → scale(0.85) + rotate(−8°) → scale(1.08) + rotate(+2°) → scale(1)
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring)
- Duration: 0.4s
- Never loops

### 3.5 Static

Nav bar, guide headers, web recipient view, any ambient context. No animation. The mark is just there.

---

## 4. Color System

A warm, earth-toned palette drawn from aged paper, terracotta, and coastal sage. Never pure black (#000) or pure white (#FFF).

### 4.1 Core Palette

```
BACKGROUNDS
canvas       #FAF8F5     Page background — the default surface
surface      #F2EDE6     Cards, elevated surfaces, modals
sunken       #EDE7DE     Inset areas, input backgrounds

TEXT
ink          #2D2A26     Primary text — never pure black
inkMuted     #4A4540     Secondary text, body in some contexts
inkFaint     #9C8E7C     Tertiary text, timestamps, metadata, placeholders

ACCENT
accent       #C17C4E     Primary accent — terracotta
accentWarm   #D4A574     Lighter variant — hover states, secondary emphasis
accentDeep   #9B5E38     Darker variant — pressed states, emphasis

SECONDARY ACCENT
sage         #7A8B5E     Open status, nature, positive
sageMuted    #A8B890     Lighter sage
sageLight    #D8E8CC     Sage background tint

BORDERS
border       #E8E4DF     Default border
borderSoft   #F0EBE4     Subtle dividers
borderBold   #D0C8BE     Emphasized borders, focus rings

STATUS
open         #7A8B5E     Currently open (same as sage)
closed       #B08968     Closed now / limited hours
permanent    #9B5E38     Permanently closed (same as accentDeep)

UTILITY
onAccent     #FFFFFF     Text on accent backgrounds
```

### 4.2 Map Palette

Custom Mapbox style (web) and MapKit style (iOS) designed to feel like the same map.

```
mapBg        #F0EAE0     Map tile background — parchment
mapWater     #D9E8EC     Water features
mapGreen     #D8E8CC     Parks and green space
mapPin       #8C7B6B     Default pin color
mapPinAct    #C17C4E     Active/selected pin (matches accent)
```

No default Mapbox/MapKit chrome. Suppress default labels except neighborhood names.

### 4.3 Rules

- Never introduce a color outside this system without extending the token set
- Background is always `canvas`, never white
- Text on accent backgrounds always uses `onAccent`
- Status colors are semantic — don't repurpose sage for non-status uses (sage as accent on nature-related content is fine)
- Dark mode is not in scope for MVP. When it comes, map the tokens — don't create a parallel set.

---

## 5. Typography

Georgia is the brand. The typeface does the heavy lifting that illustration and color can't. Every size and weight is named by role, not by number.

### 5.1 Font Stacks

```
Serif (brand):  'Georgia', 'Times New Roman', serif
Sans (system):  -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

**Serif** is used for everything — headings, body copy, notes, card titles, navigation labels, the wordmark. It's the default.

**Sans** is used only for UI chrome: timestamps, filter pill labels, metadata badges, micro-labels, uppercase section markers. If you're writing it in sans, it should be small, uppercase, and functional.

### 5.2 Type Scale

| Role           | Family | Size  | Weight | Style  | Tracking     | Line height | Color     |
|----------------|--------|-------|--------|--------|-------------|-------------|-----------|
| Hero           | Serif  | 52px  | 400    | Normal | -0.02em     | 1.1         | ink       |
| Page title     | Serif  | 22px  | 400    | Normal | —           | 1.2         | ink       |
| Section title  | Serif  | 17px  | 400    | Normal | —           | 1.3         | ink       |
| Card title     | Serif  | 15px  | 400    | Normal | —           | 1.3         | ink       |
| Body           | Serif  | 14–15px | 400  | Normal | —           | 1.6–1.7     | inkMuted  |
| Note (author)  | Serif  | 14–15px | 400  | Normal | —           | 1.85        | inkMuted  |
| Caption        | Serif  | 12px  | 400    | Italic | —           | 1.5         | inkFaint  |
| Subtitle       | Serif  | 14–17px | 400  | Italic | —           | 1.6         | inkFaint  |
| Micro label    | Sans   | 10–11px | 400–600 | Normal | 0.1–0.18em | 1.2       | inkFaint  |
| Section marker | Sans   | 11px  | 400    | Normal | 0.18em      | 1.2         | accent    |
| Filter pill    | Serif  | 11px  | 400    | Normal | 0.08em      | 1.0         | inkFaint  |

### 5.3 Rules

- **Italic** is for attribution, subtitles, photo captions, placeholder text, and the tagline. Italic in this product means "personal voice" or "editorial aside."
- **Bold (600)** is reserved for proper names used inline in a list context, and for active states in micro labels. Never bold body text. Never bold headings.
- **Uppercase** is only for micro labels and section markers — always paired with wide tracking (0.1em+). Never uppercase headings or body text.
- The input placeholder is always italic serif: *"Write it like you're telling a friend…"*

---

## 6. Illustration

Fine-line ink drawings — the aesthetic of someone who sketches in their travel journal. All SVG, all `stroke` only (no fill), single ink color (#2D2A26).

### 6.1 Stroke Weight System

```
0.35–0.4px   Hatching, shadows, texture fills
0.55–0.6px   Secondary detail, steam wisps, delicate elements
0.75px       Base weight — most forms drawn here
1.0px        Primary outlines, subject emphasis
1.5px        Bold structural lines, architectural forms
```

Stroke weights are absolute, not relative to illustration size. An illustration rendered at 160×130px uses the same weights as one at 80×65px.

### 6.2 Subject Matter

Objects that belong in a travel sketchbook: espresso cups, doorways, market stalls, compasses, wine glasses, bicycles, architectural arches, citrus slices, hanging signs, candles, open books, mortar and pestle.

Each illustration is specific and place-rooted — drawn as though the illustrator was actually there. A cafe illustration shows a specific espresso cup on a specific saucer with steam rising. Not a generic coffee icon.

### 6.3 Rules

- Never filled shapes — stroke only, always
- Never color in illustrations — single ink color throughout
- Never generic tech icons (settings gears, hamburger menus, etc.)
- Never decorative filler — every illustration earns its place (empty states, onboarding, loading)
- Cross-hatching for shadow and texture, not solid fills
- Opacity variations (0.3–0.9) create depth without breaking the single-color constraint
- SVG `stroke-linecap: round` on delicate elements (steam, hatching)

### 6.4 Usage Contexts

| Context                | Size          | Notes                                    |
|------------------------|---------------|------------------------------------------|
| Onboarding screens     | 160–180px     | Full scene, centered, sets the tone      |
| Empty states           | 120–160px     | Scene with personality, not sadness      |
| Category headers       | 40–60px       | Spot illo, static, compact               |
| Loading / transition   | 80–120px      | May include animation (see Motion)       |

---

## 7. Photography

Photos in guides feel like memories, not listings. Personal, landscape, slightly unpolished. A place photo should look like something you'd take on your phone while actually there.

### 7.1 Treatment

- Never crop to squares. Aspect ratio is 16:10 for hero blocks, unconstrained for thumbnails.
- No stock photography, ever. No over-produced hero shots.
- No filters, no heavy processing. The photo should feel like a moment, not a production.

### 7.2 UI Placement

| Context                | Format                           | Size              |
|------------------------|----------------------------------|--------------------|
| Horizontal gallery     | Scrollable strip, first = cover  | 150×108px tiles    |
| Hero block (detail)    | Full-width                       | 16:10 aspect       |
| Place card thumbnail   | Inline                           | Unconstrained      |
| Guide cover            | First photo or solid color       | Full-width         |

The first tile in a gallery strip is the cover image, marked with a "Cover" badge (sans, 9px, uppercase).

---

## 8. Motion System

Atmospheric rather than performative. Animations should feel like the environment is alive, not like the app is showing off. Like catching a scene mid-moment.

### 8.1 Principles

| Principle     | Rule                                                                                          |
|---------------|-----------------------------------------------------------------------------------------------|
| Focus         | One moving element per scene. The rest stays still.                                          |
| Duration      | 2–4s for ambient loops. 200–300ms for UI transitions. 1.5–2.2s for one-shot moments.        |
| Properties    | Opacity and position only for atmosphere. Scale only for the Waymark. No color animation.    |
| De-sync       | Multiple animated elements get staggered delays (0.1–0.5s), never synchronized.             |
| Accessibility | All animation respects `prefers-reduced-motion`. Reduced = static, no exceptions.            |
| Technology    | CSS keyframes and SVG animation only. No Lottie, no JS animation libraries, no GIFs.        |

### 8.2 Easing

```
Default:         cubic-bezier(0.4, 0, 0.2, 1)    — for most transitions and one-shots
Sine (ambient):  cubic-bezier(0.45, 0, 0.55, 1)  — for breathing / looping animations
Spring (tap):    cubic-bezier(0.34, 1.56, 0.64, 1) — for tap response only
UI transition:   ease-in-out                       — for screen transitions (200–300ms)
```

### 8.3 Four Animation Layers

The motion system has four distinct layers. Each has its own vocabulary and rules.

**Layer 1: Waymark Animations**
See Section 3 above. Four named treatments: Draw In, Compass Settle, Breathe, Tap Response.

**Layer 2: Illustration Animations**
Illustrations can come alive in specific moments. Three techniques:

- **Draw-on** — SVG paths draw themselves via `stroke-dashoffset`. Used for onboarding illustrations where the user is pausing. Duration: 1.5–2.5s. Plays once.
- **Ambient loop** — A single element breathes: candle flicker (opacity 0.4–0.8), sign sway (rotate ±2°), page turning (rotate 0–3°). Duration: 2–4s cycle. Loops infinitely. Used for empty states.
- **Atmospheric** — Environmental effects: steam rising (translateY + opacity fade), dust motes drifting (slow translateX/Y), light shifting (opacity pulse on a highlight area). Duration: 3–6s cycle. Used for loading and transition moments.

Rules: Only one technique per illustration. The rest of the scene stays static. Ambient and atmospheric loops must be subtle enough that a user might not consciously notice them.

**Layer 3: UI Transitions**

- Screen transitions: horizontal slide, 250ms, ease-in-out. No modals in flows — always forward navigation.
- Card expansion: `max-height` transition, 400ms, ease. Opacity 0→1 on the expanded content.
- Content appear: gentle `translateY(10px)` → `translateY(0)` with opacity 0→1, 200ms, staggered by 50ms per item.
- Filter state changes: cross-fade, 150ms.
- No bounce. No spring physics except Waymark Tap Response. No dramatic entrances.

**Layer 4: Content Loading**

This is the sequence from "user tapped something" to "content is visible":

1. **Immediate** (0ms): Navigation occurs. New screen frame is visible with the nav bar, back button, and any static chrome.
2. **Waymark Breathe** (0–load time): If data fetch takes >300ms, the Waymark Breathe animation appears centered in the content area at 40px. Below it, the screen title (if known) renders in ink at 15px serif. No spinner, no skeleton, no shimmer.
3. **Content resolve** (on data): Breathe mark fades out over 200ms. Content fades in with a subtle upward drift — `opacity: 0, translateY(8px)` → `opacity: 1, translateY(0)`, 300ms, ease. If the content is a list, items stagger by 40ms each (max 8 items staggered, rest appear immediately).
4. **Images** load independently and crossfade from the surface color (`#F2EDE6`) to the photo over 200ms. No layout shift — image containers have fixed aspect ratios.

For the **web recipient landing page** specifically: the Waymark Draw In plays as the page loads, then transitions directly into the guide content. This is the only place where a Waymark one-shot animation flows into content loading.

**What we never do:**
- Skeleton screens / shimmer effects — too tech-product, breaks the editorial feel
- Spinners of any kind
- Progress bars (except the annotate flow in import, which is a real progress indicator)
- Bouncing dots
- Full-screen loading overlays

### 8.4 Confirmation Moments

Saving a place, completing a guide, finishing an import — these get a single quiet animation, not a celebration.

The save confirmation (screen 4.5):
1. Circle scales in with slight spring overshoot (0.32s)
2. Checkmark draws itself via stroke-dashoffset (0.35s)
3. Star particles scatter outward in a burst (staggered, 0.3s each)
4. Ring pulse expands and fades (0.8s)
5. Text and buttons fade up from below (0.3s)

This is the most "celebratory" any moment gets. No confetti. No particle effects. No sound.

### 8.5 Do & Don't

**Do:**
- Steam wisps that drift upward and fade
- A compass needle that settles to rest
- Content that fades in gently from below
- A single candle flame that flickers with opacity
- The Waymark breathing while you wait

**Don't:**
- Bouncing elements or spring physics (except Waymark Tap)
- Particles, confetti, or any celebratory excess
- Elements that slide in from off-screen
- Color transitions or hue shifts
- Parallax scrolling or scroll-linked animation
- Anything that makes the user conscious of the animation

---

## 9. Spacing & Layout

### 9.1 Grid

4px base unit. All spacing values are multiples of 4. Generous white space — "the white space is load-bearing."

```
xs       4px      Tight internal gaps, icon-to-label
sm       8px      Compact list item spacing
md       14px     Component internal padding
lg       20px     Page edge margin (compact)
xl       24px     Standard screen edge margin
xxl      28–32px  Section spacing
xxxl     40–60px  Major section breaks, hero padding
```

### 9.2 Screen Dimensions

- Design target: 390px width (iPhone 15 standard)
- Screen edge margin: 24px
- Section spacing: 28–32px
- Component internal padding: 14–16px
- NavBar height: ~56px with 18px vertical padding
- Bottom safe area: always respected (48px minimum buffer)

### 9.3 Borders & Corners

- Border width: 1px, always
- Border radius: 2–3px — almost square
- Never pill-shaped buttons (except visited toggle, which is circular by design)
- Never rounded cards with heavy shadow
- "The product has corners, not softness"

---

## 10. Components

### 10.1 Buttons

**Primary (accent):**
- Background: accent (#C17C4E)
- Text: onAccent (#FFFFFF), serif, 14px
- Padding: 14px 24px
- Border radius: 2px
- No shadow

**Secondary (outline):**
- Background: transparent
- Border: 1px solid border (#E8E4DF)
- Text: ink (#2D2A26), serif, 14px
- Padding: 14px 24px
- Border radius: 2px

**Ghost (text-only):**
- No background, no border
- Text: inkFaint (#9C8E7C), serif, 13px
- For tertiary actions, "skip" links, cancel

### 10.2 Cards

- Background: surface (#F2EDE6) or canvas (#FAF8F5)
- Border: 1px solid border (#E8E4DF)
- Border radius: 2px
- Internal padding: 14–16px
- No drop shadow (ever)
- Expansion: max-height transition with content opacity

### 10.3 Inputs

- Background: #FFFFFF or canvas
- Border: 1px solid border (#E8E4DF)
- Border radius: 3px
- Padding: 14px
- Font: serif, 15px
- Placeholder: italic, inkFaint
- Focus: border transitions to borderBold (#D0C8BE)

### 10.4 Status Badges

- Open: serif, 11px, italic, color `open` (#7A8B5E)
- Closed: serif, 11px, italic, color `closed` (#B08968)
- Permanently closed: serif, 11px, italic, color `permanent` (#9B5E38)
- Google verified: sans, 10px, on subtle badge background (#D8C9B8 bg, #6B5A48 text)
- Reservation / walk-in: serif, 11px, inkFaint, in a pill with surface bg and border

### 10.5 Filter Pills

- Background: transparent (inactive) / surface (active)
- Border: 1px solid border
- Border radius: 999px (pill shape — the one exception to the corners rule)
- Font: serif, 11px, letter-spacing 0.08em
- Color: inkFaint (inactive) / ink (active)

### 10.6 Visited Toggle

- Unvisited: 22px circle, 1px border (#C0B8B0), transparent fill
- Visited: 22px circle, accent fill, white checkmark (9px SVG, strokeWidth 3)

---

## 11. Voice & Tone

### 11.1 Product Copy

Write it like a person wrote it, not a product team. The voice is warm, specific, confident without being pushy.

**Good:** "Your first place is the hardest. Think of somewhere you'd tell a friend about without hesitating."
**Bad:** "Get started by adding your first location to your guide!"

**Good:** "You've seen Justin's Valencia. Hope it was everything he said it would be."
**Bad:** "Congratulations! You've completed this guide. Share your own guide now!"

### 11.2 Register

- **Author-facing (iOS):** Conversational, encouraging, slightly literary. Like a thoughtful friend.
- **Recipient-facing (web):** Warm, clear, stays out of the way. The author's voice is the star — the app's voice is the stage.
- **Empty states:** Have personality. Not sad, not apologetic. "No one's shared a guide with you yet. When someone does, it'll show up here." Not: "Nothing to see here."
- **Error states:** Honest, actionable. "We couldn't find any places in that link. Make sure you're sharing a saved list, not a single place."

### 11.3 Rules

- Never use exclamation marks in system copy (the author can use them in their notes)
- Never use "awesome", "amazing", "great job", or any empty enthusiasm
- Never use "oops" or faux-casual tech language
- The note input placeholder is sacred: *"Write it like you're telling a friend…"*

---

## 12. Implementation Reference

### 12.1 SwiftUI Waymark Component

```swift
struct Waymark: View {
    var size: CGFloat = 24
    var color: Color = Color("ink")
    var strokeWidth: CGFloat = 1.3

    private var center: CGFloat { size / 2 }
    private var outerExtent: CGFloat { size * 0.44 }
    private var waist: CGFloat { size * 0.08 }

    var body: some View {
        ZStack {
            // Vertical diamond
            Path { path in
                path.move(to: CGPoint(x: center, y: center - outerExtent))
                path.addLine(to: CGPoint(x: center + waist, y: center))
                path.addLine(to: CGPoint(x: center, y: center + outerExtent))
                path.addLine(to: CGPoint(x: center - waist, y: center))
                path.closeSubpath()
            }
            .stroke(color, style: StrokeStyle(lineWidth: strokeWidth, lineJoin: .round))

            // Horizontal diamond
            Path { path in
                path.move(to: CGPoint(x: center - outerExtent, y: center))
                path.addLine(to: CGPoint(x: center, y: center - waist))
                path.addLine(to: CGPoint(x: center + outerExtent, y: center))
                path.addLine(to: CGPoint(x: center, y: center + waist))
                path.closeSubpath()
            }
            .stroke(color, style: StrokeStyle(lineWidth: strokeWidth, lineJoin: .round))

            // Center dot
            Circle()
                .fill(color.opacity(0.65))
                .frame(width: strokeWidth * 1.4, height: strokeWidth * 1.4)
        }
        .frame(width: size, height: size)
    }
}
```

### 12.2 SwiftUI Color Tokens

```swift
extension Color {
    static let canvas     = Color(hex: "FAF8F5")
    static let surface    = Color(hex: "F2EDE6")
    static let sunken     = Color(hex: "EDE7DE")
    static let ink        = Color(hex: "2D2A26")
    static let inkMuted   = Color(hex: "4A4540")
    static let inkFaint   = Color(hex: "9C8E7C")
    static let accent     = Color(hex: "C17C4E")
    static let accentWarm = Color(hex: "D4A574")
    static let accentDeep = Color(hex: "9B5E38")
    static let sage       = Color(hex: "7A8B5E")
    static let border     = Color(hex: "E8E4DF")
    static let borderBold = Color(hex: "D0C8BE")
    static let onAccent   = Color.white
}
```

### 12.3 Web (Next.js) Waymark Component

```tsx
export function Waymark({
  size = 24,
  stroke = '#2D2A26',
  strokeWidth = 1.3,
}: {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  const c = size / 2;
  const outer = size * 0.44;
  const waist = size * 0.08;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label="Lore Guides"
    >
      <path
        d={`M${c} ${c - outer} L${c + waist} ${c} L${c} ${c + outer} L${c - waist} ${c} Z`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d={`M${c - outer} ${c} L${c} ${c - waist} L${c + outer} ${c} L${c} ${c + waist} Z`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx={c} cy={c} r={strokeWidth * 0.7} fill={stroke} opacity={0.65} />
    </svg>
  );
}
```

### 12.4 CSS Custom Properties (Web)

```css
:root {
  /* Backgrounds */
  --color-canvas: #FAF8F5;
  --color-surface: #F2EDE6;
  --color-sunken: #EDE7DE;

  /* Text */
  --color-ink: #2D2A26;
  --color-ink-muted: #4A4540;
  --color-ink-faint: #9C8E7C;

  /* Accent */
  --color-accent: #C17C4E;
  --color-accent-warm: #D4A574;
  --color-accent-deep: #9B5E38;

  /* Secondary */
  --color-sage: #7A8B5E;

  /* Borders */
  --color-border: #E8E4DF;
  --color-border-bold: #D0C8BE;

  /* Utility */
  --color-on-accent: #FFFFFF;

  /* Map */
  --color-map-bg: #F0EAE0;
  --color-map-water: #D9E8EC;
  --color-map-green: #D8E8CC;
  --color-map-pin: #8C7B6B;
  --color-map-pin-active: #C17C4E;

  /* Typography */
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 14px;
  --space-lg: 20px;
  --space-xl: 24px;
  --space-2xl: 28px;
  --space-3xl: 40px;

  /* Borders */
  --radius-sm: 2px;
  --radius-md: 3px;
  --radius-pill: 999px;

  /* Motion */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sine: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

### 12.5 Breathe Animation (CSS)

```css
@keyframes waymark-breathe-v {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  45% { transform: scale(1.07); opacity: 1; }
}
@keyframes waymark-breathe-h {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  45% { transform: scale(1.07); opacity: 1; }
}
@keyframes waymark-breathe-dot {
  0%, 100% { transform: scale(1); }
  45% { transform: scale(1.15); }
}

.waymark-breathe .waymark-v {
  transform-origin: center;
  animation: waymark-breathe-v 3s var(--ease-sine) infinite;
}
.waymark-breathe .waymark-h {
  transform-origin: center;
  animation: waymark-breathe-h 3s var(--ease-sine) infinite;
  animation-delay: 0.35s;
}
.waymark-breathe .waymark-dot {
  transform-origin: center;
  animation: waymark-breathe-dot 3s var(--ease-sine) infinite;
  animation-delay: 0.15s;
}

@media (prefers-reduced-motion: reduce) {
  .waymark-breathe .waymark-v,
  .waymark-breathe .waymark-h,
  .waymark-breathe .waymark-dot {
    animation: none;
  }
}
```

### 12.6 Content Loading Transition (CSS)

```css
@keyframes content-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-loading-enter {
  animation: content-fade-in 300ms var(--ease-default) both;
}

/* Stagger list items — apply via nth-child or inline delay */
.content-loading-enter:nth-child(1) { animation-delay: 0ms; }
.content-loading-enter:nth-child(2) { animation-delay: 40ms; }
.content-loading-enter:nth-child(3) { animation-delay: 80ms; }
.content-loading-enter:nth-child(4) { animation-delay: 120ms; }
.content-loading-enter:nth-child(5) { animation-delay: 160ms; }
.content-loading-enter:nth-child(6) { animation-delay: 200ms; }
.content-loading-enter:nth-child(7) { animation-delay: 240ms; }
.content-loading-enter:nth-child(8) { animation-delay: 280ms; }
/* Items beyond 8 appear immediately (no stagger) */

/* Image crossfade from placeholder */
.image-loading {
  background-color: var(--color-surface);
  transition: opacity 200ms var(--ease-default);
}
```

### 12.7 File Structure

```
iOS:
  LoreGuides/Design/Tokens.swift              — Color + Font extensions
  LoreGuides/Design/Waymark.swift              — Static Waymark view
  LoreGuides/Design/WaymarkAnimations.swift    — Breathe, Settle, Tap, DrawIn
  LoreGuides/Design/Components/               — Buttons, cards, inputs, status badges

Web:
  src/components/Waymark.tsx                   — Waymark React component
  src/components/WaymarkBreathe.tsx            — Breathing animation wrapper
  src/lib/tokens.ts                            — Token constants (exported for Tailwind + JS)
  src/styles/globals.css                       — CSS custom properties on :root
  src/styles/animations.css                    — Keyframes (breathe, content-enter, draw-in)
  public/favicon.svg                           — Static Waymark as favicon
```

Always import from these canonical files. Never inline token values. Never recreate the mark from scratch.

---

## 13. Integration Checklist

Before shipping any screen, verify:

- [ ] Waymark renders from code (not raster) at the correct lockup size
- [ ] Georgia serif is the primary typeface — sans only for UI chrome
- [ ] All colors use the token system — no hardcoded one-off hex values
- [ ] Background is `canvas` (#FAF8F5), never white (#FFF) or pure black
- [ ] Borders use `border` or `borderBold` tokens
- [ ] Accent color is terracotta (#C17C4E), not blue/purple/generic
- [ ] Border radius is 2–3px (never rounded cards, never heavy shadows)
- [ ] 4px spacing grid is maintained throughout
- [ ] Animations are atmospheric (ease, no bounce except Tap Response)
- [ ] Text on accent backgrounds uses `onAccent` (#FFF)
- [ ] Map tiles use the custom parchment palette, not default styles
- [ ] Loading states use Waymark Breathe, not a spinner
- [ ] Content transitions use the fade-up pattern, not skeleton/shimmer
- [ ] Illustrations are stroke-only, single color, using the weight system
- [ ] Copy sounds like a person, not a product team
- [ ] `prefers-reduced-motion` is respected for all animation
- [ ] Images have fixed aspect ratios (no layout shift on load)
