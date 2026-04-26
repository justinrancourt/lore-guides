import Link from "next/link";
import { AuthorShell } from "@/components/author/AuthorShell";
import { GuideRowCard } from "@/components/guide/GuideRowCard";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { Waymark } from "@/components/primitives/Waymark";
import { currentProfile } from "@/lib/auth";
import { listGuidesForUser } from "@/lib/db/guides";

// On desktop the sidebar already enumerates guides; this page is most
// useful on mobile (Guides tab in the bottom nav). It still works at
// every breakpoint as a flat browse view.
export default async function GuidesTab() {
  const profile = await currentProfile();
  if (!profile) return null;

  const guides = await listGuidesForUser(profile.id);

  return (
    <AuthorShell>
      <header className="border-b border-border px-5 pt-6 sm:px-7">
        <h1 className="m-0 font-serif text-[22px] font-normal text-ink">
          Your guides
        </h1>
        <p className="m-0 mb-5 mt-0.5 font-serif italic text-[12px] text-faint">
          {guides.length === 0
            ? "Pick a shape to start."
            : `${guides.length} ${guides.length === 1 ? "guide" : "guides"}`}
        </p>
      </header>

      <div className="px-5 sm:px-7">
        {guides.length === 0 ? (
          <div className="flex flex-col items-center pb-6 pt-12 text-center">
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
    </AuthorShell>
  );
}
