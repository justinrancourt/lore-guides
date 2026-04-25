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
  // Cover image URL if the place has at least one photo. Cheap to populate
  // because we already fetch photo rows alongside the place; sign just the
  // first one to keep list rendering fast.
  cover_url: string | null;
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
    .select("*, guide_places(guide_id), place_photos(storage_path, sort_order)")
    .eq("created_by", userId)
    .eq("is_draft", false)
    .order("created_at", { ascending: false });
  if (error) throw error;

  // Collect cover storage paths and batch-sign in one round trip. Each
  // place gets at most one signed URL (the cover); other photos are
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

  const coverPaths = rows
    .map((r) => r._coverPath)
    .filter((p): p is string => Boolean(p));
  let urlByPath = new Map<string, string>();
  if (coverPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(coverPaths, PHOTO_URL_TTL_SECONDS);
    urlByPath = new Map(
      (signed ?? []).flatMap((s) =>
        s.signedUrl && s.path ? [[s.path, s.signedUrl] as const] : [],
      ),
    );
  }

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

  // Batch-sign all photo URLs across the guide in one round trip.
  const allPhotos = rows.flatMap((p) => p.place_photos ?? []);
  const signed = await signPhotos(
    allPhotos.sort((a, b) => a.sort_order - b.sort_order),
  );
  const signedById = new Map(signed.map((p) => [p.id, p]));

  return rows.map(({ guide_places, place_photos, ...p }) => {
    const orderedPhotos = (place_photos ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ph) => signedById.get(ph.id)!)
      .filter(Boolean);
    return {
      ...p,
      guide_ids: (guide_places ?? []).map((gp) => gp.guide_id),
      cover_url: orderedPhotos[0]?.url ?? null,
      photos: orderedPhotos,
    };
  });
}

// Public-guide-aware place fetch. Returns the place only if it lives
// in the public guide identified by slug; otherwise null. Used by the
// recipient deep-link route /g/[slug]/p/[id], which must never expose
// places from non-public guides regardless of whether the user is signed
// in (RLS would block anyway, but a clean null path is friendlier).
export async function placeInPublicGuide(
  guideSlug: string,
  placeId: string,
): Promise<{
  place: PlaceWithGuidesAndPhotos;
  siblings: PlaceWithGuidesAndPhotos[];
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
  const place = all.find((p) => p.id === placeId);
  if (!place) return null;
  const siblings = all.filter((p) => p.id !== placeId);
  return { place, siblings };
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
    cover_url: photos[0]?.url ?? null,
    photos,
  };
}
