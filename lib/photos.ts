// Client-side image pipeline for place photos.
//
// Pipeline:
//   1. Read the picked File via FileReader
//   2. Draw onto a canvas at most MAX_WIDTH wide (preserving aspect)
//   3. Export as JPEG at QUALITY
//   4. Upload directly to Supabase Storage via the browser client
//      (RLS policy: only the auth user can write into their own folder)
//   5. Caller inserts the place_photos row server-side
//
// We never round-trip the original through our server — this saves
// bandwidth and keeps photo handling stateless on our side.

import { createClient } from "./supabase/browser";

const MAX_WIDTH = 1200;
const QUALITY = 0.85;
const BUCKET = "place-photos";

export interface UploadedPhoto {
  storagePath: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadPlacePhoto(
  file: File,
  userId: string,
  placeId: string,
): Promise<UploadedPhoto> {
  const blob = await resizeToJpeg(file);

  const fileName = `${crypto.randomUUID()}.jpg`;
  const storagePath = `${userId}/${placeId}/${fileName}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, blob.blob, {
      contentType: "image/jpeg",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw error;

  return {
    storagePath,
    width: blob.width,
    height: blob.height,
    bytes: blob.blob.size,
  };
}

interface ResizedBlob {
  blob: Blob;
  width: number;
  height: number;
}

async function resizeToJpeg(file: File): Promise<ResizedBlob> {
  // Decode to ImageBitmap when available; fallback to <img> + load event
  // for older browsers. Both produce a drawable source.
  const bitmap = await loadImage(file);

  const ratio = bitmap.width > MAX_WIDTH ? MAX_WIDTH / bitmap.width : 1;
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob) throw new Error("Could not encode JPEG");

  return { blob, width, height };
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  // Fallback path — Safari in some contexts lacks createImageBitmap.
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  } finally {
    // Revoke after the next tick so the image keeps its source long
    // enough to be drawn.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
