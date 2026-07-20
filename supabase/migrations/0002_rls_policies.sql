-- =====================================================
-- ROW LEVEL SECURITY
-- Model: single Owner account (matched by auth.uid()), everyone else
-- is an anonymous Visitor limited to reading published content.
-- =====================================================

alter table public.categories enable row level security;
alter table public.resources enable row level security;
alter table public.projects enable row level security;
alter table public.notes enable row level security;
alter table public.media_assets enable row level security;
alter table public.settings enable row level security;
alter table public.activity_log enable row level security;

-- Helper: is the current request authenticated at all?
-- Since this app only ever creates ONE user (the Owner), any authenticated
-- session is the Owner. No separate roles table is needed.
create or replace function public.is_owner()
returns boolean as $$
  select auth.uid() is not null;
$$ language sql stable;

-- ---------- CATEGORIES ----------
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  using (is_hidden = false or public.is_owner());

drop policy if exists "categories_owner_write" on public.categories;
create policy "categories_owner_write"
  on public.categories for all
  using (public.is_owner())
  with check (public.is_owner());

-- ---------- RESOURCES ----------
drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read"
  on public.resources for select
  using (status = 'published' or public.is_owner());

drop policy if exists "resources_owner_write" on public.resources;
create policy "resources_owner_write"
  on public.resources for all
  using (public.is_owner())
  with check (public.is_owner());

-- ---------- PROJECTS ----------
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
  on public.projects for select
  using (status <> 'archived' or public.is_owner());

drop policy if exists "projects_owner_write" on public.projects;
create policy "projects_owner_write"
  on public.projects for all
  using (public.is_owner())
  with check (public.is_owner());

-- ---------- NOTES ----------
drop policy if exists "notes_public_read" on public.notes;
create policy "notes_public_read"
  on public.notes for select
  using (status = 'published' or public.is_owner());

drop policy if exists "notes_owner_write" on public.notes;
create policy "notes_owner_write"
  on public.notes for all
  using (public.is_owner())
  with check (public.is_owner());

-- ---------- MEDIA ASSETS (owner only, never public-writable) ----------
drop policy if exists "media_public_read" on public.media_assets;
create policy "media_public_read"
  on public.media_assets for select
  using (true);

drop policy if exists "media_owner_write" on public.media_assets;
create policy "media_owner_write"
  on public.media_assets for all
  using (public.is_owner())
  with check (public.is_owner());

-- ---------- SETTINGS (public read, owner write) ----------
drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read"
  on public.settings for select
  using (true);

drop policy if exists "settings_owner_write" on public.settings;
create policy "settings_owner_write"
  on public.settings for update
  using (public.is_owner())
  with check (public.is_owner());

-- ---------- ACTIVITY LOG (owner only) ----------
drop policy if exists "activity_owner_read" on public.activity_log;
create policy "activity_owner_read"
  on public.activity_log for select
  using (public.is_owner());

drop policy if exists "activity_owner_write" on public.activity_log;
create policy "activity_owner_write"
  on public.activity_log for insert
  with check (public.is_owner());
