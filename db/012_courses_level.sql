-- ============================================================
-- 012: Add level column to courses table
-- Run in Supabase SQL editor
-- ============================================================

alter table public.courses
  add column if not exists level text not null default 'beginner'
  check (level in ('beginner', 'intermediate', 'advanced'));

-- Back-fill levels based on title keywords
update public.courses set level = 'intermediate'
  where lower(title) like '%advance%' or lower(title) like '%intermediate%';

update public.courses set level = 'advanced'
  where lower(title) like '%expert%' or lower(title) like '%master%';

-- Ensure basic courses stay as beginner (already default, but explicit)
update public.courses set level = 'beginner'
  where lower(title) like '%basic%';
