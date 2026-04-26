import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthorSidebar } from "./AuthorSidebar";
import { MobileTabBar } from "./MobileTabBar";
import { CaptureProvider } from "@/components/capture/CaptureProvider";
import { currentProfile } from "@/lib/auth";
import { listGuidesForUser } from "@/lib/db/guides";
import { listSavedGuidesForUser } from "@/lib/db/saved-guides";
import { countPlacesForUser } from "@/lib/db/places";

interface AuthorShellProps {
  /** Center column content. */
  children: ReactNode;
  /** Right panel content. Hidden on mobile (the right panel collapses
   *  to a separate route in the spec; for now we just hide it). */
  rightPanel?: ReactNode;
}

// The persistent three-column layout that wraps every authenticated
// author screen. Server component so the sidebar data fetches happen
// alongside whatever the page itself fetches.
//
// Desktop ≥ lg: 220px sidebar | flex-1 center | 300px right panel
// Mobile/Tablet < lg: stacked, sidebar replaced by bottom tab bar,
// right panel hidden (the page itself decides what to show in its
// place — usually the same content scrolled inline).
export async function AuthorShell({ children, rightPanel }: AuthorShellProps) {
  const profile = await currentProfile();
  if (!profile) redirect("/login");

  // Sidebar data is the same on every author route — fetch in parallel.
  // The place count is a head-only count (not the full list with signed
  // URLs) since the sidebar only displays the number.
  const [guides, sharedGuides, totalPlaces] = await Promise.all([
    listGuidesForUser(profile.id),
    listSavedGuidesForUser(profile.id),
    countPlacesForUser(profile.id),
  ]);

  return (
    // CaptureProvider wraps the whole shell so any nested CTA (e.g. the
    // empty-state "Save a place", or a future "+ Add a place" inline
    // button) can pop the capture sheet via useCapture(). Triggered by
    // CTAs only — there is intentionally no FAB.
    <CaptureProvider>
      <div className="flex min-h-screen w-full">
        <AuthorSidebar
          guides={guides}
          sharedGuides={sharedGuides}
          totalPlaces={totalPlaces}
          profile={{
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
          }}
        />

        {/* Center: scrollable independently on desktop, flows naturally
            on mobile. min-w-0 keeps long content from overflowing the
            flex parent; pb-20 leaves room for the mobile tab bar. */}
        <main className="min-w-0 flex-1 overflow-y-auto pb-20 lg:h-screen lg:border-r lg:border-border lg:pb-0">
          {children}
        </main>

        {/* Right panel: desktop only. The page chooses what to put here
            based on what's selected in the sidebar. */}
        {rightPanel && (
          <aside className="hidden h-screen w-[300px] shrink-0 overflow-y-auto lg:block">
            {rightPanel}
          </aside>
        )}
      </div>
      <MobileTabBar />
    </CaptureProvider>
  );
}
