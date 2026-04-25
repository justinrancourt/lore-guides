import type { ReactNode } from "react";
import { Logo } from "@/components/primitives/Logo";
import { NavBar } from "@/components/primitives/NavBar";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { TabStrip } from "./TabStrip";
import { CaptureFab } from "./CaptureFab";
import { CaptureProvider } from "@/components/capture/CaptureProvider";

interface AppShellProps {
  children: ReactNode;
  showTabs?: boolean;
  showFab?: boolean;
}

export function AppShell({
  children,
  showTabs = true,
  showFab = true,
}: AppShellProps) {
  return (
    <CaptureProvider>
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg">
        <NavBar
          left={<Logo href="/home" />}
          right={
            <Icon path={IconPath.moreH} size={18} color="#9C8E7C" />
          }
        />
        {showTabs && <TabStrip />}
        <main className="flex-1 pb-24">{children}</main>
        {showFab && <CaptureFab />}
      </div>
    </CaptureProvider>
  );
}
