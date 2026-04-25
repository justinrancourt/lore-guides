import Link from "next/link";
import { Logo } from "@/components/primitives/Logo";
import { Icon, IconPath } from "@/components/primitives/Icon";

interface RecipientNavProps {
  /** Slug of the guide this nav lives in. Used to wire "I'm here" to
   *  /g/[slug]/guide (the V2 tour-guide route, which currently shows a
   *  "Coming soon" stub). */
  slug: string;
  /** Mode determines the nav's anchor element. "landing" shows guide
   *  metadata + "I'm here" CTA; "place" shows a back-to-guide link
   *  instead, matching the spec mockup. */
  mode?: "landing" | "place";
  /** Subtle right-side metadata for desktop only. Hidden under sm. */
  metadata?: string;
}

// Sticky top bar shared across the recipient routes. Anti-spec: the
// "I'm here" button is rendered live (option 1b) and routes to the
// V2 tour-guide-mode stub at /g/[slug]/guide. Only swap the stub when
// Tour Guide Mode actually ships.
export function RecipientNav({
  slug,
  mode = "landing",
  metadata,
}: RecipientNavProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg px-5 py-3 sm:px-8">
      <div className="flex min-w-0 items-center gap-4">
        {mode === "place" ? (
          <Link
            href={`/g/${slug}`}
            className="flex items-center gap-1 font-serif text-[13px] text-faint"
          >
            <Icon path={IconPath.chevLeft} size={14} color="currentColor" />
            Back to guide
          </Link>
        ) : (
          <Logo href="/" size={13} />
        )}
      </div>

      {mode === "landing" && (
        <>
          {metadata && (
            <span className="hidden font-serif italic text-[12px] text-faint lg:inline">
              {metadata}
            </span>
          )}
          <Link
            href={`/g/${slug}/guide`}
            className="inline-flex items-center gap-1.5 bg-accent px-4 py-2 font-serif text-[11px] uppercase text-on-accent"
            style={{ letterSpacing: "0.08em" }}
          >
            <Icon path={IconPath.mapPin} size={11} color="currentColor" />
            I&rsquo;m here
          </Link>
        </>
      )}

      {mode === "place" && (
        <Logo href="/" size={13} />
      )}

      {/* Spacer keeps the place-nav title centered when there's no right action. */}
      {mode === "place" && <span className="w-[100px]" aria-hidden />}
    </header>
  );
}
