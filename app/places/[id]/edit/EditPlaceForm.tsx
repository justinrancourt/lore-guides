"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { BEST_TIMES, PLACE_TYPES } from "@/lib/types";
import type { BestTime, PlaceType } from "@/lib/types";
import type { PlaceWithGuidesAndPhotos } from "@/lib/db/places";
import { editPlace, deletePlace, type SavePlaceFormState } from "@/lib/actions/places";
import { NavBar } from "@/components/primitives/NavBar";
import { BorderlessInput } from "@/components/primitives/BorderlessInput";
import { NoteTextarea } from "@/components/primitives/NoteTextarea";
import { ChipSelect } from "@/components/primitives/ChipSelect";
import { TimeSensitiveField } from "@/components/primitives/TimeSensitiveField";
import { PhotoStripEditor } from "@/components/place/PhotoStripEditor";

interface EditPlaceFormProps {
  place: PlaceWithGuidesAndPhotos;
}

export function EditPlaceForm({ place }: EditPlaceFormProps) {
  const [bestTime, setBestTime] = useState<BestTime | null>(
    (place.best_time as BestTime | null) ?? null,
  );
  const [type, setType] = useState<PlaceType | null>(
    (place.type as PlaceType | null) ?? null,
  );

  const boundEdit = editPlace.bind(null, place.id);
  const [state, action, pending] = useActionState<SavePlaceFormState, FormData>(
    boundEdit,
    { error: null },
  );

  const handleDelete = async () => {
    if (!confirm("Delete this place? It'll be removed from every guide.")) {
      return;
    }
    await deletePlace(place.id);
  };

  return (
    <div className="device-column">
      <form action={action}>
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
              type="submit"
              disabled={pending}
              className="font-serif text-[12px] uppercase text-accent disabled:opacity-50"
              style={{ letterSpacing: "0.14em" }}
            >
              {pending ? "Saving…" : "Save"}
            </button>
          }
        />

        {/* Hidden inputs reflect the controlled chip state. The TimeSensitive-
            Field manages its own enabled flag + value. */}
        {bestTime && <input type="hidden" name="best_time" value={bestTime} />}
        {type && <input type="hidden" name="type" value={type} />}

        <div className="flex flex-col gap-7 px-5 pb-16 pt-6">
          <Field label="Name">
            <BorderlessInput
              variant="name"
              name="name"
              defaultValue={place.name}
              required
            />
          </Field>

          <Field label="Neighborhood">
            <BorderlessInput
              name="neighborhood"
              defaultValue={place.neighborhood ?? ""}
            />
          </Field>

          <Field label="Address">
            <BorderlessInput
              name="address"
              defaultValue={place.address ?? ""}
            />
          </Field>

          <Field label="Photos">
            <PhotoStripEditor
              placeId={place.id}
              userId={place.created_by}
              photos={place.photos}
            />
            <p className="m-0 mt-2 font-serif italic text-[12px] text-faint">
              The first photo is the cover. Tap another to promote it.
            </p>
          </Field>

          <Field label="Vibe — one line">
            <BorderlessInput
              name="vibe"
              defaultValue={place.vibe ?? ""}
              className="italic text-[16px]"
            />
          </Field>

          <Field label="Best time of day">
            <ChipSelect value={bestTime} onChange={setBestTime} options={BEST_TIMES} />
            <p className="m-0 mt-1.5 font-serif italic text-[12px] text-faint">
              The bucket recipients filter by on the guide view.
            </p>
          </Field>

          <Field label="Type">
            <ChipSelect value={type} onChange={setType} options={PLACE_TYPES} />
          </Field>

          <Field label="Your note">
            <NoteTextarea
              name="note"
              defaultValue={place.note ?? ""}
              placeholder="What did you eat, see, feel?"
              minHeight={120}
            />
          </Field>

          <div className="border-t border-border pt-4">
            <TimeSensitiveField
              name="time_sensitive"
              defaultValue={place.time_sensitive ?? ""}
            />
          </div>

          {state.error && (
            <p className="m-0 font-serif italic text-[13px] text-accent">
              {state.error}
            </p>
          )}
        </div>
      </form>

      <button
        type="button"
        onClick={handleDelete}
        className="mx-5 mb-10 self-start border-0 bg-transparent p-0 font-serif text-[13px] text-faint underline underline-offset-4"
      >
        Delete this place
      </button>
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
