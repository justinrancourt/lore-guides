"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";

export interface SaveGuideFormState {
  error: string | null;
  saved?: boolean;
}

// Toggle: if the row exists, remove it; otherwise insert. Used by the
// "Save guide" button on /g/[slug] — the action is bound with `slug`
// then passed to useActionState, which calls it as (prev, formData).
// Both are unused; everything we need is in `slug` + the session.
export async function toggleSaveGuide(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prev: SaveGuideFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _form: FormData,
): Promise<SaveGuideFormState> {
  const profile = await currentProfile();
  if (!profile) {
    redirect(`/signup?next=${encodeURIComponent(`/g/${slug}`)}`);
  }

  const supabase = await createClient();

  const { data: guide, error: guideErr } = await supabase
    .from("guides")
    .select("id, slug, is_public")
    .eq("slug", slug)
    .maybeSingle();
  if (guideErr) return { error: guideErr.message };
  if (!guide) return { error: "That guide doesn't exist." };
  if (!guide.is_public) return { error: "This guide isn't public." };

  // Toggle: try to delete first; if no row was deleted, insert.
  const { data: deleted, error: delErr } = await supabase
    .from("saved_guides")
    .delete()
    .eq("user_id", profile.id)
    .eq("guide_id", guide.id)
    .select("id");
  if (delErr) return { error: delErr.message };

  if (deleted && deleted.length > 0) {
    revalidatePath(`/g/${guide.slug}`);
    revalidatePath("/home/shared");
    return { error: null, saved: false };
  }

  const { error: insErr } = await supabase
    .from("saved_guides")
    .insert({ user_id: profile.id, guide_id: guide.id });
  if (insErr) return { error: insErr.message };

  revalidatePath(`/g/${guide.slug}`);
  revalidatePath("/home/shared");
  return { error: null, saved: true };
}
