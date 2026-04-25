import Link from "next/link";
import { Logo } from "@/components/primitives/Logo";
import { currentProfile } from "@/lib/auth";

const DEMO_LINKS: { href: string; label: string; note: string }[] = [
  { href: "/home", label: "/home", note: "My Places (default tab)" },
  { href: "/home/guides", label: "/home/guides", note: "Guides tab" },
  { href: "/home/shared", label: "/home/shared", note: "Shared tab (empty state)" },
  {
    href: "/guides/justin-valencia",
    label: "/guides/justin-valencia",
    note: "Author guide view (Flow 6)",
  },
  {
    href: "/g/justin-valencia",
    label: "/g/justin-valencia",
    note: "Recipient view (public, no auth)",
  },
  { href: "/places/place-3", label: "/places/place-3", note: "Place detail" },
  { href: "/guides/new", label: "/guides/new", note: "New guide — type picker" },
  {
    href: "/guides/new/theme",
    label: "/guides/new/theme",
    note: "New guide — details (theme variant)",
  },
  {
    href: "/guides/justin-valencia/add",
    label: "/guides/justin-valencia/add",
    note: "Add a place to a guide",
  },
  {
    href: "/places/place-3/edit",
    label: "/places/place-3/edit",
    note: "Edit place form",
  },
];

export default async function Index() {
  const profile = await currentProfile();
  return (
    <div className="device-column px-5 py-8">
      <Logo size={18} />
      <div className="mt-6 flex items-baseline justify-between gap-3 border-b border-border pb-4">
        {profile ? (
          <>
            <p className="m-0 font-serif italic text-[14px] text-ink-muted">
              Signed in as{" "}
              <span className="not-italic text-ink">{profile.display_name}</span>
            </p>
            <Link
              href="/home"
              className="font-serif text-[12px] uppercase text-accent"
              style={{ letterSpacing: "0.14em" }}
            >
              Go to home →
            </Link>
          </>
        ) : (
          <>
            <p className="m-0 font-serif italic text-[14px] text-ink-muted">
              Not signed in.
            </p>
            <span className="flex gap-3">
              <Link
                href="/login"
                className="font-serif text-[12px] uppercase text-accent"
                style={{ letterSpacing: "0.14em" }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="font-serif text-[12px] uppercase text-ink-muted"
                style={{ letterSpacing: "0.14em" }}
              >
                Sign up
              </Link>
            </span>
          </>
        )}
      </div>
      <h1 className="m-0 mt-8 font-serif text-title text-ink">Demo screens</h1>
      <p className="m-0 mt-2 font-serif italic text-[14px] text-ink-muted">
        Each link renders a real screen. Most require an account — the
        recipient view at <span className="not-italic">/g/[slug]</span> is the
        only one open to anyone. Data still comes from the mock fixture
        until M3 swaps in real Supabase queries.
      </p>
      <ul className="mt-6 list-none p-0">
        {DEMO_LINKS.map((l) => (
          <li key={l.href} className="border-t border-border py-3.5">
            <Link href={l.href} className="block">
              <p
                className="m-0 font-serif text-[13px] uppercase text-accent"
                style={{ letterSpacing: "0.12em" }}
              >
                {l.label}
              </p>
              <p className="m-0 mt-0.5 font-serif italic text-[13px] text-ink-muted">
                {l.note}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
