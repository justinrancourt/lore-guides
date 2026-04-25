"use client";

import { useMemo, useState } from "react";
import { BEST_TIMES, PLACE_TYPES, type BestTime, type PlaceType } from "@/lib/types";
import { Icon, IconPath } from "@/components/primitives/Icon";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { Toggle } from "@/components/primitives/Toggle";
import { Waymark } from "@/components/primitives/Waymark";
import { searchPlaces, type SearchResult } from "@/lib/places-search";

type Step = "search" | "annotate";

export function AddPlaceFlow() {
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
        {query.length >= 2 && results.length === 0 && (
          <p className="mt-10 text-center font-serif italic text-[14px] text-faint">
            No matches in our test fixtures. Try &ldquo;coffee&rdquo;,
            &ldquo;Valencia&rdquo;, or &ldquo;Miami&rdquo;.
          </p>
        )}
      </div>
    );
  }

  return picked ? <AnnotateStep picked={picked} onBack={() => setStep("search")} /> : null;
}

function AnnotateStep({
  picked,
  onBack,
}: {
  picked: SearchResult;
  onBack: () => void;
}) {
  const [bestTime, setBestTime] = useState<BestTime | null>(null);
  const [type, setType] = useState<PlaceType | null>(null);
  const [note, setNote] = useState("");
  const [tsEnabled, setTsEnabled] = useState(false);
  const [tsText, setTsText] = useState("");

  return (
    <div className="px-5 pb-24 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 font-serif text-[12px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        ← Search
      </button>
      <h1 className="m-0 font-serif text-[26px] text-ink">{picked.name}</h1>
      <p className="m-0 mt-1 font-serif italic text-[13px] text-faint">
        {picked.neighborhood ? `${picked.neighborhood} · ` : ""}
        {picked.hint}
      </p>

      <div className="mt-7 flex flex-col gap-7">
        <Field label="Best time">
          <ChipSelect value={bestTime} onChange={setBestTime} options={BEST_TIMES} />
        </Field>
        <Field label="Type">
          <ChipSelect value={type} onChange={setType} options={PLACE_TYPES} />
        </Field>
        <Field label="Your note">
          <NoteTextarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you eat, see, feel?"
          />
        </Field>
        <div className="flex flex-col gap-2 border-y border-border py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="m-0 font-serif text-[14px] text-ink">Time-sensitive</p>
              <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
                Best at a specific time, day, or window
              </p>
            </div>
            <Toggle enabled={tsEnabled} onChange={setTsEnabled} label="Time-sensitive" />
          </div>
          {tsEnabled && (
            <input
              type="text"
              value={tsText}
              onChange={(e) => setTsText(e.target.value)}
              placeholder="Best before 9am"
              className="block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-[14px] text-ink outline-none focus:border-ink"
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-bg px-5 pb-5 pt-4">
        <button
          type="button"
          className="block w-full bg-ink py-3 font-serif text-[12px] uppercase text-bg"
          style={{ letterSpacing: "0.14em" }}
        >
          Save place
        </button>
      </div>
    </div>
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
