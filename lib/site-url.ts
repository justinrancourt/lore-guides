// Resolves the canonical site URL — used to build magic-link callback
// URLs and copy-to-clipboard share links.
//
// Reads NEXT_PUBLIC_SITE_URL when set (which it always is on Vercel
// production / preview deployments). Falls back to the request's
// forwarded-host headers in dev so localhost works without
// configuration.
//
// We deliberately avoid trusting `x-forwarded-host` in production
// even when NEXT_PUBLIC_SITE_URL is unset — a misconfigured proxy +
// a request with `Host: evil.com` would otherwise leak attacker URLs
// into the copy-link button.

import { headers } from "next/headers";

export async function siteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3001";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
