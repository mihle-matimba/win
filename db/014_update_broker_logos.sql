-- ============================================================
-- 014: Update allowed_brokers to object format with logo_url
-- Changes WIN community to only allow JP Markets
-- Run in Supabase SQL editor
-- ============================================================

-- WIN — JP Markets only
update public.communities
set allowed_brokers = '[
  {"name": "JP Markets (Pty) Ltd", "logo_url": null}
]'::jsonb
where slug = 'win';

-- To add a logo URL later, run:
-- update public.communities
-- set allowed_brokers = '[
--   {"name": "JP Markets (Pty) Ltd", "logo_url": "https://your-logo-url.png"}
-- ]'::jsonb
-- where slug = 'win';
