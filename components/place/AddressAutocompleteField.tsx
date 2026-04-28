"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchPlaceDetails,
  searchAutocomplete,
  type Suggestion,
} from "@/lib/places-search";
import { BorderlessInput } from "@/components/primitives/BorderlessInput";
import { Waymark } from "@/components/primitives/Waymark";

interface AddressAutocompleteFieldProps {
  /** Biases the autocomplete query — typically the place's name. */
  prefix: string;
  defaultAddress?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
}

const SEARCH_DEBOUNCE_MS = 220;

// Address field with an inline Google Places dropdown. Typing here
// queries autocomplete with `${prefix} ${typed}` so suggestions are
// biased by the place name. Picking a suggestion fills the visible
// address and emits hidden lat/lng inputs the surrounding <form> picks up.
export function AddressAutocompleteField({
  prefix,
  defaultAddress,
  defaultLat,
  defaultLng,
}: AddressAutocompleteFieldProps) {
  const [address, setAddress] = useState(defaultAddress ?? "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    defaultLat != null && defaultLng != null
      ? { lat: defaultLat, lng: defaultLng }
      : null,
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [pickingId, setPickingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // One UUID per autocomplete session — Google bills the keystrokes +
  // one details fetch as a single search. Reset after each pick.
  const sessionTokenRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    if (!open) return;
    const trimmed = address.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const query = prefix ? `${prefix} ${trimmed}` : trimmed;
        const next = await searchAutocomplete(
          query,
          sessionTokenRef.current,
          controller.signal,
        );
        if (!cancelled) setSuggestions(next);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [address, prefix, open]);

  const handlePick = async (s: Suggestion) => {
    setPickingId(s.placeId);
    try {
      const details = await fetchPlaceDetails(s.placeId, sessionTokenRef.current);
      setAddress(details.address);
      if (details.lat != null && details.lng != null) {
        setCoords({ lat: details.lat, lng: details.lng });
      }
      setSuggestions([]);
      setOpen(false);
      sessionTokenRef.current = crypto.randomUUID();
    } catch {
      // Fall through — keep dropdown open so user can pick another.
    } finally {
      setPickingId(null);
    }
  };

  const showDropdown =
    open && (searching || suggestions.length > 0) && address.trim().length >= 2;

  return (
    <div className="relative">
      <BorderlessInput
        name="address"
        value={address}
        autoComplete="off"
        placeholder="Start typing to search"
        onChange={(e) => {
          setAddress(e.target.value);
          // Typed edits invalidate the previously-picked coords; the
          // user has departed from the Google-resolved address.
          if (coords) setCoords(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        // Delay so onClick on a suggestion fires before we close.
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {coords && (
        <>
          <input type="hidden" name="lat" value={String(coords.lat)} />
          <input type="hidden" name="lng" value={String(coords.lng)} />
        </>
      )}

      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[280px] list-none overflow-y-auto border border-border-bold bg-canvas p-0 shadow-lg">
          {searching && suggestions.length === 0 && (
            <li className="px-3 py-2.5 font-serif italic text-[12px] text-faint">
              Searching…
            </li>
          )}
          {suggestions.map((s) => {
            const loading = pickingId === s.placeId;
            return (
              <li
                key={s.placeId}
                className="border-b border-border-soft last:border-b-0"
              >
                <button
                  type="button"
                  disabled={pickingId !== null}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handlePick(s)}
                  className="flex w-full items-start gap-2.5 bg-transparent px-3 py-2.5 text-left disabled:opacity-50"
                >
                  <Waymark size={12} color="#9C8E7C" />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-serif text-[14px] text-ink">
                      {s.mainText}
                    </p>
                    {s.secondaryText && (
                      <p className="m-0 mt-0.5 font-serif italic text-[11px] text-faint">
                        {s.secondaryText}
                      </p>
                    )}
                  </div>
                  {loading && (
                    <span className="font-serif italic text-[11px] text-faint">
                      …
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
