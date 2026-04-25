"use client";

import { useState } from "react";
import { Icon, IconPath } from "./Icon";

interface TimeSensitiveFieldProps {
  /** Form input name. */
  name: string;
  /** Initial value (for edit). When non-empty, the field starts open. */
  defaultValue?: string;
}

// A quieter alternative to the always-visible toggle row. Renders as a
// small "+ Add specific timing" link until tapped, then expands an inline
// input. The hidden enabled flag is required because the action ignores
// the text field when "time_sensitive_enabled" is "false" — closing the
// field clears the value on save without losing what's typed.
export function TimeSensitiveField({
  name,
  defaultValue = "",
}: TimeSensitiveFieldProps) {
  const [open, setOpen] = useState(defaultValue.length > 0);
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <input
        type="hidden"
        name="time_sensitive_enabled"
        value={open ? "true" : "false"}
      />
      {open ? (
        <div>
          <div className="flex items-center justify-between gap-2">
            <span
              className="font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Specific timing
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-serif italic text-[12px] text-faint"
            >
              Clear
            </button>
          </div>
          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Best before 9am, opens at 7pm…"
            className="mt-1.5 block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-[14px] text-ink outline-none focus:border-ink"
            autoFocus
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 font-serif italic text-[13px] text-accent"
        >
          <Icon path={IconPath.plus} size={11} color="#C17C4E" />
          Add specific timing
        </button>
      )}
    </div>
  );
}
