-- ============================================================
-- 001: Communities table
-- Run this FIRST in your Supabase SQL Editor
-- ============================================================

create table public.communities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  domain        text unique,

  -- Branding
  logo_url      text,
  favicon_url   text,
  primary_color text default '#5b74ff',
  accent_color  text default '#3f8bff',
  bg_color      text default '#060810',
  font_family   text default 'Inter',

  -- Layout & navigation
  layout        text default 'default' check (layout in ('default', 'minimal', 'pro')),
  enabled_pages jsonb default '["performance","calendar","journal"]'::jsonb,

  -- Broker restrictions
  allowed_brokers jsonb default '[]'::jsonb,

  -- Email & support
  support_email   text,
  email_from      text,
  email_from_name text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger communities_updated_at
  before update on public.communities
  for each row execute function public.handle_updated_at();

-- Index for domain lookups (this is hit on every page load)
create index idx_communities_domain on public.communities (domain);

-- Seed your initial communities
insert into public.communities (name, slug, domain, support_email, email_from, email_from_name, allowed_brokers) values
  ('WIN',     'win',     null, 'support@win.com',           'noreply@win.com',           'WIN',     '["VT Markets (Pty) Ltd","MetaQuotes Demo","IC Markets","Exness","XM Global","FXCM","Pepperstone","OANDA","IG Markets","FP Markets"]'::jsonb),
  ('MDM',     'mdm',     null, 'support@mdmtraders.com',    'noreply@mdmtraders.com',    'MDM Traders',    '["VT Markets (Pty) Ltd","MetaQuotes Demo"]'::jsonb),
  ('NextGen', 'nextgen', null, 'support@nextgentrading.com','noreply@nextgentrading.com','NextGen Trading', '["IC Markets","Exness"]'::jsonb),
  ('FestX',   'festx',   null, 'support@festx.io',          'noreply@festx.io',          'FestX',   '["VT Markets (Pty) Ltd","IC Markets","Pepperstone"]'::jsonb);
