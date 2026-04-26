"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";
import { baseSlug } from "@/lib/slug";

// Dev-only seed action. Renders the canonical Valencia guide under the
// current user's account so /g/{user-slug}-valencia is a real shareable
// URL. Gated by the ALLOW_DEV_SEED env flag — production sets this to
// nothing, dev sets it to "true".
//
// Idempotent: if a guide with this slug already exists for the user,
// it is replaced.

interface SeedPlace {
  name: string;
  neighborhood: string;
  best_time: "Morning" | "Afternoon" | "Evening" | "Night";
  type: "Eat" | "Drink" | "See" | "Do";
  note: string;
  vibe: string;
  time_sensitive?: string;
  lat: number;
  lng: number;
}

const VALENCIA_PLACES: SeedPlace[] = [
  {
    name: "La Más Bonita",
    neighborhood: "Malvarrosa Beach",
    best_time: "Morning",
    type: "Eat",
    note: "Walk here before 9am when the beach is empty. Order the fresh orange juice and the tostada con tomate. Sit outside. Watch the Mediterranean do its thing.",
    vibe: "Golden hour breakfast",
    time_sensitive: "Best before 9am",
    lat: 39.4811,
    lng: -0.3294,
  },
  {
    name: "Jardín del Turia",
    neighborhood: "Crosses the city",
    best_time: "Morning",
    type: "Do",
    note: "A river that became the most beautiful urban park in Europe. Rent a bike and ride the full 9km. You'll pass under medieval bridges, through orange groves.",
    vibe: "The soul of the city",
    lat: 39.4769,
    lng: -0.3631,
  },
  {
    name: "Horchatería Daniel",
    neighborhood: "Alboraya",
    best_time: "Afternoon",
    type: "Drink",
    note: "Take the tram to Alboraya. Order horchata and fartons. This is THE horchata — made from tiger nuts grown in the fields you can see from the window.",
    vibe: "A flavor you can't find at home",
    lat: 39.4972,
    lng: -0.3458,
  },
  {
    name: "Mercado Central",
    neighborhood: "Ciutat Vella",
    best_time: "Afternoon",
    type: "See",
    note: "Go on a weekday. Don't eat breakfast first. Wander until something pulls you in. Buy a bag of clementines and eat them on the steps outside.",
    vibe: "Sensory overload in the best way",
    lat: 39.4734,
    lng: -0.3789,
  },
  {
    name: "Bodega Casa Montaña",
    neighborhood: "El Cabanyal",
    best_time: "Evening",
    type: "Drink",
    note: "The oldest bar in Valencia, since 1836. The clóchinas are non-negotiable. So is the vermut on tap. Walk around El Cabanyal before dinner.",
    vibe: "The real thing",
    time_sensitive: "Opens at 7pm",
    lat: 39.4658,
    lng: -0.3261,
  },
  {
    name: "Café de las Horas",
    neighborhood: "El Carmen",
    best_time: "Night",
    type: "Drink",
    note: "Baroque, candlelit, a little dramatic. Order the Agua de Valencia. Go after 10pm when the neighborhood comes alive.",
    vibe: "Where the night begins",
    time_sensitive: "Best after 10pm",
    lat: 39.4779,
    lng: -0.3768,
  },
  {
    name: "Albufera Natural Park",
    neighborhood: "South of the city",
    best_time: "Evening",
    type: "Do",
    note: "This is where paella was born. Take a boat through the wetlands at sunset, then eat arroz in one of the restaurants in El Palmar.",
    vibe: "Where paella comes from",
    lat: 39.3306,
    lng: -0.3500,
  },
];

const VALENCIA_GUIDE = {
  title: "Valencia",
  type: "city" as const,
  scope: "Spain",
  city: "Valencia",
  country: "Spain",
  color: "#C17C4E",
  year: "2019",
  context: "Lived there",
  intro:
    "I lived here for two months in the fall of 2019. Valencia is one of those cities that doesn't try to impress you — it just quietly becomes the best place you've ever been. The light is different. The pace is different. You'll eat better here than almost anywhere in Europe and nobody will rush you.",
};

export interface SeedResult {
  ok: boolean;
  message: string;
  slug?: string;
}

export async function seedValencia(): Promise<SeedResult> {
  if (process.env.ALLOW_DEV_SEED !== "true") {
    return { ok: false, message: "Seeding is disabled in this environment." };
  }

  const profile = await currentProfile();
  if (!profile) return { ok: false, message: "Not signed in." };

  const supabase = await createClient();
  const slug = baseSlug(profile.display_name, VALENCIA_GUIDE.title);

  // Idempotent: drop any existing guide at this slug for this user
  // first. The cascade on guide_places handles the join rows; the
  // places table has no FK back from guides, so seed places get
  // orphaned rather than deleted. Clean those up explicitly by name
  // match (best-effort — only matches places this user owns).
  const { data: existingGuide } = await supabase
    .from("guides")
    .select("id")
    .eq("slug", slug)
    .eq("author_id", profile.id)
    .maybeSingle();

  if (existingGuide) {
    // Find places that were ONLY in this guide and clean them up too,
    // so re-seeding doesn't accumulate duplicates in My Places.
    const { data: linkedPlaces } = await supabase
      .from("guide_places")
      .select("place_id")
      .eq("guide_id", existingGuide.id);
    const placeIds = (linkedPlaces ?? []).map((r) => r.place_id);

    await supabase.from("guides").delete().eq("id", existingGuide.id);

    if (placeIds.length > 0) {
      // Delete the places themselves — they were created by this seed
      // and are no longer in any guide.
      await supabase
        .from("places")
        .delete()
        .in("id", placeIds)
        .eq("created_by", profile.id);
    }
  }

  // Insert the guide.
  const { data: guide, error: guideErr } = await supabase
    .from("guides")
    .insert({
      author_id: profile.id,
      ...VALENCIA_GUIDE,
      slug,
      is_public: true,
    })
    .select("id, slug")
    .single();
  if (guideErr) return { ok: false, message: guideErr.message };

  // Insert places + join rows in one round trip each.
  const { data: places, error: placesErr } = await supabase
    .from("places")
    .insert(
      VALENCIA_PLACES.map((p) => ({
        created_by: profile.id,
        ...p,
        time_sensitive: p.time_sensitive ?? null,
      })),
    )
    .select("id");
  if (placesErr) return { ok: false, message: placesErr.message };

  const { error: linkErr } = await supabase.from("guide_places").insert(
    places.map((p, i) => ({
      guide_id: guide.id,
      place_id: p.id,
      sort_order: i,
    })),
  );
  if (linkErr) return { ok: false, message: linkErr.message };

  revalidatePath("/home");
  revalidatePath("/home/guides");
  revalidatePath(`/guides/${guide.slug}`);
  revalidatePath(`/g/${guide.slug}`);

  return {
    ok: true,
    message: `Seeded /g/${guide.slug}`,
    slug: guide.slug,
  };
}
