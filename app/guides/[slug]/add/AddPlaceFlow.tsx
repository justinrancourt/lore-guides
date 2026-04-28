"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BEST_TIMES, PLACE_TYPES, type BestTime, type PlaceType } from "@/lib/types";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { TimeSensitiveField } from "@/components/primitives/TimeSensitiveField";
import { Waymark } from "@/components/primitives/Waymark";
import { FormHeader } from "@/components/author/FormHeader";
import { StagedPhotoStrip } from "@/components/place/StagedPhotoStrip";
import {
  searchAutocomplete,
  fetchPlaceDetails,
  geocodeAddress,
  type Suggestion,
  type PickedPlace,
} from "@/lib/places-search";
import { addPlaceToGuide } from "@/lib/actions/places";
import { uploadPlacePhoto } from "@/lib/photos";
import { attachPhoto } from "@/lib/actions/photos";

type Step = "search" | "annotate" | "manual";

interface AddPlaceFlowProps {
  guideId: string;
  guideSlug: string;
  guideTitle: string;
  userId: string;
}

const SEARCH_DEBOUNCE_MS = 220;

export function AddPlaceFlow({
  guideId,
  guideSlug,
  guideTitle,
  userId,
}: AddPlaceFlowProps) {
  const [step, setStep] = useState<Step>("search");
  const [picked, setPicked] = useState<PickedPlace | null>(null);

  if (step === "search") {
    return (
      <SearchStep
        guideSlug={guideSlug}
        guideTitle={guideTitle}
        onPick={(place) => {
          setPicked(place);
          setStep("annotate");
        }}
        onManual={() => {
          setPicked(null);
          setStep("manual");
        }}
      />
    );
  }

  return (
    <AnnotateStep
      picked={picked}
      guideId={guideId}
      guideTitle={guideTitle}
      userId={userId}
      onBack={() => setStep("search")}
    />
  );
}

interface SearchStepProps {
  guideSlug: string;
  guideTitle: string;
  onPick: (place: PickedPlace) => void;
  onManual: () => void;
}

