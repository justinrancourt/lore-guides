import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipientNav } from "@/components/recipient/RecipientNav";
import { RecipientPlaceDetail } from "@/components/recipient/RecipientPlaceDetail";
import { currentProfile } from "@/lib/auth";
import { publicGuideBySlug } from "@/lib/db/guides";
import { placeInPublicGuide } from "@/lib/db/places";
import { isPlaceSavedByUser } from "@/lib/db/saved-places";

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

  // placeInPublicGuide returns the full guide list + the place's index,
  // so we don't need a second listPlacesInGuide call.
  const result = await placeInPublicGuide(slug, id);
  if (!result) notFound();

  const guide = await publicGuideBySlug(slug);
  if (!guide) notFound();

  const profile = await currentProfile();
  const initiallySaved = profile
    ? await isPlaceSavedByUser(profile.id, id)
    : false;

  return (
    <div className="min-h-screen bg-bg">
      <RecipientNav slug={guide.slug} mode="place" />
      <RecipientPlaceDetail
        guideSlug={guide.slug}
        guideTitle={guide.title}
        authorName={guide.author_name}
        place={result.place}
        siblings={result.siblings}
        index={result.index + 1}
        totalPlaces={result.all.length}
        initiallySaved={initiallySaved}
      />
    </div>
  );
}
