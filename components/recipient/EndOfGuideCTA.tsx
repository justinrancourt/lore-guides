import Link from "next/link";
import { Waymark } from "@/components/primitives/Waymark";

interface EndOfGuideCTAProps {
  authorName: string;
  guideTitle: string;
}

export function EndOfGuideCTA({ authorName, guideTitle }: EndOfGuideCTAProps) {
  return (
    <section className="px-5 pb-12 pt-10 text-center sm:px-8">
      <div className="mx-auto mb-6 h-px w-8 bg-accent" />
      <p className="m-0 mb-7 font-serif italic text-[14px] text-ink-muted">
        That&rsquo;s all {authorName}&rsquo;s {guideTitle}.
      </p>
      <div className="border border-border bg-surface px-6 pb-7 pt-7 text-center">
        <div className="mx-auto mb-3 inline-block">
          <Waymark size={22} color="#C17C4E" />
        </div>
        <h2 className="m-0 mb-2 font-serif text-[22px] text-ink">
          Keep this guide
        </h2>
        <p className="m-0 mb-5 font-serif italic text-[14px] leading-[1.6] text-ink-muted">
          Save the places you love. Build a guide of your own.
        </p>
        <Link
          href="/signup"
          className="mb-2 block w-full bg-ink py-2.5 font-serif text-[12px] uppercase text-bg"
          style={{ letterSpacing: "0.14em" }}
        >
          Create account · save guide
        </Link>
        <Link
          href="/login"
          className="block w-full border border-border bg-transparent py-2.5 font-serif text-[12px] uppercase text-ink-muted"
          style={{ letterSpacing: "0.14em" }}
        >
          Sign in
        </Link>
      </div>
      <p className="m-0 mt-5 font-serif italic text-[12px] text-faint">
        Or simply bookmark this page — it&rsquo;ll always be here.
      </p>
    </section>
  );
}
