"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/home", label: "Places", icon: IconPath.mapPin },
  { href: "/home/guides", label: "Guides", icon: IconPath.bookmark },
  { href: "/home/shared", label: "Shared", icon: IconPath.share },
] as const;

// Mobile-only bottom navigation. Desktop uses the full sidebar where
// each guide is a direct nav item; on mobile the Guides tab routes to
// a list view since the sidebar isn't there to enumerate them.
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-bg lg:hidden">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 font-serif text-[10px] uppercase",
              active ? "text-ink" : "text-faint",
            )}
            style={{ letterSpacing: "0.14em" }}
          >
            <Icon
              path={tab.icon}
              size={16}
              color={active ? "#2D2A26" : "#9C8E7C"}
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
