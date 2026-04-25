import Link from "next/link";
import { Logo } from "@/components/primitives/Logo";
import { LoginForm } from "./LoginForm";

interface PageProps {
  searchParams: Promise<{ sent?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { sent, next } = await searchParams;
  return (
    <div className="device-column items-center justify-center px-5 py-10 text-center">
      <Logo size={16} />
      {sent ? (
        <>
          <h1 className="m-0 mt-10 font-serif text-title text-ink">
            Check your inbox.
          </h1>
          <p className="m-0 mt-3 max-w-intro font-serif italic text-[14px] leading-[1.6] text-ink-muted">
            We sent a magic link to{" "}
            <span className="not-italic text-ink">{sent}</span>. Open it on this
            device and you&rsquo;ll be signed in.
          </p>
        </>
      ) : (
        <>
          <h1 className="m-0 mt-10 font-serif text-title text-ink">
            Sign in to your guides.
          </h1>
          <p className="m-0 mt-3 max-w-intro font-serif italic text-[14px] leading-[1.6] text-ink-muted">
            We&rsquo;ll email you a one-time link. No passwords.
          </p>
          <LoginForm next={next} />
          <p className="m-0 mt-8 font-serif italic text-[13px] text-faint">
            New here?{" "}
            <Link
              href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="not-italic text-accent"
            >
              Create an account
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
