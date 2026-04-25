// Mock fixtures used during M1 to render screens before Supabase is wired in.
// Ported from docs/design-handoff/tokens.jsx, normalized to our types.
// "Day Trip" was dropped from the time taxonomy, so Albufera (Valencia #7)
// reads as "Evening" — the boat trip happens at sunset.

import type { Guide, Place, Profile } from "./types";

export const me: Profile = {
  id: "user-justin",
  email: "justin@coalesce.nyc",
  displayName: "Justin",
  homeCity: "Brooklyn, NY",
};

export const guides: Guide[] = [
  {
    id: "guide-valencia",
    authorId: me.id,
    title: "Valencia",
    type: "city",
    scope: "Spain",
    city: "Valencia",
    country: "Spain",
    slug: "justin-valencia",
    color: "#C17C4E",
    year: "2019",
    context: "Lived there",
    isPublic: true,
    intro:
      "I lived here for two months in the fall of 2019. Valencia is one of those cities that doesn't try to impress you — it just quietly becomes the best place you've ever been. The light is different. The pace is different. You'll eat better here than almost anywhere in Europe and nobody will rush you.",
  },
  {
    id: "guide-lisbon",
    authorId: me.id,
    title: "Lisbon",
    type: "city",
    scope: "Portugal",
    city: "Lisbon",
    country: "Portugal",
    slug: "justin-lisbon",
    color: "#7A8B5E",
    year: "2022",
    context: "Visited 3x",
    isPublic: false,
  },
  {
    id: "guide-south-fl",
    authorId: me.id,
    title: "South Florida",
    type: "region",
    scope: "Region",
    slug: "justin-south-florida",
    color: "#4A6B8B",
    year: "Ongoing",
    context: "From here",
    isPublic: false,
  },
  {
    id: "guide-keys-2024",
    authorId: me.id,
    title: "Keys road trip",
    type: "trip",
    scope: "Spring 2024",
    slug: "justin-keys-road-trip",
    color: "#5C6B8B",
    year: "Apr 2024",
    isPublic: false,
  },
  {
    id: "guide-best-bars",
    authorId: me.id,
    title: "Best bars I've ever been",
    type: "theme",
    scope: "A theme",
    slug: "justin-best-bars",
    color: "#6B4E3D",
    year: "Ongoing",
    isPublic: false,
  },
  {
    id: "guide-best-coffee",
    authorId: me.id,
    title: "Coffee shops, considered",
    type: "theme",
    scope: "A theme",
    slug: "justin-coffee-shops-considered",
    color: "#A68B6B",
    year: "Ongoing",
    isPublic: false,
  },
];

