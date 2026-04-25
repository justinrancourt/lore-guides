"use client";

import { useRef, useState, useTransition } from "react";
import type { PhotoWithUrl } from "@/lib/db/places";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { uploadPlacePhoto } from "@/lib/photos";
import { attachPhoto, deletePhoto, setCoverPhoto } from "@/lib/actions/photos";

interface PhotoStripEditorProps {
  placeId: string;
  userId: string;
  photos: PhotoWithUrl[];
}

// The first photo (sort_order 0) is the cover. Tap a non-cover thumbnail
// to promote it. The X button deletes. The dashed tile picks a file,
// resizes client-side, uploads to Storage, then attaches via the action.
export function PhotoStripEditor({
  placeId,
  userId,
  photos,
}: PhotoStripEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const { storagePath } = await uploadPlacePhoto(file, userId, placeId);
        await attachPhoto({ placeId, storagePath });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  };

  return (
    <div>
      <div className="scrollbar-none flex gap-2 overflow-x-auto py-1">
        {photos.map((photo, i) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            isCover={i === 0}
            disabled={pending}
            onPromote={() =>
              startTransition(() => {
                setCoverPhoto(placeId, photo.id);
              })
            }
            onRemove={() =>
              startTransition(() => {
                deletePhoto(photo.id);
              })
            }
          />
        ))}
        <button
          type="button"
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
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && (
        <p className="m-0 mt-2 font-serif italic text-[12px] text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

function PhotoTile({
  photo,
  isCover,
  disabled,
  onPromote,
  onRemove,
}: {
  photo: PhotoWithUrl;
  isCover: boolean;
  disabled: boolean;
  onPromote: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative h-[92px] w-[92px] shrink-0">
      <button
        type="button"
        disabled={disabled || isCover}
        onClick={onPromote}
        className="block h-full w-full overflow-hidden border-0 bg-surface p-0"
        aria-label={isCover ? "Cover photo" : "Make cover photo"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.85)" }}
        />
      </button>
      {isCover && (
        <span
          className="absolute bottom-0 left-0 right-0 bg-[rgba(30,25,20,0.7)] py-0.5 text-center font-serif text-[9px] uppercase text-bg"
          style={{ letterSpacing: "0.14em" }}
        >
          Cover
        </span>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label="Remove photo"
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-circle bg-[rgba(30,25,20,0.65)] text-bg"
      >
        <Icon path={IconPath.x} size={11} color="currentColor" stroke={2} />
      </button>
    </div>
  );
}
