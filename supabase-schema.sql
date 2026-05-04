-- ============================================================
-- LinkForge – Supabase Schema
-- Run this in the Supabase SQL editor (Database > SQL Editor)
-- ============================================================

-- 1. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text,
  bio          text,
  avatar_url   text,
  theme        text default 'electric',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 2. Links table
create table public.links (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  url          text not null,
  description  text,
  icon         text,
  position     integer not null default 0,
  active       boolean default true,
  clicks       integer default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 3. Row Level Security
alter table public.profiles enable row level security;
alter table public.links enable row level security;

-- Profiles: anyone can read, only owner can write
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Links: active links are public, owner has full access
create policy "Active links are viewable by everyone"
  on public.links for select using (active = true or auth.uid() = user_id);

create policy "Users can insert their own links"
  on public.links for insert with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on public.links for update using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on public.links for delete using (auth.uid() = user_id);

-- 4. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    -- Default username from email prefix; user can change it
    split_part(new.email, '@', 1),
    split_part(new.email, '@', 1)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Track link clicks via RPC (bypasses RLS for increment)
create or replace function public.increment_link_clicks(link_id uuid)
returns void as $$
  update public.links set clicks = clicks + 1 where id = link_id;
$$ language sql security definer;

-- 6. Indexes
create index links_user_id_idx on public.links(user_id);
create index links_position_idx on public.links(user_id, position);
create unique index profiles_username_idx on public.profiles(lower(username));
