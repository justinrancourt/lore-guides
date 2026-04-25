import { createClient } from "./supabase/server";
import type { Database } from "./db.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Returns the verified Supabase user + their profile row, or null if not
// signed in. The proxy already gates protected routes, so most callers can
// assume non-null and assert it; a few (e.g. the optional account banner
// on the public landing page) need the null path.
export async function currentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
