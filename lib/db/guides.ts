// Read helpers for the `guides` table. Server-only — uses the SSR client.

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db.types";

export type GuideRow = Database["public"]["Tables"]["guides"]["Row"];

export interface GuideWithCount extends GuideRow {
  place_count: number;
}

export async function listGuidesForUser(
  userId: string,
): Promise<GuideWithCount[]> {
  const supabase = await createClient();

  // Pull guides + a guide_places fan-out, then collapse client-side. Two
  // small queries beats a Postgres view for now.
  const { data: rows, error } = await supabase
    .from("guides")
    .select("*, guide_places(id)")
    .eq("author_id", userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (rows ?? []).map(({ guide_places, ...g }) => ({
    ...g,
    place_count: guide_places?.length ?? 0,
  }));
}

export async function guideBySlug(slug: string): Promise<GuideRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export interface PublicGuideWithAuthor extends GuideRow {
  author_name: string;
}

export async function publicGuideBySlug(
  slug: string,
): Promise<PublicGuideWithAuthor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .select("*, profiles!guides_author_id_fkey(display_name)")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { profiles, ...rest } = data;
  return { ...rest, author_name: profiles?.display_name ?? "Anonymous" };
}
