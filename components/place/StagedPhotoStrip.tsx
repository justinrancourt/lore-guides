"use client";

import { useEffect, useMemo, useRef } from "react";
import { Icon, IconPath } from "@/components/primitives/Icon";

interface StagedPhotoStripProps {
  files: File[];
  onChange: (next: File[]) => void;
  disabled?: boolean;
}

// Pre-save photo strip used inside the add-place flow. Holds File
// objects in client state, displays object-URL previews, and lets the
// user remove items before saving. The actual resize + upload happens
// in the parent after the place row is created so we have a place_id
// to attach to.
export function StagedPhotoStrip({
  files,
  onChange,
  disabled,
}: StagedPhotoStripProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep object URLs alive for the lifetime of each File. Memoizing on
  // the array reference is fine because we replace the array on every
  // mutation; the URLs for unchanged files are reused.
  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const p of previews) URL.revokeObjectURL(p.url);
    };
  }, [previews]);

  const handlePicked = (picked: FileList | null) => {
    if (!picked || picked.length === 0) return;
    onChange([...files, ...Array.from(picked)]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = (target: File) => {
    onChange(files.filter((f) => f !== target));
  };

  return (
    <div>
      <div className="scrollbar-none flex gap-2 overflow-x-auto py-1">
        {previews.map(({ file, url }) => (
          <div key={url} className="relative h-[92px] w-[92px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.85)" }}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleRemove(file)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-circle bg-[rgba(30,25,20,0.65)] text-bg"
            >
              <Icon path={IconPath.x} size={11} color="currentColor" stroke={2} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          className="flex h-[92px] w-[92px] shrink-0 flex-col items-center justify-center gap-1 border border-dashed border-border-bold bg-transparent font-serif text-[10px] uppercase text-faint"
          style={{ letterSpacing: "0.14em" }}
        >
          <Icon path={IconPath.plus} size={18} color="#9C8E7C" />
          Photo
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handlePicked(e.target.files)}
      />
    </div>
  );
}
