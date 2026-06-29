-- ============================================================
-- 006: Course chapters table + seed data for WIN courses
-- Run AFTER 004_courses.sql
-- ============================================================

-- Chapters within a course
create table if not exists public.course_chapters (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses (id) on delete cascade,

  chapter_num text not null,
  title       text not null,
  description text default '',
  video_url   text,

  sort_order  int default 0,
  published   boolean default true,

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger course_chapters_updated_at
  before update on public.course_chapters
  for each row execute function public.handle_updated_at();

create index idx_course_chapters_course on public.course_chapters (course_id, sort_order);

-- ============================================================
-- Seed courses for the WIN community
-- ============================================================

-- Get the WIN community ID
do $$
declare
  win_id uuid;
  course_intro uuid;
  course_forex uuid;
  course_synth uuid;
begin
  select id into win_id from public.communities where slug = 'win';

  -- Course 1: Introduction to WIN Trading
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'Introduction to WIN Trading',
    'Start your trading journey here. Learn the fundamentals of forex — from registering with a broker to understanding pips, leverage, lot sizes, and how to use MT5 & TradingView.',
    null, 1, true
  ) returning id into course_intro;

  -- Course 2: Hanré's Forex Course
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'Hanré''s Forex Course',
    'Take your trading to the next level with technical analysis. Master candlestick patterns, trendlines, support & resistance, order blocks, fair value gaps, and Fibonacci retracements.',
    null, 2, true
  ) returning id into course_forex;

  -- Course 3: Hanré's Synthetics Course
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'Hanré''s Synthetics Course',
    'Explore the world of synthetic indices trading. From the basics to advanced strategies — learn how to trade volatility indices with confidence.',
    null, 3, true
  ) returning id into course_synth;

  -- ========================================================
  -- Chapters: Introduction to WIN Trading
  -- ========================================================
  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_intro, '1.1',  'Introduction to Win',                          'Welcome & overview of WIN Trading',        'https://youtu.be/M3FKBMtLFAI',  1),
    (course_intro, '1.2',  'How to Register with JP Markets',              'Dashboard setup & broker registration',    'https://youtu.be/piS43eTDNsA',  2),
    (course_intro, '1.3',  'What is Forex Trading',                        'Understanding the forex market',           'https://youtu.be/8zFExpPAv_8',  3),
    (course_intro, '1.4',  'What are Spreads',                             'Bid/ask spreads explained',                'https://youtu.be/d2sd1-kzv-4',  4),
    (course_intro, '1.5',  'Lot Sizes',                                    'Understanding position sizing',            'https://youtu.be/tDt-9oA665o',  5),
    (course_intro, '1.6',  'Leverage',                                     'How leverage works in trading',            'https://youtu.be/NBo0iILFFmE',  6),
    (course_intro, '1.7',  'Take Profit & Stop Loss',                      'Managing risk on every trade',             'https://youtu.be/2xGfBQ-A-I4',  7),
    (course_intro, '1.8',  'Market Orders',                                'Executing trades in the market',           'https://youtu.be/vjYzCWmDuHc',  8),
    (course_intro, '1.9',  'Pips',                                         'Measuring price movement',                 'https://youtu.be/8ayZkaeh7tU',  9),
    (course_intro, '1.10', 'How MT5 Works',                                'Navigating MetaTrader 5',                  'https://youtu.be/54eKLMdNZMw', 10),
    (course_intro, '1.11', 'TradingView',                                  'Charting & analysis platform',             'https://youtu.be/TaP_f9AhjjQ', 11),
    (course_intro, '1.12', 'Real & Demo Accounts',                         'Practice vs live trading',                 'https://youtu.be/p1Xf0HrJsQE', 12);

  -- ========================================================
  -- Chapters: Hanré's Forex Course
  -- ========================================================
  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_forex, '1',  'Candles',               'Reading candlestick charts',        'https://youtu.be/DcpnFbOmT7A',  1),
    (course_forex, '2',  'Patterns',              'Identifying chart patterns',        'https://youtu.be/2eRxD2exvpo',  2),
    (course_forex, '3',  'Trendlines',            'Drawing & trading trendlines',      'https://youtu.be/tq9xjZbTPyQ',  3),
    (course_forex, '4',  'Support & Resistance',  'Key price levels',                  'https://youtu.be/4OZ0QojFp4E',  4),
    (course_forex, '5',  'Retests',               'Confirmation through retests',      'https://youtu.be/LSImmLMmma8',  5),
    (course_forex, '6',  'Example Trades',        'Real trade setups walkthrough',     'https://youtu.be/BV9wsRbDwRI',  6),
    (course_forex, '7',  'Order Blocks',          'Smart money concepts',              'https://youtu.be/pQ0F4VTjz8Y',  7),
    (course_forex, '8',  'Fair Value Gaps',       'Imbalance & liquidity zones',       'https://youtu.be/O1ORrqhUZ6o',  8),
    (course_forex, '9',  'Break of Structure',    'Market structure shifts',           'https://youtu.be/SUOT7gmXF0o',  9),
    (course_forex, '10', 'Fibonacci',             'Fibonacci retracement levels',      'https://youtu.be/8JdlgLTwVLU', 10),
    (course_forex, '11', 'Example Trades',        'Advanced trade examples',           'https://youtu.be/klrX0e4RwMw', 11);

  -- ========================================================
  -- Chapters: Hanré's Synthetics Course
  -- ========================================================
  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_synth, '1', 'The Basics', 'Introduction to synthetic indices', 'https://youtu.be/e8kpztbHn34', 1),
    (course_synth, '2', 'Advanced',   'Advanced synthetics strategies',    'https://youtu.be/yh6b27lz7d8', 2);

end $$;
