// Next.js 16 renamed Middleware to Proxy. Runs before every navigation.
// Two responsibilities here:
//   1. Refresh the Supabase session cookie if it expired
//   2. Redirect unauthenticated users away from authed routes (and
//      authenticated users away from /login + /signup)

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/db.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

// Routes that don't require an account.
const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);
const PUBLIC_PREFIXES = ["/g/", "/auth/"];

function isPublic(path: string): boolean {
  if (PUBLIC_PATHS.has(path)) return true;
  return PUBLIC_PREFIXES.some((p) => path.startsWith(p));
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getClaims() validates the JWT locally (or via the project's JWKS
  // endpoint) — no per-request network call to the Auth server, which
  // matters because the proxy runs on every navigation. The presence
  // of valid claims is sufficient for the gating decision; routes that
  // need a fresh user record call getUser() themselves.
  const { data } = await supabase.auth.getClaims();
  const isAuthed = data?.claims?.sub != null;

  const path = request.nextUrl.pathname;

  if (!isAuthed && !isPublic(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isAuthed && (path === "/login" || path === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
