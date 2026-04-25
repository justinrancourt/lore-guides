import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { MyPlacesList } from "@/components/place/MyPlacesList";
import { Waymark } from "@/components/primitives/Waymark";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { guides, places, unfiledPlaces } from "@/lib/mock-data";

export default function HomePage() {
  const unfiled = unfiledPlaces();
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
        <Link
          href="/home?filter=unfiled"
          className="mx-5 mt-4 flex items-center gap-3 border-l-[3px] border-banner-icon bg-banner-bg px-4 py-2.5"
        >
          <Waymark size={14} color="#C8A05C" />
          <div className="min-w-0 flex-1">
            <p
              className="m-0 font-serif text-[13px] text-ink"
            >
              <span className="text-ink">{unfiled.length}</span> unfiled places
            </p>
            <p className="m-0 font-serif italic text-[12px] text-ink-muted">
              File them or build a guide from them
            </p>
          </div>
          <Icon path={IconPath.chevRight} size={14} color="#9C8E7C" />
        </Link>
      )}

      <MyPlacesList
        places={places}
        guides={guides}
        unfiledCount={unfiled.length}
      />
    </AppShell>
  );
}
