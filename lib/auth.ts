import { cache } from "react";
import { createClient } from "./supabase/server";
import type { Database } from "./db.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Returns the verified Supabase user + their profile row, or null if
// not signed in.
//
// Wrapped in React.cache so multiple Server Components in the same
// render share one resolution — without this, AuthorShell + page +
// any nested component each fired their own getClaims() + DB query,
// trivially blowing past Supabase's per-IP auth rate limit.
//
// getClaims() validates the JWT locally (or via JWKS) — no per-call
// network roundtrip to Auth. The DB profile fetch still runs once.
export const currentProfile = cache(async function currentProfile(): Promise<
  Profile | null
> {
  const supabase = await createClient();
  const { data: claimsResult } = await supabase.auth.getClaims();
  const userId = claimsResult?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return profile;
});
