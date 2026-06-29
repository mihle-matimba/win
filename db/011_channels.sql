-- ============================================================
-- 011: Channels table — community links shown in the Network sidebar
-- Run in Supabase SQL editor
-- ============================================================

create table if not exists public.channels (
  id           uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,

  name         text not null,          -- Display name, e.g. "Telegram"
  url          text not null,          -- Link opened when clicked
  icon_url     text,                   -- Optional icon/logo image
  sort_order   int  default 0,
  published    boolean default true,

  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create trigger channels_updated_at
  before update on public.channels
  for each row execute function public.handle_updated_at();

create index idx_channels_community on public.channels (community_id, sort_order);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.channels enable row level security;

-- Anyone can read published channels for their community
create policy "channels_read" on public.channels
  for select using (published = true);

-- ── Example seed (edit to match your real links) ─────────────
-- do $$
-- declare win_id uuid;
-- begin
--   select id into win_id from public.communities where slug = 'win';
--   insert into public.channels (community_id, name, url, sort_order) values
--     (win_id, 'Telegram',  'https://t.me/yourgroup',          1),
--     (win_id, 'WhatsApp',  'https://chat.whatsapp.com/xxx',   2),
--     (win_id, 'Discord',   'https://discord.gg/xxx',          3);
-- end $$;
