-- ============================================================
-- 013: Broker clients, linked accounts, and transactions
-- Run in Supabase SQL editor
-- Safe to re-run: handles existing tables and renames old column.
-- ============================================================

-- ── 1. broker_clients ────────────────────────────────────────

create table if not exists public.broker_clients (
  id                   bigint                      not null,
  name                 character varying(255),
  email                character varying(255),
  country              character varying(100),
  account_currency     character varying(10),
  platform             character varying(20),
  server               integer,
  type                 character varying(100),
  conversion_device    character varying(50),
  wallet               bigint,
  balance              numeric(18,2),
  equity               numeric(18,2),
  free_margin          numeric(18,2),
  margin               numeric(18,2),
  commission           numeric(18,2),
  deposits             numeric(18,2),
  withdrawals          numeric(18,2),
  rebates_paid         numeric(18,2),
  rebates_rejected     numeric(18,2),
  rebates_unpaid       numeric(18,2),
  volume               numeric(18,2),
  first_funding        timestamp without time zone,
  first_trade          timestamp without time zone,
  last_trade           timestamp without time zone,
  registration         timestamp without time zone,
  synced_at            timestamp without time zone default now(),

  constraint broker_clients_pkey primary key (id)
) tablespace pg_default;

create index if not exists idx_broker_clients_country      on public.broker_clients using btree (country);
create index if not exists idx_broker_clients_type         on public.broker_clients using btree (type);
create index if not exists idx_broker_clients_registration on public.broker_clients using btree (registration desc);

alter table public.broker_clients enable row level security;


-- ── 2. linked_accounts ───────────────────────────────────────
-- If the table already existed with column named "uuid", rename it to user_id.

do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'linked_accounts'
      and column_name  = 'uuid'
  ) then
    alter table public.linked_accounts rename column "uuid" to user_id;
  end if;
end $$;

-- Create fresh if it doesn't exist yet
create table if not exists public.linked_accounts (
  user_id   uuid   not null references auth.users (id) on delete cascade,
  id        bigint not null references public.broker_clients (id) on delete cascade,
  synced_at timestamp without time zone default now(),

  constraint linked_accounts_pkey primary key (id)
) tablespace pg_default;

-- Ensure user_id FK exists and points to auth.users.
-- Drop and recreate so this block is always idempotent.
alter table public.linked_accounts
  drop constraint if exists linked_accounts_user_id_fkey;

-- Purge any orphaned rows before adding the FK
delete from public.linked_accounts
where user_id not in (select id from auth.users);

alter table public.linked_accounts
  add constraint linked_accounts_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

create index if not exists idx_linked_accounts_user_id on public.linked_accounts using btree (user_id);
create index if not exists idx_linked_accounts_id      on public.linked_accounts using btree (id);

alter table public.linked_accounts enable row level security;

-- Drop policies before recreating (avoids "already exists" errors on re-run)
drop policy if exists "linked_accounts_select" on public.linked_accounts;
drop policy if exists "linked_accounts_insert" on public.linked_accounts;
drop policy if exists "linked_accounts_delete" on public.linked_accounts;
drop policy if exists "broker_clients_read_own" on public.broker_clients;

create policy "linked_accounts_select" on public.linked_accounts
  for select using (auth.uid() = user_id);

create policy "linked_accounts_insert" on public.linked_accounts
  for insert with check (auth.uid() = user_id);

create policy "linked_accounts_delete" on public.linked_accounts
  for delete using (auth.uid() = user_id);

-- Users can read broker_client rows they have linked
create policy "broker_clients_read_own" on public.broker_clients
  for select using (
    exists (
      select 1 from public.linked_accounts la
      where la.id      = broker_clients.id
        and la.user_id = auth.uid()
    )
  );


-- ── 3. transactions ──────────────────────────────────────────

create table if not exists public.transactions (
  order_id             bigint not null,
  account_id           bigint,
  symbol               character varying(50),
  type                 character varying(20),
  volume               numeric(18,2),
  open_price           numeric(18,8),
  close_price          numeric(18,8),
  open_time            timestamp without time zone,
  close_time           timestamp without time zone,
  profit               numeric(18,2),
  commission           numeric(18,2),
  comm_deduction       numeric(18,2),
  rebates              numeric(18,2),
  synced_at            timestamp without time zone default now(),
  notional_volume_usd  numeric(18,2),

  constraint transactions_pkey         primary key (order_id),
  constraint transactions_account_fkey foreign key (account_id) references public.broker_clients (id)
) tablespace pg_default;

create index if not exists idx_transactions_account_id on public.transactions using btree (account_id);
create index if not exists idx_transactions_open_time  on public.transactions using btree (open_time desc);
create index if not exists idx_transactions_synced_at  on public.transactions using btree (synced_at desc);

alter table public.transactions enable row level security;

drop policy if exists "transactions_read_own" on public.transactions;

create policy "transactions_read_own" on public.transactions
  for select using (
    exists (
      select 1 from public.linked_accounts la
      where la.id      = transactions.account_id
        and la.user_id = auth.uid()
    )
  );
