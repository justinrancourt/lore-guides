// Centralizes the Supabase env-var lookups so the failure mode (missing
// env vars in dev) is one informative error, not three confusing ones.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL || !ANON) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.local.example to .env.local and " +
      "fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const SUPABASE_URL: string = URL;
export const SUPABASE_ANON_KEY: string = ANON;
