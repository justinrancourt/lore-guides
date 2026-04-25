"use client";

import { useState } from "react";
import { Icon, IconPath } from "@/components/primitives/Icon";

interface AccountMenuProps {
  name: string;
}

export function AccountMenu({ name }: AccountMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        <Icon path={IconPath.moreH} size={18} color="#9C8E7C" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30"
          />
          <div className="absolute right-0 top-full z-40 mt-2 w-56 border border-border bg-bg shadow-peek">
            <div className="border-b border-border-soft px-4 py-3">
              <p
                className="m-0 font-serif text-[10px] uppercase text-faint"
                style={{ letterSpacing: "0.18em" }}
              >
                Signed in
              </p>
              <p className="m-0 mt-0.5 font-serif text-[14px] text-ink">
                {name}
              </p>
            </div>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="block w-full px-4 py-3 text-left font-serif text-[13px] text-ink-muted hover:bg-surface"
              >
                Sign out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
