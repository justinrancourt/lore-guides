import { NextResponse } from "next/server";

// Server-side proxy for Google Places Details (New). Called once after
// the user picks an autocomplete suggestion — closes the billing session
// started by /api/places/autocomplete (when sessionToken matches).
//
// FieldMask keeps the response cheap: only the fields we actually use
// land on the wire and count toward the SKU tier.

const FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "shortFormattedAddress",
  "location",
  "addressComponents",
].join(",");

interface IncomingBody {
  placeId?: unknown;
  sessionToken?: unknown;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Places lookup unavailable — server misconfigured." },
      { status: 503 },
    );
  }

  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const placeId = typeof body.placeId === "string" ? body.placeId : "";
  const sessionToken =
    typeof body.sessionToken === "string" ? body.sessionToken : null;

  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId." }, { status: 400 });
  }

  const url = new URL(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
  );
  if (sessionToken) url.searchParams.set("sessionToken", sessionToken);

  const upstream = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("Places details failed", upstream.status, text);
    return NextResponse.json(
      { error: "Could not load place details." },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    shortFormattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    addressComponents?: Array<{
      shortText?: string;
      longText?: string;
      types?: string[];
    }>;
  };

  const lat = data.location?.latitude;
  const lng = data.location?.longitude;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "Place is missing coordinates." },
      { status: 502 },
    );
  }

  // Prefer "neighborhood", then sublocality variants. Google returns
  // these inconsistently per region — picking the first hit is the
  // pragmatic answer.
  const neighborhood = pickComponent(data.addressComponents, [
    "neighborhood",
    "sublocality_level_1",
    "sublocality",
  ]);

  const details: PlaceDetails = {
    placeId: data.id ?? placeId,
    name: data.displayName?.text ?? "Untitled",
    address: data.shortFormattedAddress ?? data.formattedAddress ?? "",
    neighborhood,
    lat,
    lng,
  };

  return NextResponse.json(details);
}

function pickComponent(
  components: Array<{
    shortText?: string;
    longText?: string;
    types?: string[];
  }> | undefined,
  preferredTypes: string[],
): string | null {
  if (!components) return null;
  for (const type of preferredTypes) {
    const hit = components.find((c) => c.types?.includes(type));
    if (hit) return hit.longText ?? hit.shortText ?? null;
  }
  return null;
}
