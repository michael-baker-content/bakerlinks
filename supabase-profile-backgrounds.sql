begin;

-- Profiles can select only a curated background ID; no user-supplied video URLs.
alter table public.profiles add column if not exists animated_background text;
alter table public.profiles drop constraint if exists profiles_animated_background_check;
alter table public.profiles add constraint profiles_animated_background_check check (
  animated_background is null or animated_background in (
    'clay-orbits', 'silk-ribbons', 'tidal', 'paper-prism', 'eclipse',
    'cloud-drift', 'forest-mist', 'rain-ripples', 'alpine-air', 'sea-at-dusk'
  )
);

-- Enforce upload quality at Storage, including direct API uploads.
-- Curated videos ship with the app, outside all user-writable buckets.
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'],
    file_size_limit = case when id = 'avatars' then 2097152 else 5242880 end
where id in ('avatars', 'backgrounds');

commit;
