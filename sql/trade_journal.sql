-- Trade journal entries: one row per (user, account, order)
create table if not exists trade_journal (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  account_id   text not null,
  order_id     text not null,
  stars        smallint check (stars between 0 and 5) default 0,
  notes        text default '',
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),

  unique (user_id, account_id, order_id)
);

-- Row-level security: users can only read/write their own entries
alter table trade_journal enable row level security;

create policy "owner access" on trade_journal
  for all using (auth.uid() = user_id);

-- Index for fast lookups by account
create index if not exists trade_journal_account_idx on trade_journal (user_id, account_id);
