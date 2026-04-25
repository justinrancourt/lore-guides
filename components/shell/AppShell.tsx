import type { ReactNode } from "react";
import { Logo } from "@/components/primitives/Logo";
import { NavBar } from "@/components/primitives/NavBar";
import { TabStrip } from "./TabStrip";
import { CaptureFab } from "./CaptureFab";
import { CaptureProvider } from "@/components/capture/CaptureProvider";
import { AccountMenu } from "./AccountMenu";
import { currentProfile } from "@/lib/auth";

interface AppShellProps {
  children: ReactNode;
  showTabs?: boolean;
  showFab?: boolean;
}

export async function AppShell({
  children,
  showTabs = true,
  showFab = true,
}: AppShellProps) {
  const profile = await currentProfile();

  return (
    <CaptureProvider>
      <div className="device-column">
        <NavBar
          left={<Logo href="/home" />}
          right={profile ? <AccountMenu name={profile.display_name} /> : null}
        />
        {showTabs && <TabStrip />}
        <main className="flex-1 pb-24">{children}</main>
        {showFab && <CaptureFab />}
      </div>
    </CaptureProvider>
  );
}
