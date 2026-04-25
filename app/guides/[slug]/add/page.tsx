import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
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
    <div className="device-column">
      <NavBar
        sticky
        left={
          <Link
            href={`/guides/${guide.slug}`}
            className="font-serif text-[14px] text-faint"
          >
            ✕ Cancel
          </Link>
        }
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            Add to {guide.title}
          </span>
        }
      />
      <AddPlaceFlow guideId={guide.id} />
    </div>
  );
}
