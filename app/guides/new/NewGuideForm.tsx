"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/cn";
import { BorderlessInput } from "@/components/primitives/BorderlessInput";
import { createGuide, type CreateGuideFormState } from "@/lib/actions/guides";

const PALETTE = [
  "#C17C4E", "#7A8B5E", "#4A6B8B", "#6B4E3D",
  "#8B4E6B", "#C8A05C", "#5C6B8B", "#A68B6B",
];

export function NewGuideForm() {
  const [color, setColor] = useState(PALETTE[0]);
  const [state, action, pending] = useActionState<CreateGuideFormState, FormData>(
    createGuide,
    { error: null },
  );

  return (
    <form action={action} className="flex flex-col gap-7 px-5 pb-24 pt-7">
      <input type="hidden" name="color" value={color} />

      <div>
        <p
          className="m-0 mb-2 font-serif text-[11px] uppercase text-accent"
          style={{ letterSpacing: "0.18em" }}
        >
          A guide to
        </p>
        <BorderlessInput
          variant="title"
          name="title"
          required
          autoFocus
          placeholder="Valencia, Best bars, Spring 2024…"
        />
        <p className="m-0 mt-1.5 font-serif italic text-[12px] text-faint">
          A few words. Don&rsquo;t overthink the title.
        </p>
        {state.fieldErrors?.title && (
          <p className="m-0 mt-2 font-serif italic text-[13px] text-accent">
            {state.fieldErrors.title}
          </p>
        )}
      </div>

      <Field label="Scope · optional">
        <BorderlessInput
          name="scope"
          placeholder="A city, a region, a feeling"
        />
      </Field>

      <Field label="Why this guide · optional">
        <textarea
          name="intro"
          placeholder="What's the soul of this guide?"
          className="block w-full resize-none border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif italic text-[15px] leading-[1.6] text-ink-muted outline-none focus:border-ink"
          rows={3}
        />
      </Field>

      <Field label="Cover color">
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "h-8 w-8 rounded-circle border",
                color === c ? "border-ink" : "border-transparent",
              )}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </Field>

      {state.error && (
        <p className="m-0 font-serif italic text-[13px] text-accent">
          {state.error}
        </p>
      )}

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-bg px-5 pb-5 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="block w-full bg-ink py-3 font-serif text-[12px] uppercase text-bg disabled:opacity-50"
          style={{ letterSpacing: "0.14em" }}
        >
          {pending ? "Creating…" : "Create guide"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block font-serif text-[11px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
