// Read helpers for the `places` table.

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db.types";

export type PlaceRow = Database["public"]["Tables"]["places"]["Row"];
export type PlacePhotoRow = Database["public"]["Tables"]["place_photos"]["Row"];

export interface PlaceWithGuides extends PlaceRow {
  guide_ids: string[];
}

export interface PlaceWithGuidesAndPhotos extends PlaceWithGuides {
  photos: PlacePhotoRow[];
}

export async function listPlacesForUser(
  userId: string,
): Promise<PlaceWithGuides[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("*, guide_places(guide_id)")
    .eq("created_by", userId)
    .eq("is_draft", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(({ guide_places, ...p }) => ({
    ...p,
    guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
  }));
}

export async function listPlacesInGuide(
  guideId: string,
): Promise<PlaceWithGuidesAndPhotos[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guide_places")
    .select(
      "sort_order, places(*, place_photos(*), guide_places(guide_id))",
    )
    .eq("guide_id", guideId)
    .order("sort_order", { ascending: true });
  if (error) throw error;

  return (data ?? [])
    .map((row) => row.places)
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map(({ guide_places, place_photos, ...p }) => ({
      ...p,
      guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
      photos: (place_photos ?? []).sort(
        (a, b) => a.sort_order - b.sort_order,
      ),
    }));
}

export async function placeById(
  id: string,
): Promise<PlaceWithGuidesAndPhotos | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("*, place_photos(*), guide_places(guide_id)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { guide_places, place_photos, ...p } = data;
  return {
    ...p,
    guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
    photos: (place_photos ?? []).sort((a, b) => a.sort_order - b.sort_order),
  };
}
