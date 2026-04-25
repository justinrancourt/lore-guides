// Domain types for Lore Guides. Mirrors the (forthcoming) Supabase schema.
// Phase 1 uses these against mock data; M2 swaps in generated DB types.

export type BestTime = "Morning" | "Afternoon" | "Evening" | "Night";
export const BEST_TIMES: BestTime[] = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
];

// Coarse 4-category taxonomy (per Justin: revisit after customer feedback).
export type PlaceType = "Eat" | "Drink" | "See" | "Do";
export const PLACE_TYPES: PlaceType[] = ["Eat", "Drink", "See", "Do"];

export type GuideType = "city" | "region" | "trip" | "theme";

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  homeCity?: string;
}

export interface Guide {
  id: string;
  authorId: string;
  title: string;
  type: GuideType;
  scope?: string;
  city?: string;
  country?: string;
  slug: string;
  intro?: string;
  color: string;
  year?: string;
  context?: string;
  isPublic: boolean;
}

export interface Place {
  id: string;
  createdBy: string;
  googlePlaceId?: string;
  name: string;
  address?: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
  bestTime?: BestTime;
  type?: PlaceType;
  note?: string;
  vibe?: string;
  timeSensitive?: string;
  isDraft: boolean;
  // Derived (denormalized for the UI mock; in Postgres comes from guide_places)
  guideIds: string[];
  // Mock-only convenience fields used by the design references
  photoColor?: string;
  photoCaption?: string;
  savedOn?: string;
  fromGuide?: string;
}
