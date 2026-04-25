import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
import { Logo } from "@/components/primitives/Logo";
import { BackBtn } from "@/components/primitives/BackBtn";
import { GuideModeBtn } from "@/components/primitives/GuideModeBtn";
import { Cover } from "@/components/primitives/Cover";
import { GuideFooter } from "@/components/primitives/GuideFooter";
import { GuidePlacesView } from "@/components/guide/GuidePlacesView";
import { PublishControl } from "@/components/guide/PublishControl";
import { CaptureProvider } from "@/components/capture/CaptureProvider";
import { CaptureFab } from "@/components/shell/CaptureFab";
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

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "lore.guides";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}/g/${guide.slug}`;

  return (
    <CaptureProvider>
      <div className="device-column">
        <NavBar
          left={<BackBtn label="Guides" href="/home/guides" />}
          center={<Logo size={11} />}
          right={<GuideModeBtn active />}
        />
        <Cover
          guide={guide}
          authorName={profile.display_name}
          placeCount={places.length}
        />
        <GuidePlacesView city={guide.title} places={places} />
        <PublishControl
          guideId={guide.id}
          isPublic={guide.is_public}
          publicUrl={publicUrl}
        />
        <div className="flex items-center justify-center gap-3 px-5 pb-4 pt-6">
          <Link
            href={`/guides/${guide.slug}/add`}
            className="inline-block border border-dashed border-border-bold px-4 py-2.5 font-serif text-[12px] uppercase text-ink-muted"
            style={{ letterSpacing: "0.14em" }}
          >
            + Add a place
          </Link>
          {places.length > 1 && (
            <Link
              href={`/guides/${guide.slug}/reorder`}
              className="inline-block px-3 py-2.5 font-serif text-[12px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Reorder
            </Link>
          )}
        </div>
        <GuideFooter authorName={profile.display_name} city={guide.title} />
        <CaptureFab />
      </div>
    </CaptureProvider>
  );
}
