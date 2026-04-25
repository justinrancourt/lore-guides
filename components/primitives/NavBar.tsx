import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface NavBarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  sticky?: boolean;
  /** Tailwind background utility, e.g. "bg-bg" or "bg-surface". */
  bg?: string;
}

export function NavBar({
  left,
  center,
  right,
  sticky,
  bg = "bg-bg",
}: NavBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border px-5 py-3 z-20",
        bg,
        sticky && "sticky top-0",
      )}
    >
      <div className="flex min-w-[60px] items-center">{left}</div>
      <div>{center}</div>
      <div className="flex min-w-[60px] items-center justify-end">{right}</div>
    </div>
  );
}
