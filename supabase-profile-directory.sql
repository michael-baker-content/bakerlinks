begin;

alter table public.profiles
  add column if not exists directory_opt_in boolean not null default false;

create table if not exists public.profile_verifications (
  profile_id uuid primary key references public.profiles(id) on delete cascade
);

alter table public.profile_verifications enable row level security;

revoke all on public.profile_verifications from public, anon, authenticated;
grant select on public.profile_verifications to anon, authenticated;
grant select, insert, delete on public.profile_verifications to service_role;

drop policy if exists "Read verification for opted-in profiles" on public.profile_verifications;
create policy "Read verification for opted-in profiles"
  on public.profile_verifications for select to anon, authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = profile_verifications.profile_id
        and profiles.directory_opt_in
    )
  );

commit;
