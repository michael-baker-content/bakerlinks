begin;

alter table public.profiles
  add column if not exists background_url text,
  add column if not exists background_attribution jsonb,
  add column if not exists social_links jsonb not null default '[]'::jsonb,
  add column if not exists social_links_position text not null default 'bottom',
  add column if not exists layout text not null default 'card',
  add column if not exists font text not null default 'default',
  add column if not exists custom_theme jsonb,
  add column if not exists about_enabled boolean not null default false,
  add column if not exists about_title text,
  add column if not exists about_content text,
  add column if not exists about_markdown text;

-- Create the public avatars and backgrounds buckets in the Storage dashboard.
-- The app uploads and replaces images under the signed-in user's ID.
drop policy if exists "BakerLinks owners manage their profile images" on storage.objects;
create policy "BakerLinks owners manage their profile images"
  on storage.objects for all to authenticated
  using (
    bucket_id in ('avatars', 'backgrounds')
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id in ('avatars', 'backgrounds')
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

commit;
