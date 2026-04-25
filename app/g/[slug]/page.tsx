import { notFound } from "next/navigation";
import { Logo } from "@/components/primitives/Logo";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { Cover } from "@/components/primitives/Cover";
import { Waymark } from "@/components/primitives/Waymark";
import { RecipientGuideView } from "@/components/recipient/RecipientGuideView";
import { publicGuideBySlug } from "@/lib/db/guides";
import { listPlacesInGuide } from "@/lib/db/places";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecipientGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await publicGuideBySlug(slug);
  if (!guide) notFound();
  const places = await listPlacesInGuide(guide.id);

  return (
    <div className="device-column">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <Logo size={11} href="/" />
        <button
          type="button"
          aria-label="Share"
          className="flex h-8 w-8 items-center justify-center"
        >
          <Icon path={IconPath.share} size={16} color="#4A4540" />
        </button>
      </header>

      <Cover
        guide={guide}
        authorName={guide.author_name}
        placeCount={places.length}
      />

      <RecipientGuideView
        city={guide.title}
        authorName={guide.author_name}
        places={places}
      />

      <section className="px-5 pb-12 pt-10 text-center">
        <div className="mx-auto mb-6 h-px w-8 bg-accent" />
        <p className="m-0 mb-7 font-serif italic text-[14px] text-ink-muted">
          That&rsquo;s all {guide.author_name}&rsquo;s {guide.title}.
        </p>
        <div className="border border-border bg-surface px-6 pb-7 pt-7 text-center">
          <div className="mx-auto mb-3 inline-block">
            <Waymark size={22} color="#C17C4E" />
          </div>
          <h2 className="m-0 mb-2 font-serif text-[22px] text-ink">
            Keep this guide
          </h2>
          <p className="m-0 mb-5 font-serif italic text-[14px] leading-[1.6] text-ink-muted">
            Save the places you love. Build a guide of your own.
          </p>
          <button
            type="button"
            className="mb-2 block w-full bg-ink py-2.5 font-serif text-[12px] uppercase text-bg"
            style={{ letterSpacing: "0.14em" }}
          >
            Create account · save guide
          </button>
          <button
            type="button"
            className="block w-full border border-border bg-transparent py-2.5 font-serif text-[12px] uppercase text-ink-muted"
            style={{ letterSpacing: "0.14em" }}
          >
            Sign in
          </button>
        </div>
        <p className="m-0 mt-5 font-serif italic text-[12px] text-faint">
          Or simply bookmark this page — it&rsquo;ll always be here.
        </p>
      </section>
    </div>
  );
}
