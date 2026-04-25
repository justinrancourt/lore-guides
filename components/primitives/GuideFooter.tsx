import { Waymark } from "./Waymark";

interface GuideFooterProps {
  authorName: string;
  city?: string;
}

export function GuideFooter({ authorName, city }: GuideFooterProps) {
  return (
    <footer className="px-5 py-12 text-center">
      <div className="mx-auto mb-5 h-px w-8 bg-accent" />
      <p className="m-0 mb-1 font-serif italic text-[14px] text-ink-muted">
        Shared with love by {authorName}
        {city ? ` · ${city}` : ""}
      </p>
      <div
        className="mt-6 flex items-center justify-center gap-1.5"
        style={{ opacity: 0.3 }}
      >
        <Waymark size={11} color="#2D2A26" />
        <span
          className="font-serif text-[10px] uppercase text-ink"
          style={{ letterSpacing: "0.18em" }}
        >
          Lore Guides
        </span>
      </div>
    </footer>
  );
}
