// Read helpers for the saved_guides join. "Shared with me" in the
// author sidebar reads from here; the recipient's "Save guide" button
// state on /g/[slug] also reads from here to know whether to render
// "Save" or "Saved".

import { createClient } from "@/lib/supabase/server";
import type { GuideRow } from "./guides";

export interface SavedGuide extends GuideRow {
  saved_at: string;
  // Display name of the guide's author (so "from Sarah" works in the
  // sidebar without a second query per row).
  author_name: string;
}

export async function listSavedGuidesForUser(
  userId: string,
): Promise<SavedGuide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_guides")
    .select(
      "saved_at, guides(*, profiles!guides_author_id_fkey(display_name))",
    )
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });
  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const g = row.guides;
      if (!g) return null;
      const { profiles, ...rest } = g;
      return {
        ...rest,
        saved_at: row.saved_at,
        author_name: profiles?.display_name ?? "Anonymous",
      };
    })
    .filter((row): row is SavedGuide => row !== null);
}

export async function isGuideSavedByUser(
  userId: string,
  guideId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_guides")
    .select("id")
    .eq("user_id", userId)
    .eq("guide_id", guideId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
