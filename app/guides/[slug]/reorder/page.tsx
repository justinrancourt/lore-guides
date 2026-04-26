import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
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
    <div className="form-column">
      <NavBar
        sticky
        left={
          <Link
            href={`/guides/${guide.slug}`}
            className="font-serif text-[13px] text-faint"
          >
            ← Done
          </Link>
        }
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            Reorder · {guide.title}
          </span>
        }
      />
      <ReorderClient
        guideId={guide.id}
        guideSlug={guide.slug}
        places={places}
      />
    </div>
  );
}
