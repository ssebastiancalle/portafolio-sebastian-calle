-- Run this in the Supabase SQL editor after creating your project

-- Albums table
create table albums (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  cover_url  text not null,
  "order"    integer not null default 0,
  created_at timestamptz not null default now()
);

-- Photos table
create table photos (
  id        uuid primary key default gen_random_uuid(),
  album_id  uuid not null references albums(id) on delete cascade,
  url       text not null,
  alt       text not null default '',
  "order"   integer not null default 0
);

-- Indexes
create index photos_album_id_idx on photos(album_id);

-- Row Level Security: public read, no direct write (all writes go through service_role via API)
alter table albums enable row level security;
alter table photos enable row level security;

create policy "Public read albums"  on albums for select using (true);
create policy "Public read photos"  on photos for select using (true);

-- Storage bucket: create via Supabase dashboard or with this snippet
-- Dashboard > Storage > New bucket > name: "photos" > Public: true
insert into storage.buckets (id, name, public) values ('photos', 'photos', true);

-- Allow public read from storage
create policy "Public read storage"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Allow service_role to upload (handled server-side, no extra policy needed)
