import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { GuideRowCard } from "@/components/guide/GuideRowCard";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { guides, placesInGuide } from "@/lib/mock-data";

export default function GuidesTab() {
  return (
    <AppShell>
      <header className="px-5 pt-5">
        <h1 className="m-0 font-serif text-title text-ink">Your guides</h1>
        <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
          {guides.length} guides · curated views over your places
        </p>
      </header>

      <div className="mt-2 px-5">
        {guides.map((g) => (
          <GuideRowCard
            key={g.id}
            guide={g}
            count={placesInGuide(g.id).length}
          />
        ))}
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
