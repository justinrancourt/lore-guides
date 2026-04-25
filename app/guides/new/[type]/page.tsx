import Link from "next/link";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/primitives/NavBar";
import { NewGuideForm } from "./NewGuideForm";
import type { GuideType } from "@/lib/types";

const VALID_TYPES: GuideType[] = ["city", "region", "trip", "theme"];

interface PageProps {
  params: Promise<{ type: string }>;
}

export default async function NewGuideDetailsPage({ params }: PageProps) {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as GuideType)) notFound();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg">
      <NavBar
        sticky
        left={
          <Link href="/guides/new" className="font-serif text-[13px] text-faint">
            ← Back
          </Link>
        }
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            {type} guide
          </span>
        }
      />
      <NewGuideForm type={type as GuideType} />
    </div>
  );
}
