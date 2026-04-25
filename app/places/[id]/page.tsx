import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
import { BackBtn } from "@/components/primitives/BackBtn";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { TimeSensitiveFlag } from "@/components/primitives/TimeSensitiveFlag";
import { PhotoBlock } from "@/components/primitives/PhotoBlock";
import { guides, placeById } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const place = placeById(id);
  if (!place) notFound();
  const placeGuides = guides.filter((g) => place.guideIds.includes(g.id));

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg">
      <NavBar
        sticky
        left={<BackBtn label="Back" href="/home" />}
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            Place
          </span>
        }
        right={
          <Link
            href={`/places/${place.id}/edit`}
            className="font-serif text-[12px] uppercase text-accent"
            style={{ letterSpacing: "0.14em" }}
          >
            Edit
          </Link>
        }
      />

      <article className="px-5 pb-20 pt-6">
        {place.bestTime && place.type && (
          <p
            className="m-0 mb-2 font-serif text-[11px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            {place.bestTime} · {place.type}
          </p>
        )}
        <h1 className="m-0 font-serif text-[32px] leading-[1.1] text-ink">
          {place.name}
        </h1>
        {place.neighborhood && (
          <p className="m-0 mt-1.5 font-serif italic text-[13px] text-faint">
            {place.neighborhood}
          </p>
        )}
        {place.timeSensitive && (
          <div className="mt-3">
            <TimeSensitiveFlag text={place.timeSensitive} />
          </div>
        )}
        {place.vibe && (
          <p className="m-0 mt-5 border-l-[3px] border-accent pl-3 font-serif italic text-[17px] text-ink-muted">
            {place.vibe}
          </p>
        )}
        {place.photoColor && (
          <PhotoBlock color={place.photoColor} caption={place.photoCaption} />
        )}
        {place.note && (
          <div className="mt-2">
            <p
              className="m-0 mb-2 font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Your note
            </p>
            <p className="m-0 font-serif text-[15px] leading-[1.7] text-ink-muted">
              {place.note}
            </p>
          </div>
        )}
        {placeGuides.length > 0 && (
          <div className="mt-7">
            <p
              className="m-0 mb-2 font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Filed in
            </p>
            <div className="flex flex-wrap gap-2">
              {placeGuides.map((g) => (
                <Link
                  key={g.id}
                  href={`/guides/${g.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-pill border border-border px-3 py-1 font-serif text-[12px] text-ink"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-circle"
                    style={{ backgroundColor: g.color }}
                  />
                  {g.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 flex items-center gap-5 border-t border-border pt-5">
          <a
            href="https://www.google.com/maps"
            className="inline-flex items-center gap-1.5 font-serif text-[13px] text-accent"
          >
            <Icon path={IconPath.external} size={12} color="#C17C4E" />
            Open in Maps
          </a>
        </div>
      </article>
    </div>
  );
}
