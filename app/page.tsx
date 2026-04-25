import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/primitives/Logo";
import { Waymark } from "@/components/primitives/Waymark";
import { currentProfile } from "@/lib/auth";

export default async function Index() {
  const profile = await currentProfile();
  if (profile) redirect("/home");

  return (
    <div className="device-column items-center justify-center px-5 py-10 text-center">
      <Logo size={18} />
      <div className="mt-12">
        <Waymark size={28} color="#C17C4E" />
      </div>
      <h1 className="m-0 mt-5 font-serif text-cover leading-[1.05] text-ink">
        Save the places you love.
      </h1>
      <p className="m-0 mt-5 max-w-intro font-serif italic text-[15px] leading-[1.7] text-ink-muted">
        Collect them into guides. Share with friends. The places you remember
        are the places worth keeping.
      </p>
      <Link
        href="/signup"
        className="mt-8 block w-full max-w-[280px] bg-ink py-3 font-serif text-[12px] uppercase text-bg"
        style={{ letterSpacing: "0.14em" }}
      >
        Get started
      </Link>
      <Link
        href="/login"
        className="mt-3 block font-serif italic text-[14px] text-ink-muted"
      >
        Already have an account? <span className="not-italic text-accent">Sign in</span>
      </Link>
    </div>
  );
}
