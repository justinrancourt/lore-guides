// Stubbed places search for M1. Returns mock results matching a query.
// Swapped out for the real Google Places Autocomplete proxy in M3.

export interface SearchResult {
  id: string; // surrogate; will be replaced with google_place_id later
  name: string;
  address: string;
  neighborhood?: string;
  hint?: string; // category hint shown in the search row
}

const FIXTURES: SearchResult[] = [
  { id: "g-1", name: "La Más Bonita", address: "Paseo Marítimo Patacona 11, Valencia", neighborhood: "Malvarrosa Beach", hint: "Cafe" },
  { id: "g-2", name: "Mercado Central", address: "Plaza Ciudad de Brujas, Valencia", neighborhood: "Ciutat Vella", hint: "Market" },
  { id: "g-3", name: "Bodega Casa Montaña", address: "Carrer de Josep Benlliure 69, Valencia", neighborhood: "El Cabanyal", hint: "Bar" },
  { id: "g-4", name: "Café de las Horas", address: "Carrer del Comte d'Almodòvar 1, Valencia", neighborhood: "El Carmen", hint: "Bar" },
  { id: "g-5", name: "Joe & The Juice", address: "37 W 17th St, New York", neighborhood: "Chelsea", hint: "Cafe" },
  { id: "g-6", name: "Carbone", address: "181 Thompson St, New York", neighborhood: "Greenwich Village", hint: "Restaurant" },
  { id: "g-7", name: "Smorgasburg Williamsburg", address: "90 Kent Ave, Brooklyn", neighborhood: "Williamsburg", hint: "Market" },
  { id: "g-8", name: "Coffee Project NY", address: "239 E 5th St, New York", neighborhood: "East Village", hint: "Cafe" },
  { id: "g-9", name: "Vizcaya Museum & Gardens", address: "3251 S Miami Ave", neighborhood: "Coconut Grove", hint: "Museum" },
  { id: "g-10", name: "Robert Is Here", address: "19200 SW 344th St, Homestead", neighborhood: "South Florida", hint: "Fruit stand" },
  { id: "g-11", name: "The Anchor", address: "Mile Marker 84.5, Islamorada, FL", neighborhood: "Florida Keys", hint: "Bar" },
  { id: "g-12", name: "Bakan", address: "2801 NW 2nd Ave, Miami", neighborhood: "Wynwood", hint: "Restaurant" },
  { id: "g-13", name: "Blue Bottle Coffee", address: "1 Ferry Building, San Francisco", neighborhood: "Embarcadero", hint: "Cafe" },
  { id: "g-14", name: "Tartine Bakery", address: "600 Guerrero St, San Francisco", neighborhood: "Mission", hint: "Bakery" },
  { id: "g-15", name: "Time Out Market Lisboa", address: "Av. 24 de Julho 49, Lisbon", neighborhood: "Cais do Sodré", hint: "Market" },
  { id: "g-16", name: "Café A Brasileira", address: "R. Garrett 120, Lisbon", neighborhood: "Chiado", hint: "Cafe" },
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
