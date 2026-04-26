"use client";

import { Children, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";
import { WaymarkBreathe } from "./WaymarkBreathe";

interface ContentLoaderProps {
  /** When true, render the centered Waymark Breathe instead of children. */
  loading: boolean;
  /** Optional title rendered below the Waymark in serif ink — when the
   *  navigation has surfaced a title before the data resolves. */
  title?: string;
  /** When `stagger` is true, the first 8 direct children of `children`
   *  fade in with the spec's 40ms stagger; the rest appear immediately. */
  stagger?: boolean;
  children: ReactNode;
}

const STAGGER_LIMIT = 8;
const STAGGER_STEP_MS = 40;

// Per brand book §8.3 Layer 4: Waymark Breathe shows when data takes
// >300ms to resolve. On resolve, Breathe fades out (200ms), content
// fades up with translateY(8px) → 0 over 300ms. Lists stagger by 40ms
// up to 8 items. Animations are CSS — see app/animations.css.
export function ContentLoader({
  loading,
  title,
  stagger = false,
  children,
}: ContentLoaderProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-5 py-16 text-center">
        <WaymarkBreathe size={40} color="#2D2A26" />
        {title && (
          <p className="m-0 font-serif text-[15px] text-ink">{title}</p>
        )}
      </div>
    );
  }

  if (!stagger) {
    return <div className="content-enter">{children}</div>;
  }

  // Apply per-child enter delay via inline CSS variable. Falls through
  // to no-op for non-element children (text nodes, fragments).
  return (
    <>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const delay =
          i < STAGGER_LIMIT ? `${i * STAGGER_STEP_MS}ms` : "0ms";
        const el = child as ReactElement<{
          className?: string;
          style?: React.CSSProperties;
        }>;
        return cloneElement(el, {
          className: `${el.props.className ?? ""} content-enter`.trim(),
          style: {
            ...(el.props.style ?? {}),
            ["--enter-delay" as string]: delay,
          },
        });
      })}
    </>
  );
}
