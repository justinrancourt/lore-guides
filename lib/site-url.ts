// Resolves the canonical site URL — used to build magic-link callback
// URLs and copy-to-clipboard share links.
//
// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL env (production preference — set this on
//      Vercel for the prod scope to pin the production hostname).
//   2. VERCEL_URL runtime env (set automatically on every Vercel
//      deployment — covers preview URLs that change per push without
//      per-deploy config).
//   3. Request headers (dev fallback so localhost works without env).
//
// We deliberately don't trust `x-forwarded-host` in production. A
// misconfigured proxy + a `Host: evil.com` request would leak attacker
// URLs into magic-link emails and the copy-link button.

import { headers } from "next/headers";

export async function siteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  // Vercel sets VERCEL_URL on every deployment — no protocol; we add
  // https because Vercel always serves over TLS.
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3001";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
