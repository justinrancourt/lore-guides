// 16:10 photo placeholder with a warm light overlay and italic caption.
// During Phase 1 we render a flat color block (per the design references).
// Once the upload pipeline lands, swap in <Image> with the same aspect.

interface PhotoBlockProps {
  /** Hex background while no real photo is bound. */
  color?: string;
  caption?: string;
  src?: string;
  alt?: string;
}

export function PhotoBlock({
  color,
  caption,
  src,
  alt = "",
}: PhotoBlockProps) {
  return (
    <figure className="my-4">
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16 / 10", backgroundColor: color, filter: "saturate(0.78)" }}
      >
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="photo-overlay absolute inset-0" />
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.24)"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="m-0 mt-1.5 font-serif italic text-[12px] leading-[1.5] text-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
