/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Override the default radius scale entirely. Sharp rectangles are core
    // to the design's literary/print aesthetic. The only valid radii are
    // pills (filter chips), circles (FAB, avatar), and the 2px exception
    // used by GuideModeBtn.
    borderRadius: {
      none: "0",
      sm: "2px",
      pill: "9999px",
      circle: "50%",
    },
    extend: {
      colors: {
        // Foundation — values lifted verbatim from docs/design-handoff/tokens.jsx
        bg: "#FAF8F5",
        canvas: "#FAF8F5",
        surface: "#F2EDE6",
        sunken: "#EDE7DE",
        ink: "#2D2A26",
        "ink-muted": "#4A4540",
        faint: "#9C8E7C",
        accent: "#C17C4E",
        "accent-deep": "#9B5E38",
        "accent-warm": "#D4A574",
        "accent-soft": "#E8D5C2",
        border: "#E8E4DF",
        "border-bold": "#D0C8BE",
        "border-soft": "#F0EBE4",
        sage: "#7A8B5E",
        "sage-muted": "#A8B890",
        "sage-light": "#D8E8CC",
        "sage-deep": "#5C6B46",
        "map-bg": "#F0EAE0",
        "map-water": "#D9E8EC",
        "map-green": "#D8E8CC",
        "map-pin": "#8C7B6B",
        "map-pin-active": "#C17C4E",
        "draft-bg": "#F5F0E8",
        "draft-border": "#DDD3C2",
        "draft-text": "#B5A48E",
        "banner-bg": "#FDF5EA",
        "banner-border": "#E8D5B8",
        "banner-icon": "#C8A05C",
        time: "#9B8B5A",
        "on-accent": "#FFFFFF",
        // Used as the body background outside the centered "device" column
        // on desktop. Lifted from docs/design-handoff/design-canvas.jsx.
        deck: "#F0EEE9",
      },
      fontFamily: {
        // Serif is the brand. 99% of UI text uses it. Sans is opt-in only,
        // for map numeric labels and system affordances.
        serif: ['Georgia', '"Times New Roman"', "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
      },
      fontSize: {
        eyebrow: ["10px", { lineHeight: "1.2", letterSpacing: "0.18em" }],
        meta: ["12px", { lineHeight: "1.4" }],
        place: ["19px", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        title: ["26px", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        hero: ["44px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        cover: ["52px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        eyebrow: "0.18em",
        button: "0.14em",
        caps: "0.12em",
      },
      boxShadow: {
        peek: "0 6px 18px rgba(30, 25, 20, 0.15)",
        fab: "0 6px 18px rgba(0, 0, 0, 0.25)",
      },
      transitionDuration: {
        // Brand book §12.4 motion durations.
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
        // Existing — bottom-sheet open/close (kept for the capture sheet).
        sheet: "280ms",
      },
      transitionTimingFunction: {
        // Brand book §12.4 named eases.
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
        sine: "cubic-bezier(0.45, 0, 0.55, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      maxWidth: {
        intro: "300px",
      },
    },
  },
  plugins: [],
};
