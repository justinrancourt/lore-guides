// Client-side fetchers for the Google Places proxy routes. Kept thin —
// the route handlers in /api/places/* own validation, the API key, and
// the upstream call.

export interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface PickedPlace {
  /** null when the user added a place manually (no Google match). */
  placeId: string | null;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
}

export interface GeocodeHit {
  lat: number;
  lng: number;
  address: string;
}

export async function searchAutocomplete(
  query: string,
  sessionToken: string,
  signal?: AbortSignal,
): Promise<Suggestion[]> {
  const res = await fetch("/api/places/autocomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, sessionToken }),
    signal,
  });
  if (!res.ok) throw new Error(`autocomplete: ${res.status}`);
  const data = (await res.json()) as { suggestions?: Suggestion[] };
  return data.suggestions ?? [];
}

export async function fetchPlaceDetails(
  placeId: string,
  sessionToken: string,
): Promise<PickedPlace> {
  const res = await fetch("/api/places/details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId, sessionToken }),
  });
  if (!res.ok) throw new Error(`details: ${res.status}`);
  return (await res.json()) as PickedPlace;
}

export async function geocodeAddress(query: string): Promise<GeocodeHit | null> {
  const res = await fetch("/api/places/geocode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: GeocodeHit | null };
  return data.result ?? null;
}
