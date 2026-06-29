-- ============================================================
-- 010: Seed Hanré's Synthetics Course for the WIN community
-- Run in Supabase SQL editor
-- NOTE: If the course already exists from 006, this will add
--       a second copy — delete the old one first if needed.
-- ============================================================

do $$
declare
  win_id       uuid;
  course_synth uuid;
begin
  select id into win_id from public.communities where slug = 'win';

  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published, level)
  values (
    gen_random_uuid(), win_id,
    'Hanré''s Synthetics Course',
    'Explore the world of synthetic indices trading with Hanré. From the basics of volatility indices to advanced strategies — learn how to trade synthetics with confidence.',
    null, 3, true, 'intermediate'
  ) returning id into course_synth;

  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_synth, '1', 'The Basics', 'Introduction to synthetic indices trading', 'https://youtu.be/e8kpztbHn34', 1),
    (course_synth, '2', 'Advanced',   'Advanced synthetic indices strategies',     'https://youtu.be/yh6b27lz7d8', 2);

end $$;
