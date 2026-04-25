import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
import { Logo } from "@/components/primitives/Logo";
import { BackBtn } from "@/components/primitives/BackBtn";
import { GuideModeBtn } from "@/components/primitives/GuideModeBtn";
import { Cover } from "@/components/primitives/Cover";
import { GuideFooter } from "@/components/primitives/GuideFooter";
import { GuidePlacesView } from "@/components/guide/GuidePlacesView";
import { CaptureProvider } from "@/components/capture/CaptureProvider";
import { CaptureFab } from "@/components/shell/CaptureFab";
import { guideBySlug, me, placesInGuide } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AuthorGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const places = placesInGuide(guide.id);

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
          authorName={me.displayName}
          placeCount={places.length}
        />
        <GuidePlacesView city={guide.title} places={places} />
        <div className="px-5 pb-4 pt-6 text-center">
          <Link
            href={`/guides/${guide.slug}/add`}
            className="inline-block border border-dashed border-border-bold px-4 py-2.5 font-serif text-[12px] uppercase text-ink-muted"
            style={{ letterSpacing: "0.14em" }}
          >
            + Add a place
          </Link>
        </div>
        <GuideFooter authorName={me.displayName} city={guide.title} />
        <CaptureFab />
      </div>
    </CaptureProvider>
  );
}
