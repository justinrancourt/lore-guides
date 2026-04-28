import { NextResponse } from "next/server";

// Server-side proxy for Google Places Autocomplete (New). The key stays
// out of the browser bundle, and we use Google's session-token billing
// model so a sequence of keystrokes + one details fetch counts as a
// single billable session. Callers should generate a UUIDv4 once per
// "user starts typing → user picks a result" and pass it on every call.

const ENDPOINT = "https://places.googleapis.com/v1/places:autocomplete";

interface IncomingBody {
  query?: unknown;
  sessionToken?: unknown;
}

export interface AutocompleteSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Places search unavailable — server misconfigured." },
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
  const sessionToken =
    typeof body.sessionToken === "string" ? body.sessionToken : null;

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      input: query,
      ...(sessionToken ? { sessionToken } : {}),
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("Places autocomplete failed", upstream.status, text);
    return NextResponse.json(
      { error: "Places search failed." },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as {
    suggestions?: Array<{
      placePrediction?: {
        placeId?: string;
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
        text?: { text?: string };
      };
    }>;
  };

  const suggestions: AutocompleteSuggestion[] = (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => ({
      placeId: p.placeId!,
      mainText:
        p.structuredFormat?.mainText?.text ?? p.text?.text ?? "Untitled",
      secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
    }));

  return NextResponse.json({ suggestions });
}
