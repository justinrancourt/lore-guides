"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CaptureSheet } from "./CaptureSheet";

interface CaptureContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const CaptureContext = createContext<CaptureContextValue | null>(null);

export function CaptureProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <CaptureContext.Provider value={{ open, close, isOpen }}>
      {children}
      <CaptureSheet open={isOpen} onClose={close} />
    </CaptureContext.Provider>
  );
}

export function useCapture(): CaptureContextValue {
  const ctx = useContext(CaptureContext);
  if (!ctx) {
    throw new Error("useCapture must be used within a CaptureProvider");
  }
  return ctx;
}
