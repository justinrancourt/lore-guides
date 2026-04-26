// Read helpers for the `guides` table. Server-only — uses the SSR client.

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db.types";
import { signStoragePaths } from "./storage";

export type GuideRow = Database["public"]["Tables"]["guides"]["Row"];

export interface GuideWithCount extends GuideRow {
  place_count: number;
  // Cover image auto-derived from the first place in the guide that has
  // a photo. null when nothing is uploaded — callers fall back to color.
  cover_url: string | null;
}

export async function listGuidesForUser(
  userId: string,
): Promise<GuideWithCount[]> {
  const supabase = await createClient();

  // Pull guides + their guide_places + each linked place's photos in one
  // query. Post-process to find the first photo of the first place per
  // guide, then batch-sign all those storage paths together.
  const { data: rows, error } = await supabase
    .from("guides")
    .select(
      "*, guide_places(sort_order, places(place_photos(storage_path, sort_order)))",
    )
    .eq("author_id", userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const enriched = (rows ?? []).map(({ guide_places, ...g }) => {
    const sortedLinks = (guide_places ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order);
    let coverPath: string | undefined;
    for (const link of sortedLinks) {
      const photos = link.places?.place_photos ?? [];
      const cover = photos
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)[0];
      if (cover?.storage_path) {
        coverPath = cover.storage_path;
        break;
      }
    }
    return {
      ...g,
      place_count: sortedLinks.length,
      _coverPath: coverPath,
    };
  });

  const urlByPath = await signStoragePaths(
    supabase,
    enriched
      .map((e) => e._coverPath)
      .filter((p): p is string => Boolean(p)),
  );

  return enriched.map(({ _coverPath, ...g }) => ({
    ...g,
    cover_url: _coverPath ? (urlByPath.get(_coverPath) ?? null) : null,
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
