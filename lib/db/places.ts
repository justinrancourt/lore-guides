// Read helpers for the `places` table.

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db.types";

export type PlaceRow = Database["public"]["Tables"]["places"]["Row"];
export type PlacePhotoRow = Database["public"]["Tables"]["place_photos"]["Row"];

export interface PhotoWithUrl extends PlacePhotoRow {
  url: string;
}

export interface PlaceWithGuides extends PlaceRow {
  guide_ids: string[];
}

export interface PlaceWithGuidesAndPhotos extends PlaceWithGuides {
  photos: PhotoWithUrl[];
}

const PHOTO_BUCKET = "place-photos";
const PHOTO_URL_TTL_SECONDS = 60 * 60; // 1 hour; pages re-fetch on each navigation

async function signPhotos(
  rows: PlacePhotoRow[],
): Promise<PhotoWithUrl[]> {
  if (rows.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(
      rows.map((r) => r.storage_path),
      PHOTO_URL_TTL_SECONDS,
    );
  if (error) throw error;
  // createSignedUrls preserves the input order; zip results back onto rows.
  return rows.map((row, i) => ({
    ...row,
    url: data[i]?.signedUrl ?? "",
  }));
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

  const rows = (data ?? [])
    .map((row) => row.places)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  // Batch-sign all photo URLs across the guide in one round trip.
  const allPhotos = rows.flatMap((p) => p.place_photos ?? []);
  const signed = await signPhotos(
    allPhotos.sort((a, b) => a.sort_order - b.sort_order),
  );
  const signedById = new Map(signed.map((p) => [p.id, p]));

  return rows.map(({ guide_places, place_photos, ...p }) => ({
    ...p,
    guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
    photos: (place_photos ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ph) => signedById.get(ph.id)!)
      .filter(Boolean),
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
  const photos = await signPhotos(
    (place_photos ?? []).sort((a, b) => a.sort_order - b.sort_order),
  );
  return {
    ...p,
    guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
    photos,
  };
}
