"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { PLACE_TYPES, type PlaceType } from "@/lib/types";
import { quickCapture, type SavePlaceFormState } from "@/lib/actions/places";

interface CaptureSheetProps {
  open: boolean;
  onClose: () => void;
}

// State resets implicitly: when `open` is false we render nothing, so the
// next time the sheet opens the component re-mounts with fresh useState
// defaults. No effect needed for reset.
export function CaptureSheet({ open, onClose }: CaptureSheetProps) {
  if (!open) return null;
  return <CaptureSheetBody onClose={onClose} />;
}

function CaptureSheetBody({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<PlaceType | null>(null);
  const submittedRef = useRef(false);

  const [state, action, pending] = useActionState<SavePlaceFormState, FormData>(
    quickCapture,
    { error: null },
  );

  // Auto-close after a successful submit (state stops pending and has no
  // error). The submittedRef gate avoids closing on the initial render.
  useEffect(() => {
    if (submittedRef.current && !pending && state.error === null) {
      onClose();
    }
  }, [pending, state, onClose]);

  const handleAction = (fd: FormData) => {
    submittedRef.current = true;
    action(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <button
        type="button"
        aria-label="Close capture sheet"
        onClick={onClose}
        className="flex-1 border-0 bg-[rgba(30,25,20,0.38)]"
      />
      <form
        action={handleAction}
        className="bg-bg shadow-peek max-h-[85%] overflow-y-auto"
      >
        {type && <input type="hidden" name="type" value={type} />}
        <div className="mx-auto mb-2 mt-3 h-1 w-9 rounded-pill bg-border-bold" />
        <div className="flex items-center justify-between px-5 pb-3 pt-1.5">
          <h2 className="m-0 font-serif text-[18px] text-ink">
            Capture a place
          </h2>
          <button
            type="submit"
            disabled={pending}
            className="font-serif text-[12px] uppercase text-accent disabled:opacity-50"
            style={{ letterSpacing: "0.14em" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="border-t border-border px-5 py-3">
          <p
            className="m-0 mb-1.5 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            What did you find?
          </p>
          <input
            type="text"
            name="name"
            required
            autoFocus
            placeholder="The Anchor"
            className="block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-[16px] text-ink outline-none focus:border-ink"
          />
          <input
            type="text"
            name="neighborhood"
            placeholder="Where? (optional)"
            className="mt-3 block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif italic text-[13px] text-faint outline-none focus:border-ink"
          />
        </div>

        <div className="px-5 py-3">
          <p
            className="m-0 mb-1.5 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            A note to your future self
          </p>
          <NoteTextarea
            name="note"
            placeholder="Why does this stick with you?"
            minHeight={84}
          />
        </div>

        <div className="px-5 pb-4">
          <p
            className="m-0 mb-1.5 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            Type
          </p>
          <ChipSelect value={type} onChange={setType} options={PLACE_TYPES} />
        </div>

        {state.error && (
          <p className="m-0 px-5 pb-4 font-serif italic text-[13px] text-accent">
            {state.error}
          </p>
        )}

        <p className="border-t border-border px-5 py-4 font-serif italic text-[12px] text-faint">
          Saves to My Places. File it in a guide later.
        </p>
      </form>
    </div>
  );
}
