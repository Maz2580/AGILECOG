-- ============================================
-- AGILECOG — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- PROJECTS
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  subtitle    text,
  category    text not null,
  location    text not null,
  year        int not null,
  description text,
  story       text,
  cover_url   text,
  images      text[] default '{}',
  featured    boolean default false,
  published   boolean default false,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ENQUIRIES (from contact form)
create table if not exists enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  project_type text,
  message      text not null,
  status       text default 'new',
  created_at   timestamptz default now()
);

-- SITE SETTINGS (key-value)
create table if not exists settings (
  key   text primary key,
  value text
);

-- Default settings
insert into settings (key, value) values
  ('hero_tagline', 'Architecture That Defines Tomorrow.'),
  ('hero_sub', 'We design spaces that transcend function — environments that inspire, endure, and become woven into the human story.'),
  ('studio_email', 'hello@agilecog.fyi'),
  ('studio_phone', ''),
  ('studio_address', ''),
  ('instagram', ''),
  ('linkedin', '')
on conflict (key) do nothing;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table projects enable row level security;
alter table enquiries enable row level security;
alter table settings enable row level security;

-- Projects: public can view published, authenticated can do everything
create policy "Public can view published projects"
  on projects for select using (published = true);

create policy "Authenticated can do everything on projects"
  on projects for all using (auth.role() = 'authenticated');

-- Enquiries: anyone can insert (contact form), authenticated can manage
create policy "Anyone can insert enquiries"
  on enquiries for insert with check (true);

create policy "Authenticated can manage enquiries"
  on enquiries for all using (auth.role() = 'authenticated');

-- Settings: public can read, authenticated can update
create policy "Public can read settings"
  on settings for select using (true);

create policy "Authenticated can manage settings"
  on settings for all using (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKET
-- ============================================

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Allow public to view images
create policy "Public can view project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Allow authenticated users to upload images
create policy "Authenticated can upload project images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete images
create policy "Authenticated can delete project images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');
