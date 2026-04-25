"use client";

import { useState, useTransition } from "react";
import { seedValencia } from "@/lib/actions/seed";

// Renders only when ALLOW_DEV_SEED is true on the server. Lets the
// signed-in dev quickly get a real public Valencia guide under their
// account, useful for kicking the tires on /g/[slug] without typing
// out 7 places by hand.
export function SeedValenciaButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const onClick = () => {
    setResult(null);
    startTransition(async () => {
      setResult(await seedValencia());
    });
  };

  return (
    <div className="mx-5 mt-4 border border-dashed border-border-bold bg-surface px-4 py-3 text-center">
      <p
        className="m-0 mb-2 font-serif text-[10px] uppercase text-faint"
        style={{ letterSpacing: "0.18em" }}
      >
        Dev tools
      </p>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="font-serif text-[12px] uppercase text-accent disabled:opacity-50"
        style={{ letterSpacing: "0.14em" }}
      >
        {pending ? "Seeding…" : "Seed Valencia guide"}
      </button>
      {result && (
        <p
          className={`m-0 mt-2 font-serif italic text-[12px] ${result.ok ? "text-ink-muted" : "text-accent"}`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
