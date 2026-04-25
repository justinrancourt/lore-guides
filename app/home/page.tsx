import { AppShell } from "@/components/shell/AppShell";
import { MyPlacesList } from "@/components/place/MyPlacesList";
import { EmptyHome } from "@/components/place/EmptyHome";
import { Waymark } from "@/components/primitives/Waymark";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { currentProfile } from "@/lib/auth";
import { listGuidesForUser } from "@/lib/db/guides";
import { listPlacesForUser } from "@/lib/db/places";

export default async function HomePage() {
  const profile = await currentProfile();
  if (!profile) return null; // proxy will have redirected; defensive

  const [places, guides] = await Promise.all([
    listPlacesForUser(profile.id),
    listGuidesForUser(profile.id),
  ]);

  const unfiled = places.filter((p) => p.guide_ids.length === 0);

  if (places.length === 0) {
    return (
      <AppShell>
        <EmptyHome />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="px-5 pt-5">
        <h1 className="m-0 font-serif text-title text-ink">
          Every place I&rsquo;ve saved
        </h1>
        <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
          {places.length} places · {unfiled.length} unfiled
        </p>
      </header>

      {unfiled.length > 0 && (
        <div className="mx-5 mt-4 flex items-center gap-3 border-l-[3px] border-banner-icon bg-banner-bg px-4 py-2.5">
          <Waymark size={14} color="#C8A05C" />
          <div className="min-w-0 flex-1">
            <p className="m-0 font-serif text-[13px] text-ink">
              <span className="text-ink">{unfiled.length}</span> unfiled places
            </p>
            <p className="m-0 font-serif italic text-[12px] text-ink-muted">
              File them or build a guide from them
            </p>
          </div>
          <Icon path={IconPath.chevRight} size={14} color="#9C8E7C" />
        </div>
      )}

      <MyPlacesList places={places} guides={guides} unfiledCount={unfiled.length} />
    </AppShell>
  );
}
