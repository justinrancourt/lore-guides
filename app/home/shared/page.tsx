import { AppShell } from "@/components/shell/AppShell";
import { Waymark } from "@/components/primitives/Waymark";

export default function SharedTab() {
  return (
    <AppShell>
      <div className="flex flex-col items-center px-5 pt-20 text-center">
        <Waymark size={28} color="#C0B8B0" />
        <h1 className="m-0 mt-5 font-serif text-title text-ink">
          Nothing shared with you yet
        </h1>
        <p className="m-0 mt-3 max-w-intro font-serif italic text-[14px] leading-[1.6] text-ink-muted">
          When a friend shares a guide with you, it&rsquo;ll show up here so
          you can save the places you love.
        </p>
      </div>
    </AppShell>
  );
}
