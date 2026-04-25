"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

// Use only inside Client Components and browser-only code paths
// (e.g. file uploads to Storage). Reads from the browser cookie store.
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
