// Stubbed places search. Returns mock results matching a query.
// Swapped out for the real Google Places Autocomplete proxy in Phase 2.
//
// Coordinates are real (sourced from public mapping data) so the Mapbox
// placeholder can plot saved fixtures on a real map until Google Places
// starts returning the same shape.

export interface SearchResult {
  id: string; // surrogate; will be replaced with google_place_id later
  name: string;
  address: string;
  neighborhood?: string;
  hint?: string; // category hint shown in the search row
  lat?: number;
  lng?: number;
}

const FIXTURES: SearchResult[] = [
  // ─── Valencia ─────────────────────────────────────────────────────
  { id: "g-1", name: "La Más Bonita", address: "Paseo Marítimo Patacona 11, Valencia", neighborhood: "Malvarrosa Beach", hint: "Cafe", lat: 39.4811, lng: -0.3294 },
  { id: "g-2", name: "Mercado Central", address: "Plaza Ciudad de Brujas, Valencia", neighborhood: "Ciutat Vella", hint: "Market", lat: 39.4734, lng: -0.3789 },
  { id: "g-3", name: "Bodega Casa Montaña", address: "Carrer de Josep Benlliure 69, Valencia", neighborhood: "El Cabanyal", hint: "Bar", lat: 39.4658, lng: -0.3261 },
  { id: "g-4", name: "Café de las Horas", address: "Carrer del Comte d'Almodòvar 1, Valencia", neighborhood: "El Carmen", hint: "Bar", lat: 39.4779, lng: -0.3768 },
  // ─── New York ─────────────────────────────────────────────────────
  { id: "g-5", name: "Joe & The Juice", address: "37 W 17th St, New York", neighborhood: "Chelsea", hint: "Cafe", lat: 40.7396, lng: -73.9938 },
  { id: "g-6", name: "Carbone", address: "181 Thompson St, New York", neighborhood: "Greenwich Village", hint: "Restaurant", lat: 40.7274, lng: -74.0008 },
  { id: "g-7", name: "Smorgasburg Williamsburg", address: "90 Kent Ave, Brooklyn", neighborhood: "Williamsburg", hint: "Market", lat: 40.7218, lng: -73.9626 },
  { id: "g-8", name: "Coffee Project NY", address: "239 E 5th St, New York", neighborhood: "East Village", hint: "Cafe", lat: 40.7280, lng: -73.9851 },
  // ─── South Florida ────────────────────────────────────────────────
  { id: "g-9", name: "Vizcaya Museum & Gardens", address: "3251 S Miami Ave", neighborhood: "Coconut Grove", hint: "Museum", lat: 25.7449, lng: -80.2106 },
  { id: "g-10", name: "Robert Is Here", address: "19200 SW 344th St, Homestead", neighborhood: "South Florida", hint: "Fruit stand", lat: 25.4753, lng: -80.4935 },
  { id: "g-11", name: "The Anchor", address: "Mile Marker 84.5, Islamorada, FL", neighborhood: "Florida Keys", hint: "Bar", lat: 24.9333, lng: -80.6181 },
  { id: "g-12", name: "Bakan", address: "2801 NW 2nd Ave, Miami", neighborhood: "Wynwood", hint: "Restaurant", lat: 25.8021, lng: -80.1980 },
  // ─── San Francisco ────────────────────────────────────────────────
  { id: "g-13", name: "Blue Bottle Coffee", address: "1 Ferry Building, San Francisco", neighborhood: "Embarcadero", hint: "Cafe", lat: 37.7956, lng: -122.3933 },
  { id: "g-14", name: "Tartine Bakery", address: "600 Guerrero St, San Francisco", neighborhood: "Mission", hint: "Bakery", lat: 37.7615, lng: -122.4241 },
  // ─── Lisbon ───────────────────────────────────────────────────────
  { id: "g-15", name: "Time Out Market Lisboa", address: "Av. 24 de Julho 49, Lisbon", neighborhood: "Cais do Sodré", hint: "Market", lat: 38.7068, lng: -9.1456 },
  { id: "g-16", name: "Café A Brasileira", address: "R. Garrett 120, Lisbon", neighborhood: "Chiado", hint: "Cafe", lat: 38.7106, lng: -9.1422 },
];

export function searchPlaces(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return FIXTURES.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.neighborhood?.toLowerCase().includes(q) ||
      r.hint?.toLowerCase().includes(q),
  ).slice(0, 8);
}
