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

-- Themes (parent of courses)
create table if not exists public.themes (
  code            text not null,
  name            text not null,
  is_active       boolean not null default true,
  id              uuid not null default gen_random_uuid(),
  datecreated     timestamptz default now(),
  datemodified    timestamptz default now(),
  brokername      text,
  brokerurl       text,
  brokerapikey1   text,
  brokerapikey2   text,
  shelllogourl    text,
  shelllogotext   text,
  communitytext   text,
  constraint themes_pkey primary key (code),
  constraint themes_id_key unique (id)
);

create index if not exists themes_code_idx on public.themes using btree (code);

-- Courses
create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  theme_code    text not null references public.themes (code) on delete cascade,

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

create index idx_courses_theme on public.courses (theme_code, sort_order);

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
