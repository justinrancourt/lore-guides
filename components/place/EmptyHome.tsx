"use client";

import Link from "next/link";
import { Waymark } from "@/components/primitives/Waymark";
import { useCapture } from "@/components/capture/CaptureProvider";

export function EmptyHome() {
  const { open } = useCapture();
  return (
    <div className="flex flex-col items-center px-5 pt-20 text-center">
      <Waymark size={28} color="#C0B8B0" />
      <h1 className="m-0 mt-5 font-serif text-title text-ink">
        Nothing here yet — that&rsquo;s fine.
      </h1>
      <p className="m-0 mt-3 max-w-intro font-serif italic text-[14px] leading-[1.6] text-ink-muted">
        Save a place you love. Once you have a few, file them into a guide
        you can share with friends.
      </p>
      <button
        type="button"
        onClick={open}
        className="mt-7 block w-full max-w-[260px] bg-ink py-3 font-serif text-[12px] uppercase text-bg"
        style={{ letterSpacing: "0.14em" }}
      >
        Save a place
      </button>
      <Link
        href="/guides/new"
        className="mt-3 block w-full max-w-[260px] border border-border bg-transparent py-3 font-serif text-[12px] uppercase text-ink-muted"
        style={{ letterSpacing: "0.14em" }}
      >
        Start a guide
      </Link>
    </div>
  );
}
