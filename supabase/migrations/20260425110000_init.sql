-- Lore Guides — initial schema, RLS, storage bucket, and profile trigger.
-- Decisions baked in (per Justin, see lib/types.ts):
--   * Type taxonomy: 4 values — Eat / Drink / See / Do
--   * Best time: 4 values — Morning / Afternoon / Evening / Night (no "Any time")
--   * No `day_trip` field — schema and UI both omit it for MVP
--   * Many-to-many places ↔ guides via guide_places join (places-first model)

-- ─── Extensions ──────────────────────────────────────────────────────────
create extension if not exists pgcrypto;
create extension if not exists citext;

-- ─── Profiles ────────────────────────────────────────────────────────────
create table public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  email           citext unique not null,
  display_name    text not null,
  avatar_url      text,
  home_city       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-create a profile row when a new auth.users row appears. Handles
-- both magic-link (where display_name comes from raw_user_meta_data) and
-- the email-only fallback (uses the email's local-part as a placeholder).
create function public.handle_new_user() returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Guides ──────────────────────────────────────────────────────────────
create table public.guides (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references public.profiles on delete cascade,
  title           text not null,
  type            text not null check (type in ('city', 'region', 'trip', 'theme')),
  scope           text,
  city            text,
  country         text,
  slug            text not null unique,
  intro           text,
  color           text not null default '#C17C4E',
  year            text,
  context         text,
  is_public       boolean not null default false,
  is_archived     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index guides_author_id_idx on public.guides (author_id);
create index guides_is_public_idx on public.guides (is_public) where is_public;

-- ─── Places ──────────────────────────────────────────────────────────────
create table public.places (
  id              uuid primary key default gen_random_uuid(),
  created_by      uuid not null references public.profiles on delete cascade,
  google_place_id text,
  name            text not null,
  address         text,
  neighborhood    text,
  lat             double precision,
  lng             double precision,
  best_time       text check (best_time in ('Morning', 'Afternoon', 'Evening', 'Night')),
  type            text check (type in ('Eat', 'Drink', 'See', 'Do')),
  note            text,
  vibe            text,
  time_sensitive  text,
  is_draft        boolean not null default false,
  last_verified   timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index places_created_by_idx on public.places (created_by);
create index places_google_place_id_idx on public.places (google_place_id) where google_place_id is not null;

-- ─── Place photos ────────────────────────────────────────────────────────
create table public.place_photos (
  id              uuid primary key default gen_random_uuid(),
  place_id        uuid not null references public.places on delete cascade,
  storage_path    text not null,
  caption         text,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

create index place_photos_place_id_idx on public.place_photos (place_id);

-- ─── Guide ↔ Place join ─────────────────────────────────────────────────
create table public.guide_places (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid not null references public.guides on delete cascade,
  place_id        uuid not null references public.places on delete cascade,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  unique (guide_id, place_id)
);

create index guide_places_guide_id_idx on public.guide_places (guide_id);
create index guide_places_place_id_idx on public.guide_places (place_id);

-- ─── Saved places (recipient collecting) ─────────────────────────────────
create table public.saved_places (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles on delete cascade,
  place_id        uuid not null references public.places on delete cascade,
  source_guide_id uuid references public.guides on delete set null,
  saved_at        timestamptz not null default now(),
  unique (user_id, place_id)
);

create index saved_places_user_id_idx on public.saved_places (user_id);

-- ─── Guide shares (tracking) ─────────────────────────────────────────────
create table public.guide_shares (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid not null references public.guides on delete cascade,
  shared_at       timestamptz not null default now()
);

create index guide_shares_guide_id_idx on public.guide_shares (guide_id);

-- ─── updated_at trigger ──────────────────────────────────────────────────
create function public.touch_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger guides_touch_updated_at
  before update on public.guides
  for each row execute function public.touch_updated_at();

create trigger places_touch_updated_at
  before update on public.places
  for each row execute function public.touch_updated_at();

-- ─── Row-Level Security ──────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.guides        enable row level security;
alter table public.places        enable row level security;
alter table public.place_photos  enable row level security;
alter table public.guide_places  enable row level security;
alter table public.saved_places  enable row level security;
alter table public.guide_shares  enable row level security;

-- Profiles: anyone authenticated can read (so we can render bylines on
-- public guides); only the owner can update.
create policy profiles_read_authenticated on public.profiles
  for select to authenticated using (true);

create policy profiles_read_anon on public.profiles
  for select to anon using (
    exists (
      select 1 from public.guides g
      where g.author_id = profiles.id and g.is_public
    )
  );

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Guides: author can do everything to their own; anon can read public ones;
-- authenticated users can read public ones too.
create policy guides_owner_all on public.guides
  for all to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy guides_public_read_anon on public.guides
  for select to anon using (is_public);

create policy guides_public_read_auth on public.guides
  for select to authenticated using (is_public);

-- Places: creator owns; anyone can read a place that is in a public guide.
create policy places_owner_all on public.places
  for all to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));

create policy places_public_read on public.places
  for select to anon, authenticated using (
    exists (
      select 1 from public.guide_places gp
      join public.guides g on g.id = gp.guide_id
      where gp.place_id = places.id and g.is_public
    )
  );

-- Place photos: same access pattern as their parent place.
create policy place_photos_owner_all on public.place_photos
  for all to authenticated
  using (
    exists (
      select 1 from public.places p
      where p.id = place_photos.place_id and p.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.places p
      where p.id = place_photos.place_id and p.created_by = (select auth.uid())
    )
  );

create policy place_photos_public_read on public.place_photos
  for select to anon, authenticated using (
    exists (
      select 1 from public.places p
      join public.guide_places gp on gp.place_id = p.id
      join public.guides g on g.id = gp.guide_id
      where p.id = place_photos.place_id and g.is_public
    )
  );

-- Guide ↔ Place: only the guide's author can write; readable to anyone if
-- the guide is public, otherwise only to the author.
create policy guide_places_owner_all on public.guide_places
  for all to authenticated
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_places.guide_id and g.author_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.guides g
      where g.id = guide_places.guide_id and g.author_id = (select auth.uid())
    )
  );

