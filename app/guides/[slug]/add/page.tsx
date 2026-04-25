import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
import { AddPlaceFlow } from "./AddPlaceFlow";
import { guideBySlug } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AddPlacePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

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
      <AddPlaceFlow />
    </div>
  );
}
