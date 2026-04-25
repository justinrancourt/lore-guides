"use client";

import { useState } from "react";
import Link from "next/link";
import type { Place } from "@/lib/types";
import { BEST_TIMES, PLACE_TYPES } from "@/lib/types";
import { NavBar } from "@/components/primitives/NavBar";
import { BorderlessInput } from "@/components/primitives/BorderlessInput";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { Toggle } from "@/components/primitives/Toggle";

interface EditPlaceFormProps {
  place: Place;
}

export function EditPlaceForm({ place }: EditPlaceFormProps) {
  const [name, setName] = useState(place.name);
  const [neighborhood, setNeighborhood] = useState(place.neighborhood ?? "");
  const [vibe, setVibe] = useState(place.vibe ?? "");
  const [note, setNote] = useState(place.note ?? "");
  const [bestTime, setBestTime] = useState(place.bestTime ?? null);
  const [type, setType] = useState(place.type ?? null);
  const [tsEnabled, setTsEnabled] = useState(Boolean(place.timeSensitive));
  const [tsText, setTsText] = useState(place.timeSensitive ?? "");

  return (
    <div className="device-column">
      <NavBar
        sticky
        left={
          <Link
            href={`/places/${place.id}`}
            className="font-serif text-[14px] text-faint"
          >
            ✕ Cancel
          </Link>
        }
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            Edit place
          </span>
        }
        right={
          <button
            type="button"
            className="font-serif text-[12px] uppercase text-accent"
            style={{ letterSpacing: "0.14em" }}
          >
            Save
          </button>
        }
      />

      <form className="flex flex-col gap-7 px-5 pb-16 pt-6">
        <Field label="Name">
          <BorderlessInput
            variant="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Neighborhood">
          <BorderlessInput
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </Field>

        <Field label="Vibe — one line">
          <BorderlessInput
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="italic text-[16px]"
          />
        </Field>

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
            minHeight={120}
          />
        </Field>

        <div className="flex flex-col gap-2 border-y border-border py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="m-0 font-serif text-[14px] text-ink">
                Time-sensitive
              </p>
              <p className="m-0 mt-0.5 font-serif italic text-[12px] text-faint">
                Best at a specific time, day, or window
              </p>
            </div>
            <Toggle enabled={tsEnabled} onChange={setTsEnabled} label="Time-sensitive" />
          </div>
          {tsEnabled && (
            <BorderlessInput
              value={tsText}
              onChange={(e) => setTsText(e.target.value)}
              placeholder="Best before 9am"
            />
          )}
        </div>

        <button
          type="button"
          className="m-0 self-start border-0 bg-transparent p-0 font-serif text-[13px] text-faint underline underline-offset-4"
        >
          Delete this place
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block font-serif text-[11px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
