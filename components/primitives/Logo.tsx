import Link from "next/link";
import { Waymark } from "./Waymark";

interface LogoProps {
  size?: number;
  href?: string;
}

export function Logo({ size = 13, href }: LogoProps) {
  const inner = (
    <span className="inline-flex items-center gap-1.5 text-ink">
      <Waymark size={size} />
      <span
        className="font-serif"
        style={{ fontSize: size, letterSpacing: "0.07em" }}
      >
        Lore Guides
      </span>
    </span>
  );
  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}
