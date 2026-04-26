import Link from "next/link";
import { AuthorShell } from "@/components/author/AuthorShell";
import { Waymark } from "@/components/primitives/Waymark";
import { currentProfile } from "@/lib/auth";
import { listSavedGuidesForUser } from "@/lib/db/saved-guides";
import { relativeDate } from "@/lib/format";

export default async function SharedTab() {
  const profile = await currentProfile();
  if (!profile) return null;
  const saved = await listSavedGuidesForUser(profile.id);

  return (
    <AuthorShell>
      <header className="border-b border-border px-5 pt-6 sm:px-7">
        <h1 className="m-0 font-serif text-[22px] font-normal text-ink">
          Shared with me
        </h1>
        <p className="m-0 mb-5 mt-0.5 font-serif italic text-[12px] text-faint">
          {saved.length === 0
            ? "Nothing saved yet — open a shared link and tap Save."
            : `${saved.length} ${saved.length === 1 ? "guide" : "guides"} you've saved`}
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center px-5 pt-16 text-center">
          <Waymark size={28} color="#C0B8B0" />
          <p className="m-0 mt-5 max-w-[300px] font-serif italic text-[14px] leading-[1.6] text-ink-muted">
            When a friend shares a guide with you, save it here. The places
            they love show up in your map alongside yours.
          </p>
        </div>
      ) : (
        <ul className="m-0 list-none p-0 px-5 sm:px-7">
          {saved.map((g) => (
            <li
              key={g.id}
              className="border-b border-border-soft py-4 last:border-b-0"
            >
              <Link href={`/g/${g.slug}`} className="flex items-start gap-4">
                <div
                  className="h-[52px] w-[72px] shrink-0"
                  style={{ backgroundColor: g.color }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 font-serif text-[16px] text-ink">
                    {g.title}
                  </h3>
                  <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
                    from {g.author_name}
                    <span className="not-italic"> · saved {relativeDate(g.saved_at)}</span>
                  </p>
                  {g.intro && (
                    <p
                      className="m-0 mt-1.5 font-serif text-[13px] leading-[1.55] text-ink-muted"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {g.intro}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AuthorShell>
  );
}
