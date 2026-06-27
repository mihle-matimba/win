-- ============================================================
-- 005: Row Level Security policies
-- Run LAST after all tables are created
-- ============================================================

-- Enable RLS on all tables
alter table public.communities enable row level security;
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.courses enable row level security;

-- Helper: get the current user's community_id
create or replace function public.user_community_id()
returns uuid as $$
  select community_id from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper: get the current user's role
create or replace function public.user_role()
returns text as $$
  select role from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- ──────────────────────────────────────────────
-- COMMUNITIES
-- ──────────────────────────────────────────────

-- Anyone can read their own community's config (needed on page load)
create policy "Users can read own community"
  on public.communities for select
  using (id = public.user_community_id());

-- Allow unauthenticated domain lookups (needed before login for theming)
create policy "Anyone can lookup community by domain"
  on public.communities for select
  using (domain is not null);

-- Only owners/admins can update their community
create policy "Owners can update own community"
  on public.communities for update
  using (
    id = public.user_community_id()
    and public.user_role() in ('owner', 'admin')
  );

-- ──────────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────────

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

-- Users can update their own profile (name, avatar)
create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and community_id = public.user_community_id()  -- can't switch community
    and role = (select role from public.profiles where id = auth.uid())  -- can't change own role
  );

-- Owners/admins can read all profiles in their community (for member management)
create policy "Owners can read community profiles"
  on public.profiles for select
  using (
    community_id = public.user_community_id()
    and public.user_role() in ('owner', 'admin')
  );

-- Owners can update roles of members in their community (but not themselves)
create policy "Owners can update member roles"
  on public.profiles for update
  using (
    community_id = public.user_community_id()
    and public.user_role() = 'owner'
    and id != auth.uid()
  );

-- Profile creation is handled by the trigger (security definer), not client-side
-- No insert policy needed

-- ──────────────────────────────────────────────
-- ACCOUNTS (trading accounts)
-- ──────────────────────────────────────────────

-- Users can read their own trading accounts
create policy "Users can read own accounts"
  on public.accounts for select
  using (user_id = auth.uid());

-- Users can add accounts (must be their own, scoped to their community)
create policy "Users can add accounts"
  on public.accounts for insert
  with check (
    user_id = auth.uid()
    and community_id = public.user_community_id()
  );

-- Users can update their own accounts (nickname, status)
create policy "Users can update own accounts"
  on public.accounts for update
  using (user_id = auth.uid());

-- Users can delete their own accounts
create policy "Users can delete own accounts"
  on public.accounts for delete
  using (user_id = auth.uid());

-- ──────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────

-- Members can read published courses in their community
create policy "Members can read published courses"
  on public.courses for select
  using (
    community_id = public.user_community_id()
    and published = true
  );

-- Owners/admins can read ALL courses in their community (including drafts)
create policy "Owners can read all community courses"
  on public.courses for select
  using (
    community_id = public.user_community_id()
    and public.user_role() in ('owner', 'admin')
  );

-- Owners/admins can create courses for their community
create policy "Owners can create courses"
  on public.courses for insert
  with check (
    community_id = public.user_community_id()
    and public.user_role() in ('owner', 'admin')
  );

-- Owners/admins can update courses in their community
create policy "Owners can update courses"
  on public.courses for update
  using (
    community_id = public.user_community_id()
    and public.user_role() in ('owner', 'admin')
  );

-- Owners/admins can delete courses in their community
create policy "Owners can delete courses"
  on public.courses for delete
  using (
    community_id = public.user_community_id()
    and public.user_role() in ('owner', 'admin')
  );
