"use client";

import { useActionState } from "react";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";
import { toggleSaveGuide, type SaveGuideFormState } from "@/lib/actions/saved-guides";

interface SaveGuideButtonProps {
  slug: string;
  initiallySaved: boolean;
}

// Lives below the Cover in the recipient view. Three states:
//   * Unauthenticated → "Save guide" button; click redirects to signup
//     with `next` set so the user lands back here
//   * Authenticated, not yet saved → "Save guide", click toggles on
//   * Authenticated, already saved → "Saved", click toggles off
//
// The redirect for unauthenticated users happens server-side inside the
// action (it throws via `redirect()` rather than returning state).
export function SaveGuideButton({ slug, initiallySaved }: SaveGuideButtonProps) {
  const action = toggleSaveGuide.bind(null, slug);
  const [state, dispatch, pending] = useActionState<SaveGuideFormState, FormData>(
    action,
    { error: null, saved: initiallySaved },
  );

  // The action returns `saved` on success; fall back to the initial
  // value before the first roundtrip.
  const saved = state.saved ?? initiallySaved;

  return (
    <form action={dispatch} className="px-5 pb-3 pt-1 sm:px-8">
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "flex w-full items-center justify-center gap-2 border py-2.5 font-serif text-[12px] uppercase transition-colors disabled:opacity-50",
          saved
            ? "border-accent bg-accent text-on-accent"
            : "border-ink bg-ink text-bg",
        )}
        style={{ letterSpacing: "0.14em" }}
      >
        <Icon
          path={IconPath.bookmark}
          size={12}
          color="currentColor"
          fill={saved ? "currentColor" : "none"}
        />
        {pending ? "Saving…" : saved ? "Saved to your guides" : "Save guide"}
      </button>
      {state.error && (
        <p className="m-0 mt-2 text-center font-serif italic text-[12px] text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
