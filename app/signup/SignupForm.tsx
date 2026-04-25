"use client";

import { useActionState } from "react";
import { sendSignupLink, type AuthFormState } from "../login/actions";

interface SignupFormProps {
  next?: string;
}

export function SignupForm({ next }: SignupFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    sendSignupLink,
    { error: null },
  );

  return (
    <form action={action} className="mt-7 flex w-full max-w-[300px] flex-col gap-3">
      {next && <input type="hidden" name="next" value={next} />}
      <input
        type="text"
        name="display_name"
        required
        autoComplete="name"
        placeholder="Your name"
        className="block w-full border border-border-bold bg-surface px-3.5 py-3 text-center font-serif text-[15px] text-ink outline-none placeholder:text-faint focus:border-ink"
      />
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="block w-full border border-border-bold bg-surface px-3.5 py-3 text-center font-serif text-[15px] text-ink outline-none placeholder:text-faint focus:border-ink"
      />
      <button
        type="submit"
        disabled={pending}
        className="block w-full bg-ink py-3 font-serif text-[12px] uppercase text-bg disabled:opacity-50"
        style={{ letterSpacing: "0.14em" }}
      >
        {pending ? "Sending…" : "Send magic link"}
      </button>
      {state.error && (
        <p className="m-0 font-serif italic text-[13px] text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
