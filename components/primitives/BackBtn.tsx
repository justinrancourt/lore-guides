import Link from "next/link";
import { Icon, IconPath } from "./Icon";

interface BackBtnProps {
  label?: string;
  href?: string;
}

export function BackBtn({ label = "Back", href }: BackBtnProps) {
  const inner = (
    <span className="flex items-center gap-1 text-faint font-serif text-[13px]">
      <Icon path={IconPath.chevLeft} size={14} color="currentColor" />
      {label}
    </span>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
