import { notFound } from "next/navigation";
import Link from "next/link";
import { AuthorShell } from "@/components/author/AuthorShell";
import { PlaceDetailPanel } from "@/components/author/PlaceDetailPanel";
import { TimeSensitiveFlag } from "@/components/primitives/TimeSensitiveFlag";
import { PhotoBlock } from "@/components/primitives/PhotoBlock";
import { PlaceCoverCard } from "@/components/place/PlaceCoverCard";
import { currentProfile } from "@/lib/auth";
import { listGuidesForUser } from "@/lib/db/guides";
import { placeById } from "@/lib/db/places";
import { placeholderColor } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await currentProfile();
  if (!profile) return null;

  const place = await placeById(id);
  if (!place || place.created_by !== profile.id) notFound();

  const allGuides = await listGuidesForUser(profile.id);
  const filedIn = allGuides.filter((g) => place.guide_ids.includes(g.id));
  const cover = place.photos[0];

  return (
    <AuthorShell rightPanel={<PlaceDetailPanel place={place} filedIn={filedIn} />}>
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 sm:px-7">
        <Link href="/home" className="font-serif text-[13px] text-faint">
          ← Back to places
        </Link>
        {/* On mobile the right panel is hidden, so put Edit here too. */}
        <Link
          href={`/places/${place.id}/edit`}
          className="font-serif text-[12px] uppercase text-accent lg:hidden"
          style={{ letterSpacing: "0.14em" }}
        >
          Edit
        </Link>
      </header>

      <article className="mx-auto max-w-[640px] px-5 pb-16 pt-8 sm:px-7">
        {place.best_time && place.type && (
          <p
            className="m-0 mb-2 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            {place.best_time} · {place.type}
          </p>
        )}
        <h1 className="m-0 font-serif text-[28px] font-normal leading-[1.15] text-ink sm:text-[32px]">
          {place.name}
        </h1>
        {place.neighborhood && (
          <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
            {place.neighborhood}
          </p>
        )}
        {place.time_sensitive && (
          <div className="mt-3">
            <TimeSensitiveFlag text={place.time_sensitive} />
          </div>
        )}
        {place.vibe && (
          <p className="m-0 mt-5 border-l-[3px] border-accent pl-3 font-serif italic text-[17px] text-ink-muted">
            {place.vibe}
          </p>
        )}
        {cover ? (
          <PhotoBlock
            src={cover.url}
            color={placeholderColor(place.id)}
            caption={cover.caption ?? undefined}
          />
        ) : (
          // Standalone view — pull city/country from the first guide
          // this place is filed in. No guide context = no N° position.
          <div className="my-4">
            <PlaceCoverCard
              name={place.name}
              neighborhood={place.neighborhood}
              city={filedIn[0]?.city ?? null}
              country={filedIn[0]?.country ?? null}
            />
          </div>
        )}
        {place.note ? (
          <div className="mt-2">
            <p
              className="m-0 mb-2 font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Your note
            </p>
            <p className="m-0 font-serif text-[15px] leading-[1.85] text-ink-muted">
              {place.note}
            </p>
          </div>
        ) : (
          <p className="m-0 mt-7 font-serif italic text-[14px] text-accent-deep opacity-70">
            This place needs a note.{" "}
            <Link
              href={`/places/${place.id}/edit`}
              className="not-italic text-accent"
            >
              Add one →
            </Link>
          </p>
        )}
      </article>
    </AuthorShell>
  );
}
