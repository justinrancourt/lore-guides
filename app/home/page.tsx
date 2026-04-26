import { AuthorShell } from "@/components/author/AuthorShell";
import { AllPlacesCenter } from "@/components/author/AllPlacesCenter";
import { AllPlacesPanel } from "@/components/author/AllPlacesPanel";
import { EmptyHome } from "@/components/place/EmptyHome";
import { SeedValenciaButton } from "@/components/shell/SeedValenciaButton";
import { currentProfile } from "@/lib/auth";
import { listGuidesForUser } from "@/lib/db/guides";
import { listPlacesForUser } from "@/lib/db/places";

export default async function HomePage() {
  const profile = await currentProfile();
  if (!profile) return null;

  const [places, guides] = await Promise.all([
    listPlacesForUser(profile.id),
    listGuidesForUser(profile.id),
  ]);

  const showDevSeed = process.env.ALLOW_DEV_SEED === "true";

  if (places.length === 0) {
    return (
      <AuthorShell>
        <EmptyHome />
        {showDevSeed && <SeedValenciaButton />}
      </AuthorShell>
    );
  }

  return (
    <AuthorShell
      rightPanel={<AllPlacesPanel places={places} guides={guides} />}
    >
      <AllPlacesCenter places={places} guides={guides} />
      {showDevSeed && <SeedValenciaButton />}
    </AuthorShell>
  );
}