create policy guide_places_public_read on public.guide_places
  for select to anon, authenticated using (
    exists (
      select 1 from public.guides g
      where g.id = guide_places.guide_id and g.is_public
    )
  );

-- Saved places: each user only sees their own.
create policy saved_places_own on public.saved_places
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Guide shares: anyone can insert (a recipient hitting a public URL); only
-- the author can read their own guide's share log.
create policy guide_shares_insert_anyone on public.guide_shares
  for insert to anon, authenticated with check (
    exists (
      select 1 from public.guides g
      where g.id = guide_shares.guide_id and g.is_public
    )
  );

create policy guide_shares_read_author on public.guide_shares
  for select to authenticated using (
    exists (
      select 1 from public.guides g
      where g.id = guide_shares.guide_id and g.author_id = (select auth.uid())
    )
  );

-- ─── Storage bucket for place photos ─────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('place-photos', 'place-photos', false)
  on conflict (id) do nothing;

-- Storage RLS: a user can write into their own folder ({user_id}/...);
-- public reads only happen via signed URLs from the app or the public-photos
-- read policy below for photos belonging to public guides.
create policy "place-photos owner write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'place-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "place-photos owner update" on storage.objects
  for update to authenticated using (
    bucket_id = 'place-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "place-photos owner delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'place-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "place-photos owner read" on storage.objects
  for select to authenticated using (
    bucket_id = 'place-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Public read for photos that belong to a public guide. Joins through
-- place_photos → places → guide_places → guides (is_public).
create policy "place-photos public read" on storage.objects
  for select to anon, authenticated using (
    bucket_id = 'place-photos'
    and exists (
      select 1
      from public.place_photos ph
      join public.guide_places gp on gp.place_id = ph.place_id
      join public.guides g on g.id = gp.guide_id
      where ph.storage_path = storage.objects.name
        and g.is_public
    )
  );
