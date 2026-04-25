"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";
import { baseSlug, withSuffix } from "@/lib/slug";
import type { Database } from "@/lib/db.types";

type GuideInsert = Database["public"]["Tables"]["guides"]["Insert"];

export interface CreateGuideFormState {
  error: string | null;
  fieldErrors?: { title?: string };
}

const VALID_TYPES = new Set(["city", "region", "trip", "theme"]);
const DEFAULT_TYPE = "theme";
const MAX_SLUG_ATTEMPTS = 50;

function strField(form: FormData, name: string): string {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

export async function createGuide(
  _prev: CreateGuideFormState,
  form: FormData,
): Promise<CreateGuideFormState> {
  const profile = await currentProfile();
  if (!profile) return { error: "Not signed in." };

  const title = strField(form, "title");
  // The type field is no longer surfaced in the create form — it's kept in
  // the schema for future trip/city-specific behavior. Seeds and any code
  // path that supplies an explicit type still work.
  const submittedType = strField(form, "type");
  const type = VALID_TYPES.has(submittedType) ? submittedType : DEFAULT_TYPE;
  const scope = strField(form, "scope") || null;
  const intro = strField(form, "intro") || null;
  const color = strField(form, "color") || "#C17C4E";

  const fieldErrors: NonNullable<CreateGuideFormState["fieldErrors"]> = {};
  if (!title) fieldErrors.title = "Give your guide a title.";
  if (Object.keys(fieldErrors).length > 0) return { error: null, fieldErrors };

  const supabase = await createClient();
  const base = baseSlug(profile.display_name, title);

  // Retry on slug collision. PostgreSQL raises code 23505 on the unique
  // constraint; we catch it specifically and try the next suffix.
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const slug = withSuffix(base, attempt);
    const insert: GuideInsert = {
      author_id: profile.id,
      title,
      type,
      scope,
      intro,
      color,
      slug,
    };
    const { data, error } = await supabase
      .from("guides")
      .insert(insert)
      .select("slug")
      .single();

    if (!error && data) {
      revalidatePath("/home/guides");
      revalidatePath("/home");
      redirect(`/guides/${data.slug}`);
    }
    if (error?.code !== "23505") {
      return { error: error?.message ?? "Could not create guide." };
    }
  }

  return {
    error: "Couldn't find a free URL slug after many tries — try a different title.",
  };
}

export async function deleteGuide(guideId: string): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("guides")
    .delete()
    .eq("id", guideId)
    .eq("author_id", profile.id);
  if (error) throw error;

  revalidatePath("/home/guides");
  revalidatePath("/home");
  redirect("/home/guides");
}

export async function setGuidePublic(
  guideId: string,
  isPublic: boolean,
): Promise<void> {
  const profile = await currentProfile();
  if (!profile) throw new Error("Not signed in.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .update({ is_public: isPublic })
    .eq("id", guideId)
    .eq("author_id", profile.id)
    .select("slug")
    .single();
  if (error) throw error;

  revalidatePath(`/guides/${data.slug}`);
  revalidatePath(`/g/${data.slug}`);
  revalidatePath("/home/guides");
}

