-- ============================================================
-- 004: Courses table
-- Community-scoped courses managed by owners
-- Run AFTER 001_communities.sql
-- ============================================================

create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references public.communities (id) on delete cascade,

  title         text not null,
  description   text default '',
  content_url   text,
  thumbnail_url text,

  sort_order    int default 0,
  published     boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger courses_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();

-- Index for fetching a community's courses in order
create index idx_courses_community on public.courses (community_id, sort_order);
