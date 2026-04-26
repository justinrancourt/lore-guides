import { notFound } from "next/navigation";
import { AuthorShell } from "@/components/author/AuthorShell";
import { AddPlaceFlow } from "./AddPlaceFlow";
import { currentProfile } from "@/lib/auth";
import { guideBySlug } from "@/lib/db/guides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AddPlacePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await currentProfile();
  if (!profile) return null;
  const guide = await guideBySlug(slug);
  if (!guide || guide.author_id !== profile.id) notFound();

  return (
    <AuthorShell>
      <AddPlaceFlow
        guideId={guide.id}
        guideSlug={guide.slug}
        guideTitle={guide.title}
        userId={profile.id}
      />
    </AuthorShell>
  );
}
