import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipientNav } from "@/components/recipient/RecipientNav";
import { RecipientLandingShell } from "@/components/recipient/RecipientLandingShell";
import { currentProfile } from "@/lib/auth";
import { publicGuideBySlug } from "@/lib/db/guides";
import { listPlacesInGuide } from "@/lib/db/places";
import { isGuideSavedByUser } from "@/lib/db/saved-guides";
import { listSavedPlaceIds } from "@/lib/db/saved-places";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await publicGuideBySlug(slug);
  if (!guide) return { title: "Not found" };

  const title = `${guide.title} — A guide by ${guide.author_name}`;
  const description = guide.intro
    ? guide.intro.slice(0, 200)
    : `${guide.author_name}'s guide to ${guide.title}. Saved on Lore Guides.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Lore Guides",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RecipientGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await publicGuideBySlug(slug);
  if (!guide) notFound();
  const places = await listPlacesInGuide(guide.id);

  // Read save state for the signed-in user (if any). Recipients without
  // an account get `false` everywhere and any Save button redirects
  // them to signup.
  const profile = await currentProfile();
  const [initiallySaved, initialSavedPlaceIds] = await Promise.all([
    profile ? isGuideSavedByUser(profile.id, guide.id) : Promise.resolve(false),
    listSavedPlaceIds(
      profile?.id ?? null,
      places.map((p) => p.id),
    ),
  ]);

  // Subtle metadata shown on the right of the desktop nav (italic muted,
  // lg+ only) — keeps the mobile nav clean.
  const navMeta = [
    `${places.length} ${places.length === 1 ? "place" : "places"}`,
    guide.year,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-bg">
      <RecipientNav slug={guide.slug} mode="landing" metadata={navMeta} />
      <RecipientLandingShell
        guide={guide}
        authorName={guide.author_name}
        places={places}
        initiallySaved={initiallySaved}
        initialSavedPlaceIds={initialSavedPlaceIds}
      />
    </div>
  );
}
