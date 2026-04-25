"use client";

import { useActionState, useMemo, useState } from "react";
import { BEST_TIMES, PLACE_TYPES, type BestTime, type PlaceType } from "@/lib/types";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { TimeSensitiveField } from "@/components/primitives/TimeSensitiveField";
import { Waymark } from "@/components/primitives/Waymark";
import { searchPlaces, type SearchResult } from "@/lib/places-search";
import { addPlaceToGuide, type SavePlaceFormState } from "@/lib/actions/places";

type Step = "search" | "annotate" | "manual";

interface AddPlaceFlowProps {
  guideId: string;
}

export function AddPlaceFlow({ guideId }: AddPlaceFlowProps) {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<SearchResult | null>(null);

  const results = useMemo(() => searchPlaces(query), [query]);

  if (step === "search") {
    return (
      <div className="px-5 pb-12 pt-5">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you adding?"
          className="block w-full border border-border-bold bg-surface px-3.5 py-3 font-serif text-[15px] text-ink placeholder:italic placeholder:text-faint outline-none focus:border-ink"
        />
        {results.length > 0 && (
          <>
            <p
              className="m-0 mb-2 mt-5 font-serif text-[11px] uppercase text-faint"
              style={{ letterSpacing: "0.14em" }}
            >
              Results
            </p>
            <ul className="list-none p-0">
              {results.map((r) => (
                <li key={r.id} className="border-t border-border last:border-b">
                  <button
                    type="button"
                    onClick={() => {
                      setPicked(r);
                      setStep("annotate");
                    }}
                    className="flex w-full items-start gap-3 bg-transparent py-3.5 text-left"
                  >
                    <Waymark size={14} color="#9C8E7C" />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 font-serif text-[15px] text-ink">
                        {r.name}
                      </p>
                      <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
                        {r.neighborhood ? `${r.neighborhood} · ` : ""}
                        {r.hint}
                      </p>
                    </div>
                    <Icon path={IconPath.plus} size={16} color="#C17C4E" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setStep("manual");
            }}
            className="font-serif italic text-[13px] text-accent"
          >
            Can&rsquo;t find it? Add manually
          </button>
        </div>
        {query.length >= 2 && results.length === 0 && (
          <p className="mt-10 text-center font-serif italic text-[14px] text-faint">
            No matches in our test fixtures. Try &ldquo;coffee&rdquo;,
            &ldquo;Valencia&rdquo;, or &ldquo;Miami&rdquo;.
          </p>
        )}
      </div>
    );
  }

  return (
    <AnnotateStep
      picked={picked}
      guideId={guideId}
      onBack={() => setStep("search")}
    />
  );
}

function AnnotateStep({
  picked,
  guideId,
  onBack,
}: {
  picked: SearchResult | null;
  guideId: string;
  onBack: () => void;
}) {
  const [bestTime, setBestTime] = useState<BestTime | null>(null);
  const [type, setType] = useState<PlaceType | null>(null);
  const [name, setName] = useState(picked?.name ?? "");

  const [state, action, pending] = useActionState<SavePlaceFormState, FormData>(
    addPlaceToGuide,
    { error: null },
  );

  return (
    <form action={action} className="px-5 pb-24 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 font-serif text-[12px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        ← Search
      </button>

      <input type="hidden" name="guide_id" value={guideId} />
      {picked?.id && <input type="hidden" name="google_place_id" value={picked.id} />}
      {picked?.address && <input type="hidden" name="address" value={picked.address} />}
      {picked?.neighborhood && (
        <input type="hidden" name="neighborhood" value={picked.neighborhood} />
      )}
      {bestTime && <input type="hidden" name="best_time" value={bestTime} />}
      {type && <input type="hidden" name="type" value={type} />}

      {picked ? (
        <>
          <h1 className="m-0 font-serif text-[26px] text-ink">{picked.name}</h1>
          <input type="hidden" name="name" value={picked.name} />
          <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
            {picked.neighborhood ? `${picked.neighborhood} · ` : ""}
            {picked.hint}
          </p>
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
        <Field label="Your note">
          <NoteTextarea
            name="note"
            placeholder="What did you eat, see, feel?"
          />
        </Field>
        <div className="border-t border-border pt-4">
          <TimeSensitiveField name="time_sensitive" />
        </div>
      </div>

      {state.error && (
        <p className="mt-5 m-0 font-serif italic text-[13px] text-accent">
          {state.error}
        </p>
      )}

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-bg px-5 pb-5 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="block w-full bg-ink py-3 font-serif text-[12px] uppercase text-bg disabled:opacity-50"
          style={{ letterSpacing: "0.14em" }}
        >
          {pending ? "Saving…" : "Save place"}
        </button>
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
