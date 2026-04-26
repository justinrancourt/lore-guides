// Shared storage helpers. The bucket name + URL TTL live here so the
// per-table read helpers don't redefine them and so the URL-signing
// dance is one function, not three.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db.types";

export const PHOTO_BUCKET = "place-photos";
export const PHOTO_URL_TTL_SECONDS = 60 * 60; // 1 hour

// Sign a batch of storage paths in a single round trip and return a
// Map<path, signedUrl> for caller-side lookup. Empty input → empty map
// (no API call).
export async function signStoragePaths(
  supabase: SupabaseClient<Database>,
  paths: string[],
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(paths, PHOTO_URL_TTL_SECONDS);
  if (error) throw error;
  return new Map(
    (data ?? []).flatMap((s) =>
      s.signedUrl && s.path ? [[s.path, s.signedUrl] as const] : [],
    ),
  );
}
