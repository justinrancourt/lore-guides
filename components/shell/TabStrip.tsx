"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { label: "My places", href: "/home" },
  { label: "Guides", href: "/home/guides" },
  { label: "Shared", href: "/home/shared" },
] as const;

export function TabStrip() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-7 border-b border-border px-5 sm:px-8">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "py-3.5 font-serif text-[13px] uppercase",
              active
                ? "border-b border-ink text-ink"
                : "border-b border-transparent text-faint",
            )}
            style={{ letterSpacing: "0.14em" }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
