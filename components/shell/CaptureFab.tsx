"use client";

import { Icon, IconPath } from "@/components/primitives/Icon";
import { useCapture } from "@/components/capture/CaptureProvider";

export function CaptureFab() {
  const { open } = useCapture();
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Capture a place"
      className="fixed bottom-6 right-5 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-circle bg-ink text-bg shadow-fab"
    >
      <Icon path={IconPath.plus} size={22} color="currentColor" />
    </button>
  );
}
