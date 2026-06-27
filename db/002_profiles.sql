-- ============================================================
-- 002: Profiles table
-- Links Supabase Auth users to a community with a role
-- Run AFTER 001_communities.sql
-- ============================================================

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  community_id  uuid not null references public.communities (id) on delete restrict,
  role          text not null default 'member' check (role in ('member', 'admin', 'owner')),

  full_name     text,
  avatar_url    text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Index for fetching all members of a community
create index idx_profiles_community on public.profiles (community_id);

-- Auto-create a profile when a new user signs up via Supabase Auth.
-- The community_id and role come from the user's metadata set during signup.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, community_id, role, full_name, avatar_url)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'community_id')::uuid,
    coalesce(new.raw_user_meta_data ->> 'role', 'member'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
