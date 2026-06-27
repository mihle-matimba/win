-- ============================================================
-- 003: Trading accounts table
-- Stores broker trading accounts linked by users
-- Run AFTER 002_profiles.sql
-- ============================================================

create table public.accounts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  community_id  uuid not null references public.communities (id) on delete restrict,

  broker        text not null,
  account_number text not null,
  nickname      text default '',

  status        text default 'active' check (status in ('active', 'inactive', 'pending')),
  last_synced   timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger accounts_updated_at
  before update on public.accounts
  for each row execute function public.handle_updated_at();

-- Index for fetching a user's accounts
create index idx_accounts_user on public.accounts (user_id);

-- Prevent duplicate account numbers per broker per user
create unique index idx_accounts_unique on public.accounts (user_id, broker, account_number);
