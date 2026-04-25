import { notFound } from "next/navigation";
import { placeById } from "@/lib/mock-data";
import { EditPlaceForm } from "./EditPlaceForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlacePage({ params }: PageProps) {
  const { id } = await params;
  const place = placeById(id);
  if (!place) notFound();
  return <EditPlaceForm place={place} />;
}
