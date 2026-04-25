"use client";

import { useState } from "react";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { PLACE_TYPES, type PlaceType } from "@/lib/types";

interface CaptureSheetProps {
  open: boolean;
  onClose: () => void;
}

// State resets implicitly: when `open` is false we render nothing, so the
// next time the sheet opens the component re-mounts with fresh useState
// defaults. No effect needed.
export function CaptureSheet({ open, onClose }: CaptureSheetProps) {
  if (!open) return null;
  return <CaptureSheetBody onClose={onClose} />;
}

function CaptureSheetBody({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<PlaceType | null>(null);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <button
        type="button"
        aria-label="Close capture sheet"
        onClick={onClose}
        className="flex-1 border-0 bg-[rgba(30,25,20,0.38)]"
      />
      <div className="bg-bg shadow-peek max-h-[85%] overflow-y-auto">
        <div className="mx-auto mb-2 mt-3 h-1 w-9 rounded-pill bg-border-bold" />
        <div className="flex items-center justify-between px-5 pb-3 pt-1.5">
          <h2 className="m-0 font-serif text-[18px] text-ink">
            Capture a place
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-serif text-[12px] uppercase text-accent"
            style={{ letterSpacing: "0.14em" }}
          >
            Save
          </button>
        </div>

        <div className="px-5 pb-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-faint">
            <Icon path={IconPath.mapPin} size={14} color="#9C8E7C" />
            <span className="font-serif italic text-[12px]">
              Detected from your current location
            </span>
          </div>
          <p className="m-0 mt-2 font-serif text-[15px] text-ink">
            The Anchor
          </p>
          <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
            Islamorada, FL · Drink
          </p>
        </div>

        <div className="px-5 py-4">
          <p
            className="m-0 mb-1.5 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            A note to your future self
          </p>
          <NoteTextarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Sunset dock bar. Key lime pie was surprisingly great."
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
          <ChipSelect
            value={type}
            onChange={setType}
            options={PLACE_TYPES}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <span className="font-serif text-[13px] text-ink-muted">
            Save to My Places
          </span>
          <span
            className="font-serif text-[12px] uppercase text-accent"
            style={{ letterSpacing: "0.14em" }}
          >
            File in guide →
          </span>
        </div>
      </div>
    </div>
  );
}
