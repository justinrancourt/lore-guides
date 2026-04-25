// Surfaced textarea for personal notes (capture sheet, add-place, edit-place).
// Italic by default — these are the "voice" fields, not generic data entry.

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface NoteTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
}

export const NoteTextarea = forwardRef<HTMLTextAreaElement, NoteTextareaProps>(
  function NoteTextarea({ minHeight = 110, className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        style={{ minHeight }}
        className={cn(
          "block w-full resize-none border border-border-bold bg-surface px-3 py-2.5 font-serif italic text-[14px] leading-[1.65] text-ink outline-none placeholder:text-faint focus:border-ink",
          className,
        )}
        {...rest}
      />
    );
  },
);
