// Lore Guides tokens — lifted from lore-style-guide-v2.jsx verbatim.
// Do not invent colors; do not add a font other than Georgia.

const serif = "'Georgia', 'Times New Roman', serif";
const sans  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const C = {
  bg:          "#FAF8F5",
  canvas:      "#FAF8F5",
  surface:     "#F2EDE6",
  sunken:      "#EDE7DE",
  ink:         "#2D2A26",
  inkMuted:    "#4A4540",
  faint:       "#9C8E7C",
  accent:      "#C17C4E",
  accentDeep:  "#9B5E38",
  accentWarm:  "#D4A574",
  accentSoft:  "#E8D5C2",
  border:      "#E8E4DF",
  borderBold:  "#D0C8BE",
  borderSoft:  "#F0EBE4",
  sage:        "#7A8B5E",
  sageMuted:   "#A8B890",
  sageLight:   "#D8E8CC",
  sageDeep:    "#5C6B46",
  mapBg:       "#F0EAE0",
  mapWater:    "#D9E8EC",
  mapGreen:    "#D8E8CC",
  mapPin:      "#8C7B6B",
  mapPinAct:   "#C17C4E",
  draftBg:     "#F5F0E8",
  draftBorder: "#DDD3C2",
  draftText:   "#B5A48E",
  bannerBg:    "#FDF5EA",
  bannerBorder:"#E8D5B8",
  bannerIcon:  "#C8A05C",
  time:        "#9B8B5A",       // time-sensitive warm
  onAccent:    "#FFFFFF",
};

