"use client";

import { Icon, IconPath } from "@/components/primitives/Icon";
import { useCapture } from "@/components/capture/CaptureProvider";

// Anchored to the bottom of the centered max-w-md column rather than the
// raw viewport, so on desktop the FAB sits in the corner of the visible
// "device" rather than the far edge of the screen.
export function CaptureFab() {
  const { open } = useCapture();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30">
      <div className="mx-auto flex w-full max-w-[720px] justify-end px-5 sm:px-8">
        <button
          type="button"
          onClick={open}
          aria-label="Capture a place"
          className="pointer-events-auto flex h-[52px] w-[52px] items-center justify-center rounded-circle bg-ink text-bg shadow-fab"
        >
          <Icon path={IconPath.plus} size={22} color="currentColor" />
        </button>
      </div>
    </div>
  );
}
