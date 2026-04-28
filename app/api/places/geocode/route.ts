import { NextResponse } from "next/server";

// Geocode-by-text fallback for the "Add manually" path. Uses Places API
// (New) Text Search rather than the legacy Geocoding API so we only ask
// the user to enable one Google service. Returns the first hit's coords
// or null when nothing matches.

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = "places.location,places.formattedAddress";

interface IncomingBody {
  query?: unknown;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  address: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Geocoding unavailable — server misconfigured." },
      { status: 503 },
    );
  }

  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (query.length < 3) {
    return NextResponse.json({ result: null });
  }

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query, pageSize: 1 }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("Places geocode failed", upstream.status, text);
    return NextResponse.json({ error: "Geocoding failed." }, { status: 502 });
  }

  const data = (await upstream.json()) as {
    places?: Array<{
      formattedAddress?: string;
      location?: { latitude?: number; longitude?: number };
    }>;
  };

  const first = data.places?.[0];
  const lat = first?.location?.latitude;
  const lng = first?.location?.longitude;
  if (!first || typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ result: null });
  }

  const result: GeocodeResult = {
    lat,
    lng,
    address: first.formattedAddress ?? "",
  };
  return NextResponse.json({ result });
}