// ─── Waymark (the compass-rose/star mark) ─────────────────────────────────
// The brand's mark. Use everywhere a generic star/pin would appear.
function Waymark({ size = 16, color, style }) {
  const s = size;
  const k = color || C.ink;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={k} strokeWidth="1.75" style={style}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Filled variant — for pin markers, bullets
function WaymarkFilled({ size = 14, color, bg }) {
  const s = size;
  const fill = bg || C.accent;
  const k = color || fill;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={k} strokeWidth="1" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Small shared icons ────────────────────────────────────────────────────
function Icon({ path, size = 14, color = "currentColor", stroke = 1.5, fill = "none" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}
const Paths = {
  chevDown:  <polyline points="6 9 12 15 18 9" />,
  chevLeft:  <polyline points="15 18 9 12 15 6" />,
  chevRight: <polyline points="9 18 15 12 9 6" />,
  clock:     <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 13.5" /></>,
  mapPin:    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  lock:      <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  check:     <polyline points="20 6 9 17 4 12" />,
  x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  share:     <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/></>,
  bookmark:  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  bookmarkFilled: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  walk:      <><circle cx="13" cy="4" r="2"/><path d="M5 22l3-9 5 2 2-4 3 3"/><path d="M11 13l-2 3"/></>,
  external:  <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
  moreH:     <><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></>,
  edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  heart:     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
  info:      <><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="12" y1="11" x2="12" y2="16"/></>,
};

// ─── The guide data ─────────────────────────────────────────────────────────
// Time-based taxonomy (primary). Type is a second-class facet ('type' field)
// kept for the dual-facet Tweak and for edit-forms.
const GUIDE = {
  city: "Valencia", country: "Spain",
  author: "Justin", authorInitial: "J",
  year: "2019", context: "Lived there",
  intro: "I lived here for two months in the fall of 2019. Valencia is one of those cities that doesn't try to impress you — it just quietly becomes the best place you've ever been. The light is different. The pace is different. You'll eat better here than almost anywhere in Europe and nobody will rush you.",
  places: [
    { id: 1, time: "Morning",   type: "Eat",   name: "La Más Bonita",        nbhd: "Malvarrosa Beach",   note: "Walk here before 9am when the beach is empty. Order the fresh orange juice and the tostada con tomate. Sit outside. Watch the Mediterranean do its thing.", vibe: "Golden hour breakfast",      timeSensitive: "Best before 9am",  photoColor: "#D4A574", photoCaption: "The terrace at sunrise, before the crowds",        x: 77, y: 24 },
    { id: 4, time: "Morning",   type: "Do",    name: "Jardín del Turia",     nbhd: "Crosses the city",   note: "A river that became the most beautiful urban park in Europe. Rent a bike and ride the full 9km. You'll pass under medieval bridges, through orange groves.", vibe: "The soul of the city",       photoColor: "#7A8B5E", photoCaption: "Under the Serranos bridge, heading west",          x: 26, y: 34 },
    { id: 5, time: "Afternoon", type: "Drink", name: "Horchatería Daniel",   nbhd: "Alboraya",           note: "Take the tram to Alboraya. Order horchata and fartons. This is THE horchata — made from tiger nuts grown in the fields you can see from the window.",          vibe: "A flavor you can't find at home", photoColor: "#C9B896", photoCaption: "Fartons and horchata, the only order",         x: 56, y: 12 },
    { id: 2, time: "Afternoon", type: "See",   name: "Mercado Central",      nbhd: "Ciutat Vella",       note: "Go on a weekday. Don't eat breakfast first. Wander until something pulls you in. Buy a bag of clementines and eat them on the steps outside.",                vibe: "Sensory overload in the best way", photoColor: "#8B6F4E", photoCaption: "The stained glass dome catches everything",  x: 33, y: 52 },
    { id: 3, time: "Evening",   type: "Drink", name: "Bodega Casa Montaña",  nbhd: "El Cabanyal",        note: "The oldest bar in Valencia, since 1836. The clóchinas are non-negotiable. So is the vermut on tap. Walk around El Cabanyal before dinner.",                 vibe: "The real thing",             timeSensitive: "Opens at 7pm",      photoColor: "#6B4E3D", photoCaption: "Barrel-aged vermut and 200 years of history",   x: 70, y: 62 },
    { id: 6, time: "Night",     type: "Drink", name: "Café de las Horas",    nbhd: "El Carmen",          note: "Baroque, candlelit, a little dramatic. Order the Agua de Valencia. Go after 10pm when the neighborhood comes alive.",                                        vibe: "Where the night begins",      timeSensitive: "Best after 10pm",  photoColor: "#4A3728", photoCaption: "Candlelight and cava, every single night",      x: 30, y: 47 },
    { id: 7, time: "Day Trip",  type: "Do",    name: "Albufera Natural Park", nbhd: "South of the city", note: "This is where paella was born. Take a boat through the wetlands at sunset, then eat arroz in one of the restaurants in El Palmar.",                           vibe: "Where paella comes from",     dayTrip: true, photoColor: "#B08968", photoCaption: "Sunset over the lagoon from the boat",                           x: 42, y: 82 },
  ],
  drafts: [
    { id: 8,  name: "Ricard Camarena Restaurant", nbhd: "Benicalap",  type: "Restaurant" },
    { id: 9,  name: "Bar Ricardo",                nbhd: "El Carmen",  type: "Bar" },
    { id: 10, name: "La Pepica",                  nbhd: "Malvarrosa", type: "Restaurant" },
    { id: 11, name: "Agua de Mayo",               nbhd: "Ruzafa",     type: "Bar" },
    { id: 12, name: "Mercado de Ruzafa",          nbhd: "Ruzafa",     type: "Market" },
  ],
};

const TIME_CATS = ["All", "Morning", "Afternoon", "Evening", "Night", "Day Trip"];
const TYPE_CATS = ["All", "Eat", "Drink", "See", "Do"];

// ─── My Places (shoebox) ────────────────────────────────────────────────
// All places a user has saved. Each place carries an array of guide ids it
// appears in — many-to-many. `guides: []` means the place is untagged.
const MY_PLACES = [
  // Places inside Valencia guide
  { id: 1,  name: "La Más Bonita",         nbhd: "Malvarrosa, Valencia",    type: "Eat",   time: "Morning",   savedOn: "Oct 2019", guides: ["valencia"],    color: "#D4A574", note: "Walk here before 9am…" },
  { id: 3,  name: "Bodega Casa Montaña",   nbhd: "El Cabanyal, Valencia",   type: "Drink", time: "Evening",   savedOn: "Oct 2019", guides: ["valencia", "best-bars"], color: "#6B4E3D", note: "The oldest bar in Valencia, since 1836." },
  { id: 7,  name: "Albufera Natural Park", nbhd: "South of Valencia",       type: "Do",    time: "Day Trip",  savedOn: "Nov 2019", guides: ["valencia"],    color: "#B08968", note: "Where paella comes from." },
  // Untagged — captured in the wild, not yet filed anywhere
  { id: 20, name: "The Anchor",            nbhd: "Islamorada, FL",          type: "Drink", time: "Evening",   savedOn: "2 days ago",  guides: [],             color: "#4A6B8B", note: "Sunset dock bar. Key lime pie was surprisingly great.", capturedHere: true },
  { id: 21, name: "Bakan",                 nbhd: "Wynwood, Miami",          type: "Eat",   time: "Night",     savedOn: "Last week",   guides: [],             color: "#8B4E3D", note: "The best mezcal list in Miami. Barbacoa is non-negotiable." },
  { id: 22, name: "Robert Is Here",        nbhd: "Homestead, FL",           type: "Eat",   time: "Afternoon", savedOn: "Last week",   guides: [],             color: "#C17C4E", note: "Roadside fruit stand. The strawberry milkshakes are the whole point." },
  { id: 23, name: "Vizcaya",               nbhd: "Coconut Grove, Miami",    type: "See",   time: "Morning",   savedOn: "3 weeks ago", guides: [],             color: "#7A8B5E", note: "Arrive right at opening. The gardens in morning light." },
  { id: 24, name: "Blue Bottle, Ferry Building", nbhd: "Embarcadero, SF",   type: "Drink", time: "Morning",   savedOn: "Last month",  guides: ["best-coffee"],color: "#A68B6B", note: "Gibraltar at the counter, then walk the pier." },
  // Saved from friend's guide
  { id: 25, name: "Golden Gai",            nbhd: "Shinjuku, Tokyo",         type: "Drink", time: "Night",     savedOn: "From Sarah's guide",  guides: [],      color: "#4A3728", note: "Sarah's pick — 'go to the 4th alley, the sixth bar'", fromGuide: "Sarah's Tokyo" },
];

// User's guides (cities, regions, trips, themes — any shape)
const MY_GUIDES = [
  { id: "valencia",   title: "Valencia",                 scope: "Spain",            type: "city",   color: "#C17C4E", year: "2019",    count: 7 },
  { id: "lisbon",     title: "Lisbon",                   scope: "Portugal",         type: "city",   color: "#7A8B5E", year: "2022",    count: 11 },
  { id: "south-fl",   title: "South Florida",            scope: "Region",           type: "region", color: "#4A6B8B", year: "Ongoing", count: 14 },
  { id: "keys-2024",  title: "Keys road trip",           scope: "Spring 2024",      type: "trip",   color: "#5C6B8B", year: "Apr 2024",count: 8 },
  { id: "best-bars",  title: "Best bars I've ever been", scope: "A theme",          type: "theme",  color: "#6B4E3D", year: "Ongoing", count: 23 },
  { id: "best-coffee",title: "Coffee shops, considered", scope: "A theme",          type: "theme",  color: "#A68B6B", year: "Ongoing", count: 31 },
];

const GUIDE_TYPES = [
  { id: "city",   label: "A city",         hint: "Valencia, Lisbon, New York" },
  { id: "region", label: "A region",       hint: "South Florida, Tuscany, the Pacific Northwest" },
  { id: "trip",   label: "A trip",         hint: "Keys 2024, Honeymoon in Japan" },
  { id: "theme",  label: "A theme",        hint: "Best coffee shops, Places to take first-time visitors" },
];

Object.assign(window, { C, serif, sans, Icon, Paths, Waymark, WaymarkFilled, GUIDE, TIME_CATS, TYPE_CATS, MY_PLACES, MY_GUIDES, GUIDE_TYPES });
