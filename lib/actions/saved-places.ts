"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";

export interface SavePlaceFormState {
  error: string | null;
  /** Latest known saved state after the action ran. Lets the caller
   *  reflect it without an extra fetch. */
  saved?: boolean;
}

// Toggle save/unsave for an individual place. Bound with the
// (sourceGuideSlug, placeId) pair so useActionState only needs to
// pass (prev, formData). sourceGuideSlug records which public guide
// the recipient was browsing when they saved — purely informational.
export async function toggleSavePlace(
  sourceGuideSlug: string,
  placeId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prev: SavePlaceFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _form: FormData,
): Promise<SavePlaceFormState> {
  const profile = await currentProfile();
  if (!profile) {
    redirect(`/signup?next=${encodeURIComponent(`/g/${sourceGuideSlug}`)}`);
  }

  const supabase = await createClient();

  // Verify the place is reachable in the named public guide. Without
  // this an attacker who guessed a private place_id could save it via
  // this endpoint (RLS would block reads, but inserts only check the
  // user_id constraint).
  const { data: link } = await supabase
    .from("guide_places")
    .select("guide_id, guides!inner(id, slug, is_public)")
    .eq("place_id", placeId)
    .eq("guides.slug", sourceGuideSlug)
    .eq("guides.is_public", true)
    .maybeSingle();
  if (!link) return { error: "That place isn't in this public guide." };

  // Toggle: try delete first; if nothing was deleted, insert.
  const { data: deleted, error: delErr } = await supabase
    .from("saved_places")
    .delete()
    .eq("user_id", profile.id)
    .eq("place_id", placeId)
    .select("id");
  if (delErr) return { error: delErr.message };

  if (deleted && deleted.length > 0) {
    revalidatePath(`/g/${sourceGuideSlug}`);
    revalidatePath(`/g/${sourceGuideSlug}/p/${placeId}`);
    revalidatePath("/home");
    return { error: null, saved: false };
  }

  const { error: insErr } = await supabase.from("saved_places").insert({
    user_id: profile.id,
    place_id: placeId,
    source_guide_id: link.guide_id,
  });
  if (insErr) return { error: insErr.message };

  revalidatePath(`/g/${sourceGuideSlug}`);
  revalidatePath(`/g/${sourceGuideSlug}/p/${placeId}`);
  revalidatePath("/home");
  return { error: null, saved: true };
}
