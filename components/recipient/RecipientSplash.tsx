"use client";

import { useEffect, useState } from "react";
import { Waymark } from "@/components/primitives/Waymark";

// Brand book §3.1 + §8.3: the recipient landing is the only place where
// a Waymark one-shot animation flows into the content. The Waymark draws
// in (1.1s draw + dot pop), the wordmark fades up, the tagline follows,
// then the whole overlay fades out and the SSR'd guide content takes
// over. Total ~2.2s.
//
// We always play this on first paint of /g/[slug] for now. Sessions that
// re-visit the same guide will see it again; if that's annoying we can
// gate on sessionStorage later.

const TOTAL_MS = 2200;
const FADE_OUT_MS = 280;

export function RecipientSplash() {
  // mounted controls the overlay's presence; faded controls its opacity
  // for the exit transition.
  const [mounted, setMounted] = useState(true);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFaded(true), TOTAL_MS - FADE_OUT_MS);
    const remove = setTimeout(() => setMounted(false), TOTAL_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas transition-opacity duration-300 ease-default"
      style={{ opacity: faded ? 0 : 1 }}
    >
      <span className="waymark-draw inline-block">
        <Waymark size={56} color="#2D2A26" strokeWidth={1.6} />
      </span>
      <span
        className="mt-[18px] inline-block font-serif text-[22px] text-ink"
        style={{
          letterSpacing: "0.1em",
          opacity: 0,
          animation:
            "wordmark-fade-up 600ms cubic-bezier(0.4, 0, 0.2, 1) 900ms forwards",
        }}
      >
        Lore Guides
      </span>
      <span
        className="mt-2 inline-block font-serif italic text-[13px] text-faint"
        style={{
          opacity: 0,
          animation:
            "tagline-fade-up 600ms cubic-bezier(0.4, 0, 0.2, 1) 1300ms forwards",
        }}
      >
        Your places, your words.
      </span>
    </div>
  );
}