// All places — both filed in Valencia and the "wild" Florida ones.
export const places: Place[] = [
  // ─── Valencia ───────────────────────────────────────────────────────────
  {
    id: "place-1",
    createdBy: me.id,
    name: "La Más Bonita",
    neighborhood: "Malvarrosa Beach",
    address: "Paseo Marítimo Patacona 11, Valencia",
    bestTime: "Morning",
    type: "Eat",
    note: "Walk here before 9am when the beach is empty. Order the fresh orange juice and the tostada con tomate. Sit outside. Watch the Mediterranean do its thing.",
    vibe: "Golden hour breakfast",
    timeSensitive: "Best before 9am",
    isDraft: false,
    guideIds: ["guide-valencia"],
    photoColor: "#D4A574",
    photoCaption: "The terrace at sunrise, before the crowds",
  },
  {
    id: "place-4",
    createdBy: me.id,
    name: "Jardín del Turia",
    neighborhood: "Crosses the city",
    bestTime: "Morning",
    type: "Do",
    note: "A river that became the most beautiful urban park in Europe. Rent a bike and ride the full 9km. You'll pass under medieval bridges, through orange groves.",
    vibe: "The soul of the city",
    isDraft: false,
    guideIds: ["guide-valencia"],
    photoColor: "#7A8B5E",
    photoCaption: "Under the Serranos bridge, heading west",
  },
  {
    id: "place-5",
    createdBy: me.id,
    name: "Horchatería Daniel",
    neighborhood: "Alboraya",
    bestTime: "Afternoon",
    type: "Drink",
    note: "Take the tram to Alboraya. Order horchata and fartons. This is THE horchata — made from tiger nuts grown in the fields you can see from the window.",
    vibe: "A flavor you can't find at home",
    isDraft: false,
    guideIds: ["guide-valencia"],
    photoColor: "#C9B896",
    photoCaption: "Fartons and horchata, the only order",
  },
  {
    id: "place-2",
    createdBy: me.id,
    name: "Mercado Central",
    neighborhood: "Ciutat Vella",
    bestTime: "Afternoon",
    type: "See",
    note: "Go on a weekday. Don't eat breakfast first. Wander until something pulls you in. Buy a bag of clementines and eat them on the steps outside.",
    vibe: "Sensory overload in the best way",
    isDraft: false,
    guideIds: ["guide-valencia"],
    photoColor: "#8B6F4E",
    photoCaption: "The stained glass dome catches everything",
  },
  {
    id: "place-3",
    createdBy: me.id,
    name: "Bodega Casa Montaña",
    neighborhood: "El Cabanyal",
    bestTime: "Evening",
    type: "Drink",
    note: "The oldest bar in Valencia, since 1836. The clóchinas are non-negotiable. So is the vermut on tap. Walk around El Cabanyal before dinner.",
    vibe: "The real thing",
    timeSensitive: "Opens at 7pm",
    isDraft: false,
    guideIds: ["guide-valencia", "guide-best-bars"],
    photoColor: "#6B4E3D",
    photoCaption: "Barrel-aged vermut and 200 years of history",
  },
  {
    id: "place-6",
    createdBy: me.id,
    name: "Café de las Horas",
    neighborhood: "El Carmen",
    bestTime: "Night",
    type: "Drink",
    note: "Baroque, candlelit, a little dramatic. Order the Agua de Valencia. Go after 10pm when the neighborhood comes alive.",
    vibe: "Where the night begins",
    timeSensitive: "Best after 10pm",
    isDraft: false,
    guideIds: ["guide-valencia"],
    photoColor: "#4A3728",
    photoCaption: "Candlelight and cava, every single night",
  },
  {
    id: "place-7",
    createdBy: me.id,
    name: "Albufera Natural Park",
    neighborhood: "South of the city",
    bestTime: "Evening",
    type: "Do",
    note: "This is where paella was born. Take a boat through the wetlands at sunset, then eat arroz in one of the restaurants in El Palmar.",
    vibe: "Where paella comes from",
    isDraft: false,
    guideIds: ["guide-valencia"],
    photoColor: "#B08968",
    photoCaption: "Sunset over the lagoon from the boat",
  },

  // ─── Unfiled (captured in the wild) ─────────────────────────────────────
  {
    id: "place-20",
    createdBy: me.id,
    name: "The Anchor",
    neighborhood: "Islamorada, FL",
    bestTime: "Evening",
    type: "Drink",
    note: "Sunset dock bar. Key lime pie was surprisingly great.",
    isDraft: false,
    guideIds: [],
    photoColor: "#4A6B8B",
    savedOn: "2 days ago",
  },
  {
    id: "place-21",
    createdBy: me.id,
    name: "Bakan",
    neighborhood: "Wynwood, Miami",
    bestTime: "Night",
    type: "Eat",
    note: "The best mezcal list in Miami. Barbacoa is non-negotiable.",
    isDraft: false,
    guideIds: [],
    photoColor: "#8B4E3D",
    savedOn: "Last week",
  },
  {
    id: "place-22",
    createdBy: me.id,
    name: "Robert Is Here",
    neighborhood: "Homestead, FL",
    bestTime: "Afternoon",
    type: "Eat",
    note: "Roadside fruit stand. The strawberry milkshakes are the whole point.",
    isDraft: false,
    guideIds: [],
    photoColor: "#C17C4E",
    savedOn: "Last week",
  },
  {
    id: "place-23",
    createdBy: me.id,
    name: "Vizcaya",
    neighborhood: "Coconut Grove, Miami",
    bestTime: "Morning",
    type: "See",
    note: "Arrive right at opening. The gardens in morning light.",
    isDraft: false,
    guideIds: [],
    photoColor: "#7A8B5E",
    savedOn: "3 weeks ago",
  },
  {
    id: "place-24",
    createdBy: me.id,
    name: "Blue Bottle, Ferry Building",
    neighborhood: "Embarcadero, SF",
    bestTime: "Morning",
    type: "Drink",
    note: "Gibraltar at the counter, then walk the pier.",
    isDraft: false,
    guideIds: ["guide-best-coffee"],
    photoColor: "#A68B6B",
    savedOn: "Last month",
  },
  {
    id: "place-25",
    createdBy: me.id,
    name: "Golden Gai",
    neighborhood: "Shinjuku, Tokyo",
    bestTime: "Night",
    type: "Drink",
    note: "Sarah's pick — 'go to the 4th alley, the sixth bar'",
    isDraft: false,
    guideIds: [],
    photoColor: "#4A3728",
    savedOn: "From Sarah's guide",
    fromGuide: "Sarah's Tokyo",
  },
];

// Helpers used by screen components
export function placesInGuide(guideId: string): Place[] {
  return places.filter((p) => p.guideIds.includes(guideId));
}

export function unfiledPlaces(): Place[] {
  return places.filter((p) => p.guideIds.length === 0);
}

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function guidesById(ids: string[]): Guide[] {
  return guides.filter((g) => ids.includes(g.id));
}

export function placeById(id: string): Place | undefined {
  return places.find((p) => p.id === id);
}
