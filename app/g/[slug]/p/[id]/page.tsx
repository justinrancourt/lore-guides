import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipientNav } from "@/components/recipient/RecipientNav";
import { RecipientPlaceDetail } from "@/components/recipient/RecipientPlaceDetail";
import { publicGuideBySlug } from "@/lib/db/guides";
import { listPlacesInGuide, placeInPublicGuide } from "@/lib/db/places";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const result = await placeInPublicGuide(slug, id);
  if (!result) return { title: "Not found" };
  const guide = await publicGuideBySlug(slug);
  if (!guide) return { title: "Not found" };

  const { place } = result;
  const title = `${place.name} — ${guide.title} guide by ${guide.author_name}`;
  const description = place.note
    ? place.note.slice(0, 200)
    : `${place.name}${place.neighborhood ? `, ${place.neighborhood}` : ""}. From ${guide.author_name}'s ${guide.title} guide.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", siteName: "Lore Guides" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RecipientPlacePage({ params }: PageProps) {
  const { slug, id } = await params;
  const result = await placeInPublicGuide(slug, id);
  if (!result) notFound();

  const guide = await publicGuideBySlug(slug);
  if (!guide) notFound();

  // Compute the place's 1-based position by reading the full guide list.
  // Cheap because publicGuideBySlug already cached the row, and we need
  // siblings anyway (we already have them via placeInPublicGuide).
  const all = await listPlacesInGuide(guide.id);
  const index = all.findIndex((p) => p.id === id) + 1;

  return (
    <div className="min-h-screen bg-bg">
      <RecipientNav slug={guide.slug} mode="place" />
      <RecipientPlaceDetail
        guideSlug={guide.slug}
        guideTitle={guide.title}
        authorName={guide.author_name}
        place={result.place}
        siblings={result.siblings}
        index={index}
        totalPlaces={all.length}
      />
    </div>
  );
}
