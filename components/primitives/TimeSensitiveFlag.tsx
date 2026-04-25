import { Icon, IconPath } from "./Icon";

interface TimeSensitiveFlagProps {
  text: string;
}

export function TimeSensitiveFlag({ text }: TimeSensitiveFlagProps) {
  return (
    <span className="inline-flex items-center gap-1 font-serif italic text-[11px] text-time">
      <Icon path={IconPath.clock} size={10} color="#9B8B5A" stroke={1.6} />
      {text}
    </span>
  );
}
