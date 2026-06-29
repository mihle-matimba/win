-- ============================================================
-- 007: Course progress tracking
-- Tracks which chapters a user has completed
-- Run AFTER 006_seed_courses.sql
-- ============================================================

create table public.course_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  chapter_id  uuid not null references public.course_chapters (id) on delete cascade,

  completed_at timestamptz default now(),

  unique (user_id, chapter_id)
);

create index idx_course_progress_user on public.course_progress (user_id);
create index idx_course_progress_chapter on public.course_progress (chapter_id);

-- RLS: users can only see and manage their own progress
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
