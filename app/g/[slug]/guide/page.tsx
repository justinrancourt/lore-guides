import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/primitives/Logo";
import { Waymark } from "@/components/primitives/Waymark";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { publicGuideBySlug } from "@/lib/db/guides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Stub for the V2 Tour Guide Mode route. Justin chose option (b) on the
// "I'm here" button: render the button live, point it at this real
// route, show a "coming soon" page. When Tour Guide Mode actually ships
// it replaces this entire file with the full-screen map + bottom drawer.
export default async function TourGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await publicGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg px-5 py-3 sm:px-8">
        <Link
          href={`/g/${slug}`}
          className="flex items-center gap-1 font-serif text-[13px] text-faint"
        >
          <Icon path={IconPath.chevLeft} size={14} color="currentColor" />
          Back to guide
        </Link>
        <Logo href="/" size={13} />
        <span className="w-[100px]" aria-hidden />
      </header>

      <main className="mx-auto max-w-[480px] px-5 py-20 text-center sm:py-28">
        <Waymark size={28} color="#C17C4E" />
        <h1
          className="m-0 mt-6 font-serif text-[28px] font-normal leading-[1.15] text-ink sm:text-[32px]"
          style={{ letterSpacing: "-0.015em" }}
        >
          Tour guide mode is on the way.
        </h1>
        <p className="m-0 mt-4 font-serif italic text-[15px] leading-[1.7] text-ink-muted">
          When it ships, this view drops you onto a live map of{" "}
          <span className="not-italic text-ink">{guide.title}</span>,
          re-orders the places by walking distance, and flags what&rsquo;s
          open right now. For today, head back to the guide.
        </p>
        <Link
          href={`/g/${slug}`}
          className="mt-8 inline-block bg-ink px-5 py-2.5 font-serif text-[12px] uppercase text-bg"
          style={{ letterSpacing: "0.14em" }}
        >
          Browse the guide
        </Link>
      </main>
    </div>
  );
}
