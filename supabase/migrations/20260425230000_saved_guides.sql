-- Whole-guide saves. Distinct from saved_places (which tracks individual
-- places a recipient has bookmarked from a public guide). A row here
-- means "this user explicitly saved this guide as a whole" — it's what
-- powers the "Shared with me" section in the author sidebar.
--
-- A user can save:
--   * Their own guide (rare but harmless — RLS lets it through)
--   * Anyone's public guide
-- We don't enforce "only public" at insert time; the read RLS already
-- gates which guides anyone can see, so an unprivileged user couldn't
-- have learned the guide_id in the first place.

create table public.saved_guides (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles on delete cascade,
  guide_id    uuid not null references public.guides on delete cascade,
  saved_at    timestamptz not null default now(),
  unique (user_id, guide_id)
);

create index saved_guides_user_id_idx on public.saved_guides (user_id);

alter table public.saved_guides enable row level security;

-- Each user can only read/write their own row. Inserts are gated by
-- the with check; the existing guides_public_read_auth policy means
-- the user couldn't have discovered a private guide_id without owning
-- it, so a tighter "only public guides" check here would be redundant.
create policy saved_guides_own on public.saved_guides
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
