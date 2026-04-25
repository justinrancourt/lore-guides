"use client";

import { useState } from "react";
import type { GuideType } from "@/lib/types";
import { BorderlessInput } from "@/components/primitives/BorderlessInput";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

const PALETTE = [
  "#C17C4E", // terracotta
  "#7A8B5E", // sage
  "#4A6B8B", // navy
  "#6B4E3D", // espresso
  "#8B4E6B", // plum
  "#C8A05C", // amber
  "#5C6B8B", // dusty blue
  "#A68B6B", // sand
];

const PROMPTS: Record<GuideType, string> = {
  city: "A guide to",
  region: "A region called",
  trip: "Trip to",
  theme: "A guide to",
};

interface NewGuideFormProps {
  type: GuideType;
}

export function NewGuideForm({ type }: NewGuideFormProps) {
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("");
  const [intro, setIntro] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  return (
    <form className="flex flex-col gap-7 px-5 pb-24 pt-7">
      <div>
        <p
          className="m-0 mb-2 font-serif text-[11px] uppercase text-accent"
          style={{ letterSpacing: "0.18em" }}
        >
          {PROMPTS[type]}
        </p>
        <BorderlessInput
          variant="title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Valencia"
        />
        <p className="m-0 mt-1.5 font-serif italic text-[12px] text-faint">
          A few words. Don&rsquo;t overthink the title.
        </p>
      </div>

      <Field label={type === "trip" ? "When" : "Scope · optional"}>
        <BorderlessInput
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder={
            type === "trip" ? "Spring 2024" : "Spain, Worldwide, etc."
          }
        />
      </Field>

      <Field label="Why this guide">
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
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

      <div className="border-l-[3px] border-banner-icon bg-banner-bg px-3.5 py-2.5">
        <p className="m-0 flex items-start gap-2 font-serif italic text-[13px] text-ink-muted">
          <Icon path={IconPath.info} size={14} color="#A67A3E" />
          {type === "theme"
            ? "Themes can span any city or region — your places carry their own location."
            : "Once you create a guide, you can add places to it from anywhere."}
        </p>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-bg px-5 pb-5 pt-4">
        <button
          type="button"
          disabled={!title}
          className={cn(
            "block w-full bg-ink py-3 font-serif text-[12px] uppercase text-bg",
            !title && "opacity-40",
          )}
          style={{ letterSpacing: "0.14em" }}
        >
          Create guide
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
