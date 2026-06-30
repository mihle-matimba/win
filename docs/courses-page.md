# Courses — Database Reference

Run the migration files in order. Each file depends on the one before it.

---

## Migration order

| File | What it does |
|---|---|
| `db/004_courses.sql` | Creates the `courses` table |
| `db/006_seed_courses.sql` | Creates `course_chapters`, seeds WIN courses |
| `db/007_course_progress.sql` | Creates `course_progress` with RLS |
| `db/009_seed_pst_courses.sql` | Seeds PST courses |
| `db/012_courses_level.sql` | Adds `level` column to `courses` |

---

## Tables

### `public.courses`

```sql
create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references public.communities (id) on delete cascade,

  title         text not null,
  description   text default '',
  content_url   text,
  thumbnail_url text,
  level         text not null default 'beginner'
                  check (level in ('beginner', 'intermediate', 'advanced')),

  sort_order    int default 0,
  published     boolean default false,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

- `level` was added in `012_courses_level.sql` — backfilled from title keywords.
- `published = false` hides a course from the page without deleting it.
- `sort_order` controls display order within the grid.

### `public.course_chapters`

```sql
create table public.course_chapters (
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
```

- `chapter_num` is display-only text (e.g. `"1.1"`, `"2"`).
- `video_url` must be a YouTube URL — the page extracts the video ID client-side.
- Chapters default to `published = true` (opposite of courses).

### `public.course_progress`

```sql
create table public.course_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  chapter_id   uuid not null references public.course_chapters (id) on delete cascade,

  completed_at timestamptz default now(),

  unique (user_id, chapter_id)
);
```

RLS policies:

| Policy | Operation | Rule |
|---|---|---|
| Users can view their own progress | SELECT | `auth.uid() = user_id` |
| Users can mark chapters complete | INSERT | `auth.uid() = user_id` |
| Users can unmark chapters | DELETE | `auth.uid() = user_id` |

---

## Indexes

```sql
-- courses
create index idx_courses_community on public.courses (community_id, sort_order);

-- course_chapters
create index idx_course_chapters_course on public.course_chapters (course_id, sort_order);

-- course_progress
create index idx_course_progress_user    on public.course_progress (user_id);
create index idx_course_progress_chapter on public.course_progress (chapter_id);
```

---

## Seeded courses

All seeded courses belong to the community with `slug = 'win'`.

### WIN courses (`006_seed_courses.sql`)

| # | Title | Level | Chapters |
|---|---|---|---|
| 1 | Introduction to WIN Trading | beginner | 12 |
| 2 | Hanré's Forex Course | beginner | 11 |
| 3 | Hanré's Synthetics Course | beginner | 2 |

### PST courses (`009_seed_pst_courses.sql`)

| # | Title | Level | Chapters |
|---|---|---|---|
| 4 | PST Basic Forex Course | beginner | 10 |
| 5 | PST Advance Forex Course | intermediate | 8 |
| 6 | PST Basic Synthetic Course | beginner | 9 |
| 7 | PST Advance Synthetic Course | intermediate | 8 |

---

## Adding a new course

```sql
-- 1. Insert the course
insert into public.courses (community_id, title, description, level, sort_order, published)
values (
  '<community_uuid>',
  'My New Course',
  'Course description here.',
  'beginner',   -- beginner | intermediate | advanced
  10,           -- higher = further down the list
  true
);

-- 2. Insert chapters (replace <course_uuid> with the ID returned above)
insert into public.course_chapters (course_id, chapter_num, title, description, video_url, sort_order)
values
  ('<course_uuid>', '1', 'Chapter title', 'Short description', 'https://youtu.be/<id>', 1),
  ('<course_uuid>', '2', 'Chapter title', 'Short description', 'https://youtu.be/<id>', 2);
```

To hide a course without deleting it: `update public.courses set published = false where id = '<uuid>';`
