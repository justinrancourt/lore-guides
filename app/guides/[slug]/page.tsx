import { notFound } from "next/navigation";
import Link from "next/link";
import { AuthorShell } from "@/components/author/AuthorShell";
import { GuideDetailPanel } from "@/components/author/GuideDetailPanel";
import { CompactPlaceRow } from "@/components/author/CompactPlaceRow";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { currentProfile } from "@/lib/auth";
import { guideBySlug } from "@/lib/db/guides";
import { listPlacesInGuide } from "@/lib/db/places";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AuthorGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await currentProfile();
  if (!profile) return null;

  const guide = await guideBySlug(slug);
  if (!guide || guide.author_id !== profile.id) notFound();

  const places = await listPlacesInGuide(guide.id);

  return (
    <AuthorShell rightPanel={<GuideDetailPanel guide={guide} places={places} />}>
      <header className="border-b border-border px-5 pt-6 sm:px-7">
        <div className="flex items-center gap-2">
          <span
            className="h-[9px] w-[9px] rounded-circle"
            style={{ backgroundColor: guide.color }}
          />
          <h1 className="m-0 font-serif text-[22px] font-normal text-ink">
            {guide.title}
          </h1>
        </div>
        <p className="m-0 mb-5 mt-0.5 font-serif italic text-[12px] text-faint">
          {places.length} {places.length === 1 ? "place" : "places"}
          {guide.year ? ` · ${guide.year}` : ""}
          {guide.is_public ? " · public" : " · private"}
        </p>
      </header>

      <div className="px-5 sm:px-7">
        {places.length === 0 ? (
          <p className="py-12 text-center font-serif italic text-[14px] text-faint">
            No places in this guide yet.
          </p>
        ) : (
          places.map((p) => <CompactPlaceRow key={p.id} place={p} />)
        )}

        <Link
          href={`/guides/${guide.slug}/add`}
          className="flex items-center justify-center gap-2 py-5 font-serif text-[13px] text-faint transition-colors hover:text-ink"
        >
          <Icon path={IconPath.plus} size={14} color="currentColor" />
          Add a place
        </Link>
      </div>
    </AuthorShell>
  );
}
