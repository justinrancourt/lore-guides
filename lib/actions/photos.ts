"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";

const BUCKET = "place-photos";

export interface AttachPhotoInput {
  placeId: string;
  storagePath: string;
  caption?: string;
}

// Insert a place_photos row pointing at a file the browser already
// uploaded to Storage. Sort order is appended to the end of the strip.
//
// If the row insert fails after a successful Storage upload (DB error,
// RLS, transient), we'd be left with an orphan blob in Storage with no
// row pointing at it. We do a best-effort delete in that case so we
// don't accumulate dead bytes — the original error is still thrown so
// the caller can surface it.
export async function attachPhoto({
  placeId,
  storagePath,
  caption,
}: AttachPhotoInput): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();

  // Verify the place is theirs. RLS would also block, but failing
  // loudly here lets us clean up the just-uploaded blob before the
  // ownership check denies the insert.
  const { data: place } = await supabase
    .from("places")
    .select("id")
    .eq("id", placeId)
    .eq("created_by", profile.id)
    .maybeSingle();
  if (!place) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error("That place isn't yours.");
  }

  const { count } = await supabase
    .from("place_photos")
    .select("id", { count: "exact", head: true })
    .eq("place_id", placeId);

  const { error } = await supabase.from("place_photos").insert({
    place_id: placeId,
    storage_path: storagePath,
    caption: caption ?? null,
    sort_order: count ?? 0,
  });
  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw error;
  }

  revalidatePath(`/places/${placeId}`);
  revalidatePath(`/places/${placeId}/edit`);
}

export async function deletePhoto(photoId: string): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();

  // Read the row first so we can clean up the Storage object too.
  const { data: photo } = await supabase
    .from("place_photos")
    .select("id, storage_path, place_id, places(created_by)")
    .eq("id", photoId)
    .maybeSingle();
  if (!photo) return; // already gone
  if (photo.places?.created_by !== profile.id) {
    throw new Error("Not yours.");
  }

  const { error: rowErr } = await supabase
    .from("place_photos")
    .delete()
    .eq("id", photoId);
  if (rowErr) throw rowErr;

  // Best-effort storage cleanup. If this fails the row is already gone,
  // so the worst case is an orphan blob — not worth surfacing to the user.
  await supabase.storage.from(BUCKET).remove([photo.storage_path]);

  revalidatePath(`/places/${photo.place_id}/edit`);
  revalidatePath(`/places/${photo.place_id}`);
}

export async function setCoverPhoto(
  placeId: string,
  photoId: string,
): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();
  const { data: photos, error } = await supabase
    .from("place_photos")
    .select("id, place_id, places(created_by)")
    .eq("place_id", placeId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  if (photos.length === 0) return;
  if (photos[0].places?.created_by !== profile.id) {
    throw new Error("Not yours.");
  }

  // Build the new order: cover first, others keep relative order.
  const reordered = [
    photos.find((p) => p.id === photoId),
    ...photos.filter((p) => p.id !== photoId),
  ].filter((p): p is NonNullable<typeof p> => p !== undefined);

  // PostgREST has no native bulk update with different values per row,
  // so loop. Throw on the first failure rather than silently swallowing
  // — matches reorderPlacesInGuide. Worst case the strip is partly
  // reordered; the user retries and the action is idempotent.
  for (let i = 0; i < reordered.length; i++) {
    const { error: updateErr } = await supabase
      .from("place_photos")
      .update({ sort_order: i })
      .eq("id", reordered[i].id);
    if (updateErr) throw updateErr;
  }

  revalidatePath(`/places/${placeId}/edit`);
  revalidatePath(`/places/${placeId}`);
}
