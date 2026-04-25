import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/db.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

// For Server Components, Route Handlers, and Server Actions. The proxy
// refreshes sessions on every navigation, so the read-only cookie store
// inside RSC is fine here — `setAll` would be a no-op in that context
// and we silently swallow the resulting error per Next 16 conventions.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot mutate cookies. The proxy is the
          // authoritative refresher, so this is safe to ignore here.
        }
      },
    },
  });
}
