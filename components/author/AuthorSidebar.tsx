"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { Waymark } from "@/components/primitives/Waymark";
import type { GuideWithCount } from "@/lib/db/guides";
import type { SavedGuide } from "@/lib/db/saved-guides";
import { cn } from "@/lib/cn";

interface AuthorSidebarProps {
  guides: GuideWithCount[];
  sharedGuides: SavedGuide[];
  totalPlaces: number;
  profile: { display_name: string; avatar_url: string | null };
}

// The persistent left navigation for the author experience. Sticky-full-
// height on desktop. Hidden on mobile — the AuthorShell renders a
// bottom tab bar instead.
export function AuthorSidebar({
  guides,
  sharedGuides,
  totalPlaces,
  profile,
}: AuthorSidebarProps) {
  const pathname = usePathname();
  const onAllPlaces = pathname === "/home";
  const onShared = pathname === "/home/shared";
  const initial = profile.display_name.charAt(0).toUpperCase() || "?";

  return (
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col overflow-y-auto border-r border-border lg:flex">
      <div className="px-4 pb-4 pt-5">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 font-serif text-[14px] text-ink"
          style={{ letterSpacing: "0.08em" }}
        >
          <Waymark size={13} color="#2D2A26" />
          Lore
        </Link>
      </div>

      {/* All places — primary nav item */}
      <div className="px-2">
        <Link
          href="/home"
          className={cn(
            "flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors",
            onAllPlaces ? "bg-surface" : "hover:bg-surface/60",
          )}
        >
          <Icon
            path={IconPath.mapPin}
            size={14}
            color={onAllPlaces ? "#2D2A26" : "#9C8E7C"}
          />
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "m-0 font-serif text-[14px]",
                onAllPlaces ? "text-ink" : "text-ink-muted",
              )}
            >
              All places
            </p>
            <p className="m-0 font-serif italic text-[11px] text-faint">
              {totalPlaces} saved
            </p>
          </div>
        </Link>
      </div>

      <Divider />

      {/* My guides */}
      <div className="px-2">
        <div className="mb-1.5 flex items-center justify-between px-2">
          <SectionLabel>Guides</SectionLabel>
          <Link
            href="/guides/new"
            aria-label="New guide"
            className="font-serif text-[16px] leading-none text-accent"
          >
            +
          </Link>
        </div>
        {guides.length === 0 ? (
          <p className="m-0 px-4 pt-1 font-serif italic text-[12px] text-faint">
            No guides yet.
          </p>
        ) : (
          guides.map((g) => {
            const active =
              pathname === `/guides/${g.slug}` ||
              pathname.startsWith(`/guides/${g.slug}/`);
            return (
              <Link
                key={g.id}
                href={`/guides/${g.slug}`}
                className={cn(
                  "flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors",
                  active ? "bg-surface" : "hover:bg-surface/60",
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-circle"
                  style={{ backgroundColor: g.color }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "m-0 truncate font-serif text-[14px]",
                      active ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {g.title}
                  </p>
                  <p className="m-0 font-serif italic text-[11px] text-faint">
                    {g.place_count}{" "}
                    {g.place_count === 1 ? "place" : "places"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <Divider />

      {/* Shared with me */}
      <div className="px-2">
        <div className="mb-1.5 px-2">
          <SectionLabel>
            <Link
              href="/home/shared"
              className={cn(onShared ? "text-ink" : "text-faint")}
            >
              Shared with me
            </Link>
          </SectionLabel>
        </div>
        {sharedGuides.length === 0 ? (
          <p className="m-0 px-4 pb-1 font-serif italic text-[12px] text-faint">
            Nothing yet.
          </p>
        ) : (
          sharedGuides.map((g) => (
            <Link
              key={g.id}
              href={`/g/${g.slug}`}
              className="flex w-full items-center gap-2.5 px-4 py-2 opacity-80 transition-opacity hover:opacity-100"
            >
              <span
                className="h-[7px] w-[7px] shrink-0 rounded-circle"
                style={{ backgroundColor: g.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate font-serif text-[13px] text-ink-muted">
                  {g.title}
                </p>
                <p className="m-0 font-serif italic text-[10px] text-faint">
                  from {g.author_name}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Push the user row to the bottom */}
      <div className="flex-1" />

      <div className="flex items-center gap-2.5 border-t border-border-soft px-4 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-circle bg-accent font-serif text-[12px] text-on-accent">
          {initial}
        </span>
        <span className="truncate font-serif text-[13px] text-ink-muted">
          {profile.display_name}
        </span>
      </div>
    </aside>
  );
}

function Divider() {
  return <div className="mx-4 my-2 h-px bg-border" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="m-0 font-sans text-[9px] font-semibold uppercase text-faint"
      style={{ letterSpacing: "0.14em" }}
    >
      {children}
    </p>
  );
}
