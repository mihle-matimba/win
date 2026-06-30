-- ============================================================
-- Courses: create all tables (self-contained)
-- ============================================================

-- Updated_at helper (no-op if already exists)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Communities
create table if not exists public.communities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  domain        text unique,

  logo_url        text,
  favicon_url     text,
  primary_color   text default '#5b74ff',
  accent_color    text default '#3f8bff',
  bg_color        text default '#060810',
  font_family     text default 'Inter',

  layout          text default 'default' check (layout in ('default', 'minimal', 'pro')),
  enabled_pages   jsonb default '["performance","calendar","journal"]'::jsonb,

  allowed_brokers jsonb default '[]'::jsonb,

  support_email   text,
  email_from      text,
  email_from_name text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_communities_domain on public.communities (domain);

-- Courses
create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references public.communities (id) on delete cascade,

  title         text not null,
  description   text default '',
  content_url   text,
  thumbnail_url text,
  level         text not null default 'beginner'
                  check (level in ('beginner', 'intermediate', 'advanced')),

  sort_order    int default 0,
  published     boolean default false,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger courses_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();

create index idx_courses_community on public.courses (community_id, sort_order);

-- Course chapters
create table public.course_chapters (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses (id) on delete cascade,

  chapter_num text not null,
  title       text not null,
  description text default '',
  video_url   text,

  sort_order  int default 0,
  published   boolean default true,

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger course_chapters_updated_at
  before update on public.course_chapters
  for each row execute function public.handle_updated_at();

create index idx_course_chapters_course on public.course_chapters (course_id, sort_order);

-- Course progress
create table public.course_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  chapter_id   uuid not null references public.course_chapters (id) on delete cascade,

  completed_at timestamptz default now(),

  unique (user_id, chapter_id)
);

create index idx_course_progress_user    on public.course_progress (user_id);
create index idx_course_progress_chapter on public.course_progress (chapter_id);

alter table public.course_progress enable row level security;

create policy "Users can view their own progress"
  on public.course_progress for select
  using (auth.uid() = user_id);

create policy "Users can mark chapters complete"
  on public.course_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can unmark chapters"
  on public.course_progress for delete
  using (auth.uid() = user_id);
