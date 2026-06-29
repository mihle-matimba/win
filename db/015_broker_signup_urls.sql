-- ============================================================
-- 015: Add signup_url to allowed_brokers for each community
-- Run in Supabase SQL editor
-- Update the signup_url values to match the real broker IB links
-- ============================================================

update public.communities
set allowed_brokers = '[
  {"name": "JP Markets (Pty) Ltd", "logo_url": null, "signup_url": "https://jpmarkets.co.za/register"}
]'::jsonb
where slug = 'win';
