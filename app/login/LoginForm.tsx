"use client";

import { useActionState } from "react";
import { sendLoginLink, type AuthFormState } from "./actions";

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    sendLoginLink,
    { error: null },
  );

  return (
    <form action={action} className="mt-7 flex w-full max-w-[300px] flex-col gap-3">
      {next && <input type="hidden" name="next" value={next} />}
      <input
        type="email"
        name="email"
        required
        autoFocus
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