function SearchStep({ guideSlug, guideTitle, onPick, onManual }: SearchStepProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [pickingId, setPickingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Google's session-token billing model: a stable token across the
  // typing → details fetch counts as one billable session. We mint it
  // once per SearchStep mount and burn it after the user picks a place.
  const sessionTokenRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const next = await searchAutocomplete(
          trimmed,
          sessionTokenRef.current,
          controller.signal,
        );
        if (!cancelled) {
          setResults(next);
          setError(null);
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        if (!cancelled) setError("Search unavailable. Try again in a moment.");
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  // Stale results stay in state when the query is shortened — gate the
  // UI on query length so they don't render until the user types again.
  const showResults = query.trim().length >= 2;

  const handlePick = async (suggestion: Suggestion) => {
    setPickingId(suggestion.placeId);
    setError(null);
    try {
      const details = await fetchPlaceDetails(
        suggestion.placeId,
        sessionTokenRef.current,
      );
      onPick(details);
    } catch {
      setError("Couldn’t load that place. Pick another or add manually.");
      setPickingId(null);
    }
  };

  return (
    <>
      <FormHeader
        left={
          <Link
            href={`/guides/${guideSlug}`}
            className="font-serif text-[14px] text-faint"
          >
            ✕ Cancel
          </Link>
        }
        title={`Add to ${guideTitle}`}
      />
      <div className="mx-auto max-w-[560px] px-5 pb-12 pt-5 sm:px-7">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you adding?"
          className="block w-full border border-border-bold bg-surface px-3.5 py-3 font-serif text-[15px] text-ink placeholder:italic placeholder:text-faint outline-none focus:border-ink"
        />

        {showResults && results.length > 0 && (
          <>
            <p
              className="m-0 mb-2 mt-5 font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Results
            </p>
            <ul className="list-none p-0">
              {results.map((r) => {
                const loading = pickingId === r.placeId;
                return (
                  <li key={r.placeId} className="border-t border-border last:border-b">
                    <button
                      type="button"
                      onClick={() => handlePick(r)}
                      disabled={pickingId !== null}
                      className="flex w-full items-start gap-3 bg-transparent py-3.5 text-left disabled:opacity-50"
                    >
                      <Waymark size={14} color="#9C8E7C" />
                      <div className="min-w-0 flex-1">
                        <p className="m-0 font-serif text-[15px] text-ink">
                          {r.mainText}
                        </p>
                        {r.secondaryText && (
                          <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
                            {r.secondaryText}
                          </p>
                        )}
                      </div>
                      <Icon
                        path={loading ? IconPath.check : IconPath.plus}
                        size={16}
                        color="#C17C4E"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {showResults && searching && results.length === 0 && (
          <p className="mt-10 text-center font-serif italic text-[14px] text-faint">
            Searching…
          </p>
        )}
        {showResults && !searching && results.length === 0 && !error && (
          <p className="mt-10 text-center font-serif italic text-[14px] text-faint">
            No matches. Try a different search, or add it manually.
          </p>
        )}
        {error && (
          <p className="mt-10 text-center font-serif italic text-[14px] text-accent">
            {error}
          </p>
        )}

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onManual}
            className="font-serif italic text-[13px] text-accent"
          >
            Can&rsquo;t find it? Add manually
          </button>
        </div>
      </div>
    </>
  );
}

interface AnnotateStepProps {
  picked: PickedPlace | null;
  guideId: string;
  guideTitle: string;
  userId: string;
  onBack: () => void;
}

// Hand-orchestrated submit: optionally geocode the typed address (manual
// path only) → call addPlaceToGuide → on success, upload any staged
// photos against the new place_id → navigate to the guide.
function AnnotateStep({
  picked,
  guideId,
  guideTitle,
  userId,
  onBack,
}: AnnotateStepProps) {
  const router = useRouter();
  const [bestTime, setBestTime] = useState<BestTime | null>(null);
  const [type, setType] = useState<PlaceType | null>(null);
  const [name, setName] = useState(picked?.name ?? "");
  const [address, setAddress] = useState(picked?.address ?? "");
  const [photos, setPhotos] = useState<File[]>([]);
  const [phase, setPhase] = useState<
    "idle" | "geocoding" | "saving" | "uploading" | "done"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const pending =
    phase === "geocoding" || phase === "saving" || phase === "uploading";

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    // Manual path: best-effort geocode of "name + address" so the place
    // shows up on the map. A miss is non-fatal — we save without coords.
    if (!picked && address.trim().length >= 3) {
      setPhase("geocoding");
      const hit = await geocodeAddress(`${name} ${address}`.trim());
      if (hit) {
        formData.set("lat", String(hit.lat));
        formData.set("lng", String(hit.lng));
      }
    }

    setPhase("saving");
    const result = await addPlaceToGuide({ error: null }, formData);
    if (result.error || !result.placeId || !result.guideSlug) {
      setError(result.error ?? "Could not save place.");
      setPhase("idle");
      return;
    }

    if (photos.length > 0) {
      setPhase("uploading");
      try {
        for (const file of photos) {
          const { storagePath } = await uploadPlacePhoto(
            file,
            userId,
            result.placeId,
          );
          await attachPhoto({ placeId: result.placeId, storagePath });
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? `Saved the place, but photo upload failed: ${e.message}`
            : "Saved the place, but photo upload failed.",
        );
        setPhase("idle");
        return;
      }
    }

    setPhase("done");
    router.push(`/guides/${result.guideSlug}`);
  };

  const buttonLabel =
    phase === "geocoding"
      ? "Locating…"
      : phase === "saving"
        ? "Saving…"
        : phase === "uploading"
          ? `Uploading ${photos.length} ${photos.length === 1 ? "photo" : "photos"}…`
          : phase === "done"
            ? "Done"
            : "Save";

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="guide_id" value={guideId} />
      {picked?.placeId && (
        <input type="hidden" name="google_place_id" value={picked.placeId} />
      )}
      {picked?.lat != null && (
        <input type="hidden" name="lat" value={String(picked.lat)} />
      )}
      {picked?.lng != null && (
        <input type="hidden" name="lng" value={String(picked.lng)} />
      )}
      {bestTime && <input type="hidden" name="best_time" value={bestTime} />}
      {type && <input type="hidden" name="type" value={type} />}

      <FormHeader
        left={
          <button
            type="button"
            onClick={onBack}
            className="font-serif text-[14px] text-faint"
          >
            ← Search
          </button>
        }
        title={`Add to ${guideTitle}`}
        right={
          <button
            type="submit"
            disabled={pending}
            className="font-serif text-[12px] uppercase text-accent disabled:opacity-50"
            style={{ letterSpacing: "0.14em" }}
          >
            {buttonLabel}
          </button>
        }
      />

      <div className="mx-auto max-w-[560px] px-5 pb-16 pt-6 sm:px-7">
        {picked ? (
          <>
            <h1 className="m-0 font-serif text-[26px] text-ink">{picked.name}</h1>
            <input type="hidden" name="name" value={picked.name} />
            {picked.neighborhood && (
              <input
                type="hidden"
                name="neighborhood"
                value={picked.neighborhood}
              />
            )}
            {picked.neighborhood && (
              <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
                {picked.neighborhood}
              </p>
            )}
          </>
        ) : (
          <Field label="Name">
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's it called?"
              className="block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-[26px] text-ink outline-none focus:border-ink"
            />
          </Field>
        )}

        <div className="mt-7 flex flex-col gap-7">
          {!picked && (
            <Field label="Neighborhood">
              <input
                type="text"
                name="neighborhood"
                className="block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-[14px] text-ink outline-none focus:border-ink"
              />
            </Field>
          )}
          <Field label="Address">
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city"
              className="block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-[14px] text-ink outline-none focus:border-ink"
            />
          </Field>
          <Field label="Best time of day">
            <ChipSelect value={bestTime} onChange={setBestTime} options={BEST_TIMES} />
          </Field>
          <Field label="Type">
            <ChipSelect value={type} onChange={setType} options={PLACE_TYPES} />
          </Field>
          <Field label="Vibe — one line · optional">
            <input
              type="text"
              name="vibe"
              placeholder="A line that captures the feeling"
              className="block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif italic text-[15px] text-ink-muted outline-none focus:border-ink"
            />
          </Field>
          <Field label="Photos · optional">
            <StagedPhotoStrip files={photos} onChange={setPhotos} disabled={pending} />
            {photos.length > 0 && (
              <p className="m-0 mt-2 font-serif italic text-[12px] text-faint">
                {photos.length} {photos.length === 1 ? "photo" : "photos"} ready · the first becomes the cover
              </p>
            )}
          </Field>
          <Field label="Your note">
            <NoteTextarea name="note" placeholder="What did you eat, see, feel?" />
          </Field>
          <div className="border-t border-border pt-4">
            <TimeSensitiveField name="time_sensitive" />
          </div>
        </div>

        {error && (
          <p className="mt-5 m-0 font-serif italic text-[13px] text-accent">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block font-serif text-[11px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
