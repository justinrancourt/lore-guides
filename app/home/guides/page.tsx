import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { GuideRowCard } from "@/components/guide/GuideRowCard";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { Waymark } from "@/components/primitives/Waymark";
import { currentProfile } from "@/lib/auth";
import { listGuidesForUser } from "@/lib/db/guides";

export default async function GuidesTab() {
  const profile = await currentProfile();
  if (!profile) return null;

  const guides = await listGuidesForUser(profile.id);

  return (
    <AppShell>
      <header className="px-5 sm:px-8 pt-5">
        <h1 className="m-0 font-serif text-title text-ink">Your guides</h1>
        <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
          {guides.length === 0
            ? "Pick a shape to start."
            : `${guides.length} guides · curated views over your places`}
        </p>
      </header>

      <div className="mt-2 px-5 sm:px-8">
        {guides.length === 0 ? (
          <div className="flex flex-col items-center pt-10 pb-6 text-center">
            <Waymark size={24} color="#C0B8B0" />
            <p className="m-0 mt-4 font-serif italic text-[13px] text-ink-muted">
              You haven&rsquo;t made a guide yet.
            </p>
          </div>
        ) : (
          guides.map((g) => <GuideRowCard key={g.id} guide={g} />)
        )}
        <Link
          href="/guides/new"
          className="mt-5 flex w-full items-center justify-center gap-2 border border-dashed border-border-bold bg-transparent px-4 py-4 font-serif text-[13px] text-ink-muted"
        >
          <Icon path={IconPath.plus} size={14} color="#4A4540" />
          Start a new guide
        </Link>
      </div>
    </AppShell>
  );
}
