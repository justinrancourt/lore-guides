"use client";

import { useState, useTransition } from "react";
import { setGuidePublic } from "@/lib/actions/guides";
import { Toggle } from "@/components/primitives/Toggle";
import { Icon, IconPath } from "@/components/primitives/Icon";

interface PublishControlProps {
  guideId: string;
  isPublic: boolean;
  publicUrl: string;
}

// Sits below the place list on the author's guide view. Toggling
// public revalidates /g/[slug] so the recipient view starts (or stops)
// resolving immediately.
export function PublishControl({
  guideId,
  isPublic: initialPublic,
  publicUrl,
}: PublishControlProps) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleToggle = (next: boolean) => {
    setIsPublic(next);
    startTransition(async () => {
      try {
        await setGuidePublic(guideId, next);
      } catch {
        setIsPublic(!next); // revert on failure
      }
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-5 mb-3 mt-2 border border-border bg-surface px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 font-serif text-[14px] text-ink">
            {isPublic ? "Public" : "Private"}
          </p>
          <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
            {isPublic
              ? "Anyone with the link can view this guide."
              : "Only you can see this guide."}
            {pending && <span className="ml-1 text-accent">· Saving…</span>}
          </p>
        </div>
        <Toggle enabled={isPublic} onChange={handleToggle} label="Public" />
      </div>
      {isPublic && (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 flex w-full items-center justify-between border border-border-bold bg-bg px-3 py-2 text-left"
        >
          <span className="min-w-0 truncate font-serif text-[12px] text-ink-muted">
            {publicUrl.replace(/^https?:\/\//, "")}
          </span>
          <span
            className="ml-3 flex shrink-0 items-center gap-1 font-serif text-[10px] uppercase text-accent"
            style={{ letterSpacing: "0.14em" }}
          >
            {copied ? (
              <>
                <Icon path={IconPath.check} size={11} color="#C17C4E" />
                Copied
              </>
            ) : (
              "Copy link"
            )}
          </span>
        </button>
      )}
    </div>
  );
}
