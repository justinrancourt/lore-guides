import { cn } from "@/lib/cn";

interface GuideModeBtnProps {
  active?: boolean;
}

export function GuideModeBtn({ active }: GuideModeBtnProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-[11px] py-[5px] font-serif text-[10px] uppercase",
        active
          ? "bg-accent text-on-accent border-0"
          : "border border-border text-ink-muted",
      )}
      style={{ letterSpacing: "0.12em" }}
    >
      Guide
    </span>
  );
}
