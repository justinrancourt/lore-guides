import Link from "next/link";
import { Logo } from "@/components/primitives/Logo";

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

export default function Index() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-bg px-5 py-8">
      <Logo size={18} />
      <h1 className="m-0 mt-8 font-serif text-title text-ink">M1 demo screens</h1>
      <p className="m-0 mt-2 font-serif italic text-[14px] text-ink-muted">
        Each link renders a real screen against the Valencia mock data. No
        backend yet — auth, persistence, and the Google Places search arrive
        in M2 and M3.
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
