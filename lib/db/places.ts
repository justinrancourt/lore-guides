// Read helpers for the `places` table.

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db.types";
import { signStoragePaths } from "./storage";

export type PlaceRow = Database["public"]["Tables"]["places"]["Row"];
export type PlacePhotoRow = Database["public"]["Tables"]["place_photos"]["Row"];

export interface PhotoWithUrl extends PlacePhotoRow {
  url: string;
}

export interface PlaceWithGuides extends PlaceRow {
  guide_ids: string[];
  // Cover image URL if the place has at least one photo. Cheap to populate
  // because we already fetch photo rows alongside the place; sign just the
  // first one to keep list rendering fast.
  cover_url: string | null;
}

export interface PlaceWithGuidesAndPhotos extends PlaceWithGuides {
  photos: PhotoWithUrl[];
}

// Cheap head-only count for the sidebar — avoids fetching + signing all
// the user's places when we only want the number. Used by AuthorShell.
export async function countPlacesForUser(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("places")
    .select("id", { count: "exact", head: true })
    .eq("created_by", userId)
    .eq("is_draft", false);
  if (error) throw error;
  return count ?? 0;
}

export async function listPlacesForUser(
  userId: string,
): Promise<PlaceWithGuides[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("*, guide_places(guide_id), place_photos(storage_path, sort_order)")
    .eq("created_by", userId)
    .eq("is_draft", false)
    .order("created_at", { ascending: false });
  if (error) throw error;

  // Each place gets at most one signed URL (the cover); other photos are
  // fetched lazily when the place detail page renders.
  const rows = (data ?? []).map(({ guide_places, place_photos, ...p }) => {
    const coverPath = (place_photos ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.storage_path;
    return {
      ...p,
      guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
      _coverPath: coverPath as string | undefined,
    };
  });

  const urlByPath = await signStoragePaths(
    supabase,
    rows
      .map((r) => r._coverPath)
      .filter((p): p is string => Boolean(p)),
  );

  return rows.map(({ _coverPath, ...rest }) => ({
    ...rest,
    cover_url: _coverPath ? (urlByPath.get(_coverPath) ?? null) : null,
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

  const rows = (data ?? [])
    .map((row) => row.places)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const allPhotos = rows
    .flatMap((p) => p.place_photos ?? [])
    .sort((a, b) => a.sort_order - b.sort_order);
  const urlByPath = await signStoragePaths(
    supabase,
    allPhotos.map((p) => p.storage_path),
  );

  return rows.map(({ guide_places, place_photos, ...p }) => {
    const orderedPhotos: PhotoWithUrl[] = (place_photos ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ph) => ({ ...ph, url: urlByPath.get(ph.storage_path) ?? "" }));
    return {
      ...p,
      guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
      cover_url: orderedPhotos[0]?.url ?? null,
      photos: orderedPhotos,
    };
  });
}

// Public-guide-aware place fetch. Returns the place only if it lives in
// the public guide identified by slug; otherwise null. Returns the full
// ordered list as well so callers don't have to re-fetch siblings.
export async function placeInPublicGuide(
  guideSlug: string,
  placeId: string,
): Promise<{
  place: PlaceWithGuidesAndPhotos;
  siblings: PlaceWithGuidesAndPhotos[];
  /** All places in the guide, in display order. `place` is at `index`. */
  all: PlaceWithGuidesAndPhotos[];
  index: number;
} | null> {
  const supabase = await createClient();
  const { data: guide } = await supabase
    .from("guides")
    .select("id")
    .eq("slug", guideSlug)
    .eq("is_public", true)
    .maybeSingle();
  if (!guide) return null;

  const all = await listPlacesInGuide(guide.id);
  const index = all.findIndex((p) => p.id === placeId);
  if (index === -1) return null;
  const place = all[index];
  const siblings = all.filter((_, i) => i !== index);
  return { place, siblings, all, index };
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
  const ordered = (place_photos ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
  const urlByPath = await signStoragePaths(
    supabase,
    ordered.map((ph) => ph.storage_path),
  );
  const photos: PhotoWithUrl[] = ordered.map((ph) => ({
    ...ph,
    url: urlByPath.get(ph.storage_path) ?? "",
  }));
  return {
    ...p,
    guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
    cover_url: photos[0]?.url ?? null,
    photos,
  };
}
