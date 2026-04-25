import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
import { Icon, IconPath } from "@/components/primitives/Icon";

const TYPES: { id: string; label: string; hint: string }[] = [
  { id: "city", label: "A city", hint: "Valencia, Lisbon, New York" },
  { id: "region", label: "A region", hint: "South Florida, Tuscany, the PNW" },
  { id: "trip", label: "A trip", hint: "Keys 2024, Honeymoon in Japan" },
  {
    id: "theme",
    label: "A theme",
    hint: "Best coffee shops, Places to take first-time visitors",
  },
];

export default function NewGuideTypePicker() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg">
      <NavBar
        sticky
        left={
          <Link href="/home/guides" className="font-serif text-[14px] text-faint">
            ✕ Cancel
          </Link>
        }
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            New guide
          </span>
        }
      />
      <div className="px-5 pt-8">
        <p
          className="m-0 font-serif text-[11px] uppercase text-accent"
          style={{ letterSpacing: "0.18em" }}
        >
          What shape is it?
        </p>
        <h1 className="m-0 mt-2 font-serif text-title text-ink">
          Pick the shape of your guide.
        </h1>
        <p className="m-0 mt-2 font-serif italic text-[14px] text-ink-muted">
          The shape is just a hint — it changes which fields show up next.
        </p>
        <ul className="mt-6 list-none p-0">
          {TYPES.map((t) => (
            <li key={t.id} className="border-t border-border last:border-b">
              <Link
                href={`/guides/new/${t.id}`}
                className="flex items-center gap-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="m-0 font-serif text-[18px] text-ink">{t.label}</p>
                  <p className="m-0 mt-0.5 font-serif italic text-[13px] text-faint">
                    {t.hint}
                  </p>
                </div>
                <Icon path={IconPath.chevRight} size={14} color="#9C8E7C" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
