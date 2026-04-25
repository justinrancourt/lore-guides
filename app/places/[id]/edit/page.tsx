import { notFound } from "next/navigation";
import { currentProfile } from "@/lib/auth";
import { placeById } from "@/lib/db/places";
import { EditPlaceForm } from "./EditPlaceForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlacePage({ params }: PageProps) {
  const { id } = await params;
  const profile = await currentProfile();
  if (!profile) return null;
  const place = await placeById(id);
  if (!place || place.created_by !== profile.id) notFound();
  return <EditPlaceForm place={place} />;
}
