import Link from "next/link";
import { Waymark } from "@/components/primitives/Waymark";

export default function NotFound() {
  return (
    <div className="device-column items-center justify-center px-5 text-center">
      <Waymark size={28} color="#9C8E7C" />
      <h1 className="m-0 mt-5 font-serif text-title text-ink">
        That guide doesn&rsquo;t exist.
      </h1>
      <p className="m-0 mt-3 font-serif italic text-[14px] text-ink-muted">
        The link may be wrong, or the author may have made it private.
      </p>
      <Link
        href="/"
        className="mt-7 border border-border px-4 py-2 font-serif text-[12px] uppercase text-ink-muted"
        style={{ letterSpacing: "0.14em" }}
      >
        Back to start
      </Link>
    </div>
  );
}
