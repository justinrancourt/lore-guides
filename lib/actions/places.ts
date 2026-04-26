"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";
import { BEST_TIMES, PLACE_TYPES } from "@/lib/types";
import type { BestTime, PlaceType } from "@/lib/types";
import type { Database } from "@/lib/db.types";

type PlaceInsert = Database["public"]["Tables"]["places"]["Insert"];
type PlaceUpdate = Database["public"]["Tables"]["places"]["Update"];

export interface SavePlaceFormState {
  error: string | null;
  /** Set on a successful add-place. Lets the client chain photo
   *  uploads against the new place before navigating. */
  placeId?: string;
  guideSlug?: string;
}

const VALID_BEST_TIMES = new Set<string>(BEST_TIMES);
const VALID_TYPES = new Set<string>(PLACE_TYPES);

function strField(form: FormData, name: string): string {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

function nullableStr(form: FormData, name: string): string | null {
  return strField(form, name) || null;
}

function bestTimeField(form: FormData): BestTime | null {
  const v = strField(form, "best_time");
  return VALID_BEST_TIMES.has(v) ? (v as BestTime) : null;
}

function typeField(form: FormData): PlaceType | null {
  const v = strField(form, "type");
  return VALID_TYPES.has(v) ? (v as PlaceType) : null;
}

function boolField(form: FormData, name: string): boolean {
  return form.get(name) === "on" || form.get(name) === "true";
}

function numericField(form: FormData, name: string): number | null {
  const v = form.get(name);
  if (typeof v !== "string" || v.length === 0) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ─── Add a place to a guide ─────────────────────────────────────────────
// Form supplies the place fields plus the guide_id to file under. We
// create a fresh `places` row + a `guide_places` join row in one round
// trip; if the user wants to file the same Google Place twice, we just
// make a new row (intentional — annotations are per-listing for now).

export async function addPlaceToGuide(
  _prev: SavePlaceFormState,
  form: FormData,
): Promise<SavePlaceFormState> {
  const profile = await currentProfile();
  if (!profile) return { error: "Not signed in." };

  const guideId = strField(form, "guide_id");
  const name = strField(form, "name");
  if (!name) return { error: "A place needs a name." };
  if (!guideId) return { error: "Missing guide_id." };

  const lat = numericField(form, "lat");
  const lng = numericField(form, "lng");

  const insert: PlaceInsert = {
    created_by: profile.id,
    name,
    address: nullableStr(form, "address"),
    neighborhood: nullableStr(form, "neighborhood"),
    google_place_id: nullableStr(form, "google_place_id"),
    note: nullableStr(form, "note"),
    vibe: nullableStr(form, "vibe"),
    best_time: bestTimeField(form),
    type: typeField(form),
    lat,
    lng,
    time_sensitive: boolField(form, "time_sensitive_enabled")
      ? nullableStr(form, "time_sensitive")
      : null,
    is_draft: false,
  };

  const supabase = await createClient();

  // Verify the guide belongs to the user before linking — RLS will block
  // an attacker, but a clean error message is friendlier than 403.
  const { data: guide, error: guideErr } = await supabase
    .from("guides")
    .select("id, slug")
    .eq("id", guideId)
    .eq("author_id", profile.id)
    .maybeSingle();
  if (guideErr) return { error: guideErr.message };
  if (!guide) return { error: "That guide isn't yours." };

  const { data: place, error: placeErr } = await supabase
    .from("places")
    .insert(insert)
    .select("id")
    .single();
  if (placeErr) return { error: placeErr.message };

  const { error: linkErr } = await supabase
    .from("guide_places")
    .insert({ guide_id: guideId, place_id: place.id });
  if (linkErr) return { error: linkErr.message };

  revalidatePath(`/guides/${guide.slug}`);
  revalidatePath("/home");
  // Don't redirect — return the new id so the caller can attach any
  // staged photos before navigating to the guide.
  return { error: null, placeId: place.id, guideSlug: guide.slug };
}

// ─── Quick capture (FAB sheet) ──────────────────────────────────────────
// Saves to My Places. If a guide_id is supplied, also files into that
// guide. Skips the search step — the user provides a name.

export async function quickCapture(
  _prev: SavePlaceFormState,
  form: FormData,
): Promise<SavePlaceFormState> {
  const profile = await currentProfile();
  if (!profile) return { error: "Not signed in." };

  const name = strField(form, "name");
  if (!name) return { error: "Tell us what you found." };

  const insert: PlaceInsert = {
    created_by: profile.id,
    name,
    neighborhood: nullableStr(form, "neighborhood"),
    note: nullableStr(form, "note"),
    type: typeField(form),
    is_draft: false,
  };

  const supabase = await createClient();
  const { data: place, error: placeErr } = await supabase
    .from("places")
    .insert(insert)
    .select("id")
    .single();
  if (placeErr) return { error: placeErr.message };

  const guideId = strField(form, "guide_id") || null;
  if (guideId) {
    const { data: guide } = await supabase
      .from("guides")
      .select("id, slug")
      .eq("id", guideId)
      .eq("author_id", profile.id)
      .maybeSingle();
    if (guide) {
      await supabase
        .from("guide_places")
        .insert({ guide_id: guide.id, place_id: place.id });
      revalidatePath(`/guides/${guide.slug}`);
    }
  }

  revalidatePath("/home");
  return { error: null };
}

// ─── Edit a place ───────────────────────────────────────────────────────

export async function editPlace(
  placeId: string,
  _prev: SavePlaceFormState,
  form: FormData,
): Promise<SavePlaceFormState> {
  const profile = await currentProfile();
  if (!profile) return { error: "Not signed in." };

  const name = strField(form, "name");
  if (!name) return { error: "A place needs a name." };

  const update: PlaceUpdate = {
    name,
    neighborhood: nullableStr(form, "neighborhood"),
    address: nullableStr(form, "address"),
    note: nullableStr(form, "note"),
    vibe: nullableStr(form, "vibe"),
    best_time: bestTimeField(form),
    type: typeField(form),
    time_sensitive: boolField(form, "time_sensitive_enabled")
      ? nullableStr(form, "time_sensitive")
      : null,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("places")
    .update(update)
    .eq("id", placeId)
    .eq("created_by", profile.id);
  if (error) return { error: error.message };

  revalidatePath(`/places/${placeId}`);
  revalidatePath("/home");
  redirect(`/places/${placeId}`);
}

export async function deletePlace(placeId: string): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("places")
    .delete()
    .eq("id", placeId)
    .eq("created_by", profile.id);
  if (error) throw error;

  revalidatePath("/home");
  redirect("/home");
}

// ─── Reorder places within a guide ──────────────────────────────────────
// Takes an ordered list of place_ids per best_time bucket and rewrites
// `sort_order` on guide_places. We update in two passes (clear to large
// offset, then assign 0..N) to avoid transient unique-collision issues
// if we ever add a partial unique index on (guide_id, sort_order).

export async function reorderPlacesInGuide(
  guideSlug: string,
  guideId: string,
  orderedPlaceIds: string[],
): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();

  // Verify ownership before writing.
  const { data: guide } = await supabase
    .from("guides")
    .select("id")
    .eq("id", guideId)
    .eq("author_id", profile.id)
    .maybeSingle();
  if (!guide) throw new Error("That guide isn't yours.");

  // PostgREST has no native bulk-update-with-different-values, so we
  // issue one UPDATE per place. The list is small (a guide rarely tops
  // 50 places), so a sequential loop is acceptable.
  for (let i = 0; i < orderedPlaceIds.length; i++) {
    const { error } = await supabase
      .from("guide_places")
      .update({ sort_order: i })
      .eq("guide_id", guideId)
      .eq("place_id", orderedPlaceIds[i]);
    if (error) throw error;
  }

  revalidatePath(`/guides/${guideSlug}`);
}
