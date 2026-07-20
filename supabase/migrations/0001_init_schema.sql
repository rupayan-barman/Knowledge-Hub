-- =====================================================
-- KNOWLEDGE HUB — INITIAL SCHEMA
-- Run this in Supabase SQL Editor, or via `supabase db push`
-- =====================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fast fuzzy text search

-- =====================================================
-- CATEGORIES
-- =====================================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon text default 'folder',
  color text default '#00ff9d',
  cover_image_url text,
  sort_order integer not null default 0,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_sort on public.categories (sort_order);

-- =====================================================
-- RESOURCES
-- =====================================================
create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  official_url text not null,
  short_description text not null,
  detailed_description text,
  category_id uuid references public.categories (id) on delete set null,
  tags text[] not null default '{}',
  difficulty_level text check (difficulty_level in ('beginner','intermediate','advanced','expert')),
  learning_type text check (learning_type in ('documentation','video_course','interactive','book','tool','article','community','other')),
  personal_review text,
  advantages text[] not null default '{}',
  disadvantages text[] not null default '{}',
  useful_for text,
  status text not null default 'draft' check (status in ('draft','published','hidden','archived')),
  is_featured boolean not null default false,
  is_pinned boolean not null default false,
  logo_url text,
  screenshot_url text,
  meta_title text,
  meta_description text,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_resources_slug on public.resources (slug);
create index if not exists idx_resources_status on public.resources (status);
create index if not exists idx_resources_category on public.resources (category_id);
create index if not exists idx_resources_pinned on public.resources (is_pinned) where is_pinned = true;
create index if not exists idx_resources_featured on public.resources (is_featured) where is_featured = true;
create index if not exists idx_resources_tags on public.resources using gin (tags);
create index if not exists idx_resources_search on public.resources using gin (
  (name || ' ' || short_description) gin_trgm_ops
);

-- =====================================================
-- PROJECTS
-- =====================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text not null,
  thumbnail_url text,
  technologies text[] not null default '{}',
  status text not null default 'in_progress' check (status in ('planning','in_progress','completed','archived')),
  github_url text,
  live_url text,
  gallery text[] not null default '{}',
  future_improvements text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_featured on public.projects (is_featured) where is_featured = true;

-- =====================================================
-- NOTES
-- =====================================================
create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  content_text text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','hidden','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notes_slug on public.notes (slug);
create index if not exists idx_notes_status on public.notes (status);
create index if not exists idx_notes_search on public.notes using gin (content_text gin_trgm_ops);

-- =====================================================
-- MEDIA ASSETS
-- =====================================================
create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  storage_path text not null,
  public_url text not null,
  mime_type text not null,
  size_bytes integer not null default 0,
  usage_type text not null default 'general' check (usage_type in ('logo','screenshot','category_cover','project_image','general')),
  linked_table text,
  linked_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_linked on public.media_assets (linked_table, linked_id);

-- =====================================================
-- SETTINGS (single row)
-- =====================================================
create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  project_name text not null default 'PROJECT_NAME',
  tagline text,
  homepage_text text,
  logo_url text,
  favicon_url text,
  homepage_banner_url text,
  footer_text text not null default 'Created with ❤️ by Rupayan Barman',
  theme_default text not null default 'dark' check (theme_default in ('dark','light','system')),
  accent_color text not null default '#00ff9d',
  social_links jsonb not null default '{}'::jsonb,
  seo_meta_title text,
  seo_meta_description text,
  seo_keywords text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Ensure only ever one settings row
create unique index if not exists idx_settings_singleton on public.settings ((true));

-- =====================================================
-- ACTIVITY LOG
-- =====================================================
create table if not exists public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  entity_label text,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_created on public.activity_log (created_at desc);

-- =====================================================
-- updated_at TRIGGER FUNCTION
-- =====================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated before update on public.categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_resources_updated on public.resources;
create trigger trg_resources_updated before update on public.resources
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_notes_updated on public.notes;
create trigger trg_notes_updated before update on public.notes
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated before update on public.settings
  for each row execute procedure public.set_updated_at();

-- Seed the single settings row if none exists
insert into public.settings (project_name, footer_text)
select 'PROJECT_NAME', 'Created with ❤️ by Rupayan Barman'
where not exists (select 1 from public.settings);
