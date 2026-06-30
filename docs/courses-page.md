# Courses Page

`app/courses.html` — the learning hub where members browse and work through courses.

---

## Overview

The page has two views that swap in place:

| View | Element ID | Shown when |
|---|---|---|
| Grid | `#gridView` | Default / after closing a course |
| Detail | `#detailView` | A course card is clicked |

---

## Grid View

### Header stats

Three stat cards in the top-right corner update after data loads:

| Stat | ID | Value |
|---|---|---|
| Courses | `#statCourses` | Total published courses |
| Lessons | `#statLessons` | Total published chapters across all courses |
| Complete | `#statProgress` | `(completed chapters / total chapters) × 100%` |

### Course sections

Courses are grouped into sections rendered in this order:

1. **Continue Learning** — courses where the user has started but not finished (amber dot). Only shown when at least one such course exists.
2. **Beginner** — green dot
3. **Intermediate** — accent (blue/purple) dot
4. **Advanced** — purple dot

Each section has a heading, a pill showing the count, and a responsive card grid (`auto-fill, minmax(320px, 1fr)`).

### Course card

Each card shows:

- **Banner** — 160 px tall. Background is a CSS gradient keyed to the course level. If `thumbnail_url` is set on the course it renders as a cover image instead of the emoji icon.
- **Level badge** — top-left corner (Beginner / Intermediate / Advanced).
- **Chapter count** — top-right corner.
- **Title** and **description** (2-line clamp).
- **Progress bar** — visible only when the course has chapters. Shows `completed / total` and a percentage.
- **Continue button** — visible only when the course is in-progress. Clicking it opens the detail view at the first incomplete chapter.
- **Meta row** — lesson count, level label, and a FREE tag.

Clicking anywhere on the card (except the Continue button) calls `openDetail(courseId)`.

---

## Detail View

Opened by `openDetail(courseId, startChapterId?)`. Closed by `closeDetail()`.

### Layout

Two-column grid (`1fr 360px`) that collapses to a single column below 900 px.

**Left column — main content**

- 16:9 video embed (`#dvVideoWrap`). Shows a placeholder until a chapter is selected.
- "Now playing" bar (`#dvNowPlaying`) with an animated pulse dot and the chapter title. Hidden until playback starts.
- Tabs row (currently only "Overview").
- Tab body: course description (`#dvDesc`) + a progress row (`#dvProgRow`) showing the overall percentage.

**Right column — chapter sidebar**

- Sticky panel (`position: sticky; top: 20px`), scrollable internally.
- Header shows the course title and a `done/total` counter.
- Chapter list (`#dvChList`) — one row per chapter.

### Chapter row

Each row contains:

| Part | Description |
|---|---|
| Number chip | `chapter_num` from the DB |
| Title | `chapter.title` |
| Subtitle | `chapter.description` |
| Check button | Toggles `course_progress` for the current user |

States:
- **Default** — white number chip, normal title.
- **Active** — left border in accent colour, chip fills with accent colour.
- **Completed** — title gets a strikethrough, check button fills green. The row also gets the `.completed` class.

Clicking a row calls `playChapter(chId, courseId)`.

---

## Video player

`playChapter` extracts a YouTube video ID from `chapter.video_url` using the regex:

```
/(?:youtu\.be\/|[?&]v=)([a-zA-Z0-9_-]{11})/
```

If a valid ID is found an `<iframe>` is injected with `autoplay=1`. If the URL is blank or not a recognised YouTube URL the placeholder is shown instead.

---

## Progress tracking

`toggleProgress(chapterId, courseId)` flips a chapter's completion state:

- **Mark complete** — adds `chapterId` to the local `progress` object and `POST /api/progress`.
- **Mark incomplete** — removes it and `DELETE /api/progress`.

Both calls include `{ user_id, chapter_id }` in the JSON body. If no user is logged in the local state is still updated (guest mode), but no API call is made.

After toggling, the active detail view (or the grid if no course is open) re-renders to reflect the new state.

---

## Data & API

### `GET /api/courses`

Returns all published courses and chapters:

```json
{
  "courses": [ /* rows from public.courses */ ],
  "chapters": [ /* rows from public.course_chapters */ ]
}
```

Implemented in `api/courses.js` using the Supabase service-role key. Both tables are filtered by `published = true` and ordered by `sort_order`.

### `GET /api/progress?user_id=<uuid>`

Returns completed chapter IDs for the user:

```json
{ "progress": [{ "chapter_id": "..." }, ...] }
```

### `POST /api/progress`

Body: `{ user_id, chapter_id }` — marks a chapter complete.

### `DELETE /api/progress`

Body: `{ user_id, chapter_id }` — marks a chapter incomplete.

---

## Database tables

### `public.courses`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `community_id` | uuid | FK → communities |
| `title` | text | |
| `description` | text | |
| `content_url` | text | |
| `thumbnail_url` | text | Used as card banner image if set |
| `level` | text | `beginner` / `intermediate` / `advanced` (default `beginner`) |
| `sort_order` | int | Controls display order |
| `published` | boolean | Only published courses appear on the page |
| `created_at` / `updated_at` | timestamptz | |

### `public.course_chapters`

Chapters belong to a course (`course_id` FK). Key columns used by the UI:

| Column | Notes |
|---|---|
| `id` | Referenced by progress tracking |
| `course_id` | Groups chapters under a course |
| `chapter_num` | Displayed in the number chip |
| `title` | Shown in sidebar and "now playing" bar |
| `description` | Shown as chapter subtitle |
| `video_url` | YouTube URL — embedded in the player |
| `sort_order` | Chapter order within a course |
| `published` | Only published chapters appear |

### `public.course_progress`

| Column | Notes |
|---|---|
| `user_id` | FK → auth.users |
| `chapter_id` | FK → course_chapters |
| `completed_at` | Timestamp of completion |

Unique constraint on `(user_id, chapter_id)`. RLS ensures users can only read and modify their own rows.

---

## Level theming

Level is inferred by `inferLevel(course)`:

1. If `course.level` is `intermediate` or `advanced`, use it directly.
2. Otherwise fall back to title keywords (`advanc` → intermediate, `expert`/`master` → advanced, everything else → beginner).

Each level maps to a gradient and an emoji icon used on the card banner:

| Level | Gradient | Icon |
|---|---|---|
| Beginner | Dark blue → mid blue | 📈 |
| Intermediate | Dark purple → mid purple | 📉 |
| Advanced | Dark gold → mid gold | ⚡ |

---

## Responsive breakpoints

| Breakpoint | Change |
|---|---|
| `≤ 900 px` | Detail view switches to single column; sidebar becomes static |
| `≤ 680 px` | Card grid becomes single column; header stacks vertically; detail title shrinks |
