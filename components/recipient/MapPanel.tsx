"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl, { type Map as MbMap, type Marker as MbMarker } from "mapbox-gl";
import { cn } from "@/lib/cn";

export interface MapPin {
  id: string;
  /** 1-based ordinal shown in the pin badge. */
  index: number;
  lat?: number | null;
  lng?: number | null;
}

interface PlottablePin {
  id: string;
  index: number;
  lat: number;
  lng: number;
}

interface MapPanelProps {
  pins: MapPin[];
  /** Currently-selected pin id (highlights + raises). */
  active?: string | null;
  onPinClick?: (id: string) => void;
  className?: string;
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
// Mapbox default light style. Swap to a custom Studio style URL when
// the parchment palette ships — the rest of the component stays put.
const DEFAULT_STYLE = "mapbox://styles/mapbox/light-v11";

if (TOKEN) {
  mapboxgl.accessToken = TOKEN;
}

function plottable(pins: MapPin[]): PlottablePin[] {
  return pins
    .filter(
      (p): p is MapPin & { lat: number; lng: number } =>
        typeof p.lat === "number" && typeof p.lng === "number",
    )
    .map((p) => ({ id: p.id, index: p.index, lat: p.lat, lng: p.lng }));
}

export function MapPanel({ pins, active, onPinClick, className }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MbMap | null>(null);
  const markersRef = useRef<Map<string, MbMarker>>(new Map());

  // Stable list of plottable pins. The reference changes only when the
  // visible set changes, which is what we want for the effect deps.
  const visible = useMemo(() => plottable(pins), [pins]);

  // Mount + unmount the map once per containerRef lifetime.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current || !TOKEN) return;

    const map = new mapboxgl.Map({
      container: el,
      style: DEFAULT_STYLE,
      center: [0, 20],
      zoom: 1,
    });
    mapRef.current = map;
    // Capture the ref in the closure so the cleanup uses the right
    // Map instance even if the ref is reassigned by a sibling render.
    const markers = markersRef.current;

    return () => {
      markers.forEach((m) => m.remove());
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync pins → markers. Add/remove deltas, fit bounds when the set
  // changes, re-style on active flip.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const desired = new Map(visible.map((p) => [p.id, p]));
    const existing = markersRef.current;

    // Drop markers no longer in the set
    for (const [id, marker] of existing) {
      if (!desired.has(id)) {
        marker.remove();
        existing.delete(id);
      }
    }

    // Add or restyle pins in the set
    for (const pin of visible) {
      const isActive = pin.id === active;
      const existingMarker = existing.get(pin.id);
      if (existingMarker) {
        styleMarker(existingMarker.getElement(), pin.index, isActive);
      } else {
        const el = makeMarkerElement(pin.index, isActive, () =>
          onPinClick?.(pin.id),
        );
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([pin.lng, pin.lat])
          .addTo(map);
        existing.set(pin.id, marker);
      }
    }

    // Frame the markers. fitBounds wants ≥2 points; one pin gets a
    // comfortable centered view; zero pins keeps the world view.
    if (visible.length === 1) {
      map.easeTo({ center: [visible[0].lng, visible[0].lat], zoom: 14, duration: 600 });
    } else if (visible.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      for (const p of visible) bounds.extend([p.lng, p.lat]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 600 });
    }
  }, [visible, active, onPinClick]);

  // Honest fail when the token's missing.
  if (!TOKEN) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-map-bg p-4 text-center",
          className,
        )}
      >
        <p className="m-0 font-serif italic text-[12px] text-faint">
          Map unavailable — NEXT_PUBLIC_MAPBOX_TOKEN not set.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full bg-map-bg", className)}
      role="img"
      aria-label="Map of places in this guide"
    />
  );
}

// Mapbox markers live outside React's tree, so Tailwind classes wouldn't
// apply automatically — set styles via inline string. The colors here
// match the spec tokens (#8C7B6B = map-pin, #C17C4E = accent, #FAF8F5 = bg).
function makeMarkerElement(
  index: number,
  isActive: boolean,
  onClick: () => void,
): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  styleMarker(el, index, isActive);
  return el;
}

function styleMarker(el: HTMLElement, index: number, isActive: boolean): void {
  const size = isActive ? 28 : 22;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.background = isActive ? "#C17C4E" : "#8C7B6B";
  el.style.border = "2px solid #FAF8F5";
  el.style.boxShadow = isActive
    ? "0 2px 8px rgba(193,124,78,0.35)"
    : "0 1px 3px rgba(0,0,0,0.18)";
  el.style.color = "#FFFFFF";
  el.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  el.style.fontSize = "10px";
  el.style.fontWeight = "600";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.transition =
    "width 120ms ease, height 120ms ease, background-color 120ms ease, box-shadow 120ms ease";
  el.textContent = String(index);
}
