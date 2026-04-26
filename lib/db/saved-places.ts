// Read helpers for saved_places (recipient bookmarks of individual
// places from public guides).

import { createClient } from "@/lib/supabase/server";

// Given the place_ids visible in a guide, returns the subset the user
// has saved. The page already knows the place_ids (it just fetched
// them via listPlacesInGuide), so this avoids a join through the
// guide_places relationship.
//
// Returns an empty set if userId is null/empty (anon recipient).
export async function listSavedPlaceIds(
  userId: string | null,
  placeIds: string[],
): Promise<Set<string>> {
  if (!userId || placeIds.length === 0) return new Set();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_places")
    .select("place_id")
    .eq("user_id", userId)
    .in("place_id", placeIds);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.place_id));
}

export async function isPlaceSavedByUser(
  userId: string,
  placeId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_places")
    .select("id")
    .eq("user_id", userId)
    .eq("place_id", placeId)
    .maybeSingle();
  return data !== null;
}
