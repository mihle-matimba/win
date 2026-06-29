-- ============================================================
-- 009: Seed PST courses for the WIN community
-- Run AFTER 006_seed_courses.sql
-- ============================================================

do $$
declare
  win_id        uuid;
  course_bf     uuid;
  course_af     uuid;
  course_bs     uuid;
  course_as     uuid;
begin
  select id into win_id from public.communities where slug = 'win';

  -- ── Course: PST Basic Forex ─────────────────────────────────
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'PST Basic Forex Course',
    'Build a solid foundation in forex trading. Covers timeframes, trading sessions, market structure, liquidity, premium & discount zones, order blocks, and how to put it all together into a working strategy.',
    null, 4, true
  ) returning id into course_bf;

  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_bf, '1',  'Introduction',               'Welcome to the PST Basic Forex Course',             'https://youtu.be/XCrYRg_91Rg',  1),
    (course_bf, '2',  'Timeframes',                 'How to use multiple timeframes effectively',         'https://youtu.be/5rox21iJVT4',  2),
    (course_bf, '3',  'Sessions',                   'Understanding forex trading sessions',              'https://youtu.be/iwEgqqai0xU',  3),
    (course_bf, '4',  'Highs & Lows',               'Identifying key highs and lows on the chart',       'https://youtu.be/6z-PmrONAQk',  4),
    (course_bf, '5',  'Market Structure',            'Reading and trading market structure',              'https://youtu.be/QQOGt49fQ2M',  5),
    (course_bf, '6',  'Liquidity',                  'Understanding liquidity in the market',              'https://youtu.be/noVwYEoxdYM',  6),
    (course_bf, '7',  'Premium & Discount',          'Trading from premium and discount zones',           'https://youtu.be/XIlGkkGFHwg',  7),
    (course_bf, '8',  'Order Blocks',               'Identifying and trading order blocks',              'https://youtu.be/dkrn49t0olI',  8),
    (course_bf, '9',  'Entries & Exits',             'How to enter and exit trades with precision',       'https://youtu.be/OrCPmCaUwaw',  9),
    (course_bf, '10', 'Putting Everything Together', 'Full strategy walkthrough combining all concepts',  'https://youtu.be/ZJiw9EKoHsM', 10);

  -- ── Course: PST Advance Forex ───────────────────────────────
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'PST Advance Forex Course',
    'Take your forex trading to the next level. Deep dives into fractal timeframes, liquidity sweeps, fair value gaps, inverse FVGs, precise TP/SL placement, and full strategy execution.',
    null, 5, true
  ) returning id into course_af;

  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_af, '1', 'Introduction',              'Welcome to the PST Advance Forex Course',           'https://youtu.be/uvdQqtabxM8', 1),
    (course_af, '2', 'Timeframes "Fractal"',       'Multi-timeframe fractal analysis',                 'https://youtu.be/9YI89RfiJTY', 2),
    (course_af, '3', 'Liquidity Sweeps',           'Identifying and trading liquidity sweeps',          'https://youtu.be/Sv1Q2N7ysG4', 3),
    (course_af, '4', 'Fair Value Gaps',            'Trading FVGs for high-probability entries',         'https://youtu.be/6-aUis7tqTg', 4),
    (course_af, '5', 'Inverse Fair Value Gaps',    'Advanced IFVG concepts and trade setups',           'https://youtu.be/9xAncPnTDrk', 5),
    (course_af, '6', 'TPs and SLs',               'Precise take profit and stop loss placement',       'https://youtu.be/aAUn5o0d_T0', 6),
    (course_af, '7', 'Strategy Video',             'Full strategy demonstration and execution',         'https://youtu.be/L4GedRkkHoQ', 7),
    (course_af, '8', 'Bonus Strategy',             'Bonus trade setup and strategy walkthrough',        'https://youtu.be/ZT89EheOmXo', 8);

  -- ── Course: PST Basic Synthetic ─────────────────────────────
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'PST Basic Synthetic Course',
    'Get started with synthetic indices trading. Learn how to use a broker platform, read timeframes, identify market structure, support & resistance, and execute your first synthetic trades.',
    null, 6, true
  ) returning id into course_bs;

  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_bs, '1', 'Introduction Video',          'Welcome to the PST Basic Synthetic Course',         'https://youtu.be/ZBO_P1PB2tY', 1),
    (course_bs, '2', 'Introduction to Synthetics',  'What are synthetic indices and how they work',      'https://youtu.be/ivFOtMqBkQ4', 2),
    (course_bs, '3', 'Broker and Trading Platform', 'Setting up your broker and trading platform',       'https://youtu.be/F1gvYPS9AyI', 3),
    (course_bs, '4', 'Timeframes',                  'Using timeframes effectively on synthetics',        'https://youtu.be/7lRqXRLSdZU', 4),
    (course_bs, '5', 'Highs and Lows',              'Identifying key highs and lows on synthetics',      'https://youtu.be/-h_4iBua6Dw', 5),
    (course_bs, '6', 'Market Structure',            'Reading market structure on synthetic indices',     'https://youtu.be/G54Lhuk5WSg', 6),
    (course_bs, '7', 'Support and Resistance',      'Key support and resistance levels on synthetics',   'https://youtu.be/0ZkxD6DbZIc', 7),
    (course_bs, '8', 'Entries and Exits',           'Entering and exiting synthetic trades',             'https://youtu.be/62MLOAJnFX4', 8),
    (course_bs, '9', 'Putting Everything Together', 'Full strategy walkthrough for synthetics',          'https://youtu.be/_tODeeTmLk8', 9);

  -- ── Course: PST Advance Synthetic ───────────────────────────
  insert into public.courses (id, community_id, title, description, thumbnail_url, sort_order, published)
  values (
    gen_random_uuid(), win_id,
    'PST Advance Synthetic Course',
    'Advanced synthetic indices strategies. Master order blocks, FVGs, IFVGs, liquidity sweeps, market structure shifts, Fibonacci levels, and precise entries & exits on volatility indices.',
    null, 7, true
  ) returning id into course_as;

  insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order) values
    (course_as, '1', 'Introduction Video',          'Welcome to the PST Advance Synthetic Course',       'https://youtu.be/7LzHcw5J7Nc', 1),
    (course_as, '2', 'Order Blocks',                'Advanced order block concepts on synthetics',        'https://youtu.be/Gl-vbRzZ5aE', 2),
    (course_as, '3', 'FVG & IFVG',                  'Fair value gaps and inverse FVGs on synthetics',    'https://youtu.be/dssWc45U1sM', 3),
    (course_as, '4', 'Liquidity Sweep',             'Trading liquidity sweeps on volatility indices',    'https://youtu.be/UMAOkd9hZf8', 4),
    (course_as, '5', 'Market Structure Shifts',     'Identifying and trading structure shifts',          'https://youtu.be/ZpqvMLaeLW8', 5),
    (course_as, '6', 'Fibonacci',                   'Fibonacci retracement on synthetic indices',        'https://youtu.be/z2_57PvL24Q', 6),
    (course_as, '7', 'Entries & Exits',             'Precise entries and exits on synthetics',           'https://youtu.be/ggRWQkdPaCw', 7),
    (course_as, '8', 'Putting Everything Together', 'Full advanced synthetic strategy walkthrough',      'https://youtu.be/QOjmvfzDhro', 8);

end $$;
