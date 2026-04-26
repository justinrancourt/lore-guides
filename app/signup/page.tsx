import Link from "next/link";
import { Logo } from "@/components/primitives/Logo";
import { SignupForm } from "./SignupForm";

interface PageProps {
  searchParams: Promise<{ sent?: string; next?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { sent, next } = await searchParams;
  return (
    <div className="form-column items-center justify-center px-5 py-10 text-center">
      <Logo size={16} />
      {sent ? (
        <>
          <h1 className="m-0 mt-10 font-serif text-title text-ink">
            Check your inbox.
          </h1>
          <p className="m-0 mt-3 max-w-intro font-serif italic text-[14px] leading-[1.6] text-ink-muted">
            We sent a magic link to{" "}
            <span className="not-italic text-ink">{sent}</span>. Open it on
            this device and your account will be ready.
          </p>
        </>
      ) : (
        <>
          <h1 className="m-0 mt-10 font-serif text-title text-ink">
            Start saving the places you love.
          </h1>
          <p className="m-0 mt-3 max-w-intro font-serif italic text-[14px] leading-[1.6] text-ink-muted">
            We&rsquo;ll email you a one-time link. No passwords, ever.
          </p>
          <SignupForm next={next} />
          <p className="m-0 mt-8 font-serif italic text-[13px] text-faint">
            Already here?{" "}
            <Link
              href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="not-italic text-accent"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
