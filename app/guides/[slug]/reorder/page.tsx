import { notFound } from "next/navigation";
import Link from "next/link";
import { AuthorShell } from "@/components/author/AuthorShell";
import { FormHeader } from "@/components/author/FormHeader";
import { ReorderClient } from "./ReorderClient";
import { currentProfile } from "@/lib/auth";
import { guideBySlug } from "@/lib/db/guides";
import { listPlacesInGuide } from "@/lib/db/places";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReorderPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await currentProfile();
  if (!profile) return null;
  const guide = await guideBySlug(slug);
  if (!guide || guide.author_id !== profile.id) notFound();

  const places = await listPlacesInGuide(guide.id);

  return (
    <AuthorShell>
      <FormHeader
        left={
          <Link
            href={`/guides/${guide.slug}`}
            className="font-serif text-[13px] text-faint"
          >
            ← Done
          </Link>
        }
        title={`Reorder · ${guide.title}`}
      />
      <div className="mx-auto max-w-[560px]">
        <ReorderClient
          guideId={guide.id}
          guideSlug={guide.slug}
          places={places}
        />
      </div>
    </AuthorShell>
  );
}
