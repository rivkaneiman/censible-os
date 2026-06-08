# Censible OS — PTO Tool Spec

This document is the canonical specification for the PTO (paid time off) tool inside Censible OS. It pairs with:

- **Prototypes**: 9 JSX files in `prototypes/` showing the exact UI, copy, and interactions
- **Design guide**: `censible-os-design-guide.md` at the project root — the visual system everything must conform to

The prototypes use mock data and local React state. This document describes the real data model, business rules, and behaviors that the backend must implement to bring them to life.

---

## 1. Overview

The PTO tool handles vacation, personal, holiday, and holiday-comp day tracking for an admissions-focused team at Censible. It replaces a prior monday.com setup. Key characteristics:

- **~20 employees** total (~15 Admissions Directors organized into 3 pods + ~4 non-AD staff). Multiple admins are supported.
- **No PHI** — no HIPAA hosting concerns
- **Magic link auth** — no passwords
- **Tightly integrated with Censible OS** — shares profiles/auth/design system with the existing shell

The tool serves three primary use cases:
1. Employees submit and track time-off requests
2. Admins approve/deny requests and manage employees + weekend rotation
3. The system maintains a full audit trail and produces year-end documentation

---

## 2. Scope & out-of-scope

### In scope (built as prototypes — implement these)

- Employee landing (request form + balances + upcoming + recent decisions)
- Admin pending request queue with approve/deny + edit
- Admin all-pod calendar
- Employee pod calendar (read-only)
- Request history (employee view, tabs)
- Employee management (list view + pod kanban with drag-drop)
- Weekend rotation setup (roster builder + drag-swap on calendar)
- Archive page (audit log + year-end summaries)
- Login page (magic link)

### Explicitly deferred / out of scope

- **Holiday coverage sign-up** — held pending department head input on how it should work
- **PDF exports** — UI shows the intent (year-end summaries), but only CSV is wired in prototype. PDF is a future enhancement
- **Real-time updates** — prototypes assume static page loads. WebSocket/realtime push not yet specified; refresh-on-action is the baseline
- **Mobile-optimized layouts** — the design system is mobile-first in principle, but specific responsive breakpoints for admin pages haven't been designed in detail

### Maintenance model

Rivka batches change requests → Claude updates code → Rivka redeploys to Vercel. Backend work happens in a Next.js + Supabase codebase.

---

## 3. Roles & access

### Employee
- Logs in via magic link
- Sees: their own request form, their balances, their pod's calendar, their request history
- Can: submit, edit (while pending), cancel (with confirmation) their own requests

### Admin
- An employee with `is_admin = true` (multiple admins supported)
- Sees everything an employee sees, **plus** all admin pages (pending queue, all-pod calendar, employee management, weekend rotation, archive)
- Can: approve/deny requests, edit anyone's data (balances, pod, etc.), manage weekend rotation, see the audit log

### Pods
- Three configurable named pods: **North**, **South**, **East**
- Each AD belongs to exactly one pod (or "no pod" if non-AD)
- Pod color palette is part of the design system (locked):
  - North: `#5AA6BB` / `#2E6E84`
  - South: `#C2876C` / `#8C5A45`
  - East: `#9BAB85` / `#6B7E5B`
  - No pod: `#B0ABAC` / `#807A7B`

**Pod presence (not a separate "type" field) is the canonical signal for AD vs. non-AD behavior.** Has pod → AD treatment (4 PTO buckets, weekend rotation eligible, holidays). No pod → non-AD treatment (2 PTO buckets).

---

## 4. Data model

Tables Supabase needs (or equivalent). RLS policies must enforce: employees see only their own data; admins see everything.

### `employees`
```
id              uuid PK
auth_user_id    uuid FK → auth.users (for magic link lookup)
name            text
email           text UNIQUE
title           text                    -- "Admissions Director", "Billing Specialist", etc.
pod             text NULLABLE           -- "North" | "South" | "East" | null
is_admin        boolean DEFAULT false
hire_date       date
active          boolean DEFAULT true    -- soft delete via deactivation
balances        jsonb                   -- { vacation, personal, holiday, holiday_comp }
totals          jsonb                   -- { vacation, personal, holiday, holiday_comp }
created_at      timestamptz
updated_at      timestamptz
```

`balances` = currently available days. `totals` = total allotted for the year. `used = totals - balances` (computed, not stored). For non-AD employees (no pod), `holiday` and `holiday_comp` are present in the JSON but typically 0.

### `requests`
```
id              uuid PK
employee_id     uuid FK → employees
from_date       date
to_date         date
days            numeric                 -- supports half (0.5)
category        text                    -- "Vacation" | "Personal" | "Holiday" | "Holiday comp"
status          text                    -- "pending" | "approved" | "denied" | "cancelled"
submitted_at    timestamptz
decided_at      timestamptz NULLABLE
decided_by      uuid NULLABLE FK → employees
reason          text NULLABLE           -- employee's reason
deny_reason     text NULLABLE           -- admin's reason for denial
is_half_day     boolean DEFAULT false
half_day_start  time NULLABLE           -- if half day, start time (end auto = start + 4h)
created_at      timestamptz
```

### `weekend_rotation_roster`
```
id              uuid PK
employee_id     uuid FK → employees
position        integer                 -- ordering for the cycle
year            integer
```

Ordered subset of ADs. Not all ADs are necessarily in rotation (some may be exempt).

### `weekend_assignments`
```
id              uuid PK
date            date                    -- the Saturday or Sunday being covered
employee_id     uuid FK → employees
year            integer
generated_at    timestamptz             -- when this row was created/generated
```

Comp days are **derived, not stored**: a Saturday assignment implies the next Monday is comp; a Sunday assignment implies the prior Friday is comp. The system can compute these on-the-fly for display.

### `annual_allotments`
```
year            integer PK
with_pod        jsonb                   -- { vacation: 10, personal: 7, holiday: 4, holiday_comp: 2 }
no_pod          jsonb                   -- { vacation: 10, personal: 7, holiday: 0, holiday_comp: 0 }
```

Global defaults. Admin can update these at any time and choose "apply now" (recompute live balances) or "apply at next rollover" (only affects Jan 1 generation).

### `holidays`
```
year            integer
date            date
name            text                    -- "New Year's Day", "Memorial Day", etc.
PRIMARY KEY (year, date)
```

The 6 standard US holidays per year, computed and seeded annually:
- Jan 1 (New Year's Day)
- Last Monday of May (Memorial Day)
- Jul 4 (Independence Day)
- First Monday of September (Labor Day)
- Last Thursday of November (Thanksgiving)
- Dec 25 (Christmas)

### `audit_events`
```
id              uuid PK
timestamp       timestamptz
actor_id        uuid NULLABLE FK → employees   -- null for "System" events
actor_name      text                            -- denormalized for log integrity if employee deleted
subject_type    text                            -- "employee" | "roster" | "allotments" | "system" | null
subject_id      uuid NULLABLE
subject_name    text NULLABLE                   -- denormalized
category        text                            -- "request" | "balance" | "employee" | "rotation" | "allotment" | "login" | "system"
description     text                            -- the human-readable line shown in the log
metadata        jsonb NULLABLE                  -- structured diff/context for future expansion
```

### `year_end_summaries`
```
year            integer PK
generated_at    timestamptz
employees_count integer
days_used       integer
days_forfeited  integer
data            jsonb                   -- snapshot of per-employee summary at year-end
```

Auto-generated on Jan 1. The `data` blob is what gets exported to CSV.

### Indexes worth considering
- `requests (employee_id, status, from_date)` — for landing page queries
- `requests (status, from_date)` — for admin pending queue
- `weekend_assignments (date)` — calendar lookups
- `audit_events (timestamp DESC)` — log queries
- `audit_events (actor_id, timestamp)` — filter by actor

---

## 5. Business rules

### 5.1 Proration

New hire allotments are prorated by hiring quarter:

| Hire quarter | Proration |
|---|---|
| Q1 (Jan–Mar) | 100% |
| Q2 (Apr–Jun) | 75% |
| Q3 (Jul–Sep) | 50% |
| Q4 (Oct–Dec) | 25% |

Round to nearest whole day. Applies to all categories. Example: Q3 hire AD gets 5/4/2/1 (vacation/personal/holiday/holiday_comp).

### 5.2 Category inference

When an employee picks dates for a request, the system auto-infers the category from the **first day** of the requested range:

- Falls on a holiday date → **Holiday**
- ≤21 calendar days from today → **Personal**
- \>21 calendar days from today → **Vacation**

Admin can manually reclassify at decision time. Boundary span (multi-day request where first day is Personal but the range extends past the 21-day boundary) is flagged for admin attention.

### 5.3 Half-day rules

- Available for **Vacation or Personal only** (not Holiday or Holiday comp)
- **Single day only** — you can't half-day a multi-day request
- **Any notice** (no 24-hr lead time required)
- Admin specifies the **start time** at submission (4-hour duration is implicit); end time is displayed but derived
- Uses 0.5 from the relevant bucket

### 5.4 Balance model

For each PTO bucket, three numbers exist:

- **Total** (the denominator) — what the employee was allotted this year. Editable by admin.
- **Available** (the numerator, displayed as the big number) — what they have left. Computed from total minus used.
- **Used** — derived from total minus available. Never edited directly.

**Key UX principle**: when admin edits an employee's balance, they edit the **total** (denominator). The "used" stays constant; available auto-adjusts. This reflects the real workflow: admins grant additional days, not adjust what's already been taken.

Validation:
- Submitted-time balance check uses `approved + pending` combined (not just approved). Prevents overbooking via parallel pending requests.
- Submit is allowed even if the calculated balance goes negative — admin sees a warning in the queue and decides.

### 5.5 Pod-based behavior

Pod presence is the only signal that distinguishes ADs from non-ADs. There is **no separate "type" field**.

| Behavior | Has pod | No pod |
|---|---|---|
| Balance buckets shown | 4 (vacation, personal, holiday, holiday_comp) | 2 (vacation, personal) |
| Eligible for weekend rotation | Yes | No |
| Holidays apply | Yes | No |
| Sees pod calendar | Their pod | (See note) |
| Used by admin to filter views | Yes | "No pod" group |

Note: for non-pod employees, the calendar view experience needs to be specified separately if it differs. Prototype assumes they're not the primary calendar consumers.

### 5.6 Weekend rotation

**Setup model (yearly, but actively maintained):**
- Admin picks a subset of ADs to be in rotation (some ADs may be exempt)
- Orders them — this is the canonical sequence
- System generates a full year of assignments

**Cycle logic:**
- Weekend N: Saturday = roster[(2N) % N], Sunday = roster[(2N+1) % N]
- A 10-person roster repeats every 5 weekends

**Comp days (auto-derived, not separately assigned):**
- Saturday worker → following Monday off
- Sunday worker → prior Friday off

**Mid-year changes:**
- When admin changes the roster (add, remove, reorder), the system **auto-rebuilds assignments from today forward**, discarding previously generated future assignments. Past assignments are preserved.
- This is a destructive operation w.r.t. future planning — surface clearly in the UI (the prototype already has a "Save & generate" button with a preview indicator).

**Individual swaps (mid-year):**
- Admin can swap two weekend assignments via drag-and-drop on the calendar
- Comp days **auto-follow** the swap (since they're derived from the assignment)
- Swaps don't change the roster — they're per-weekend overrides on top of the generated baseline

**PTO conflict handling:**
- When an employee submits PTO that overlaps with their own weekend coverage or comp day, the request form warns them and instructs them to coordinate a swap with admin first. Doesn't block submission.
- Admin can also see conflicts in the queue if a request for an already-covered day comes in.

### 5.7 Holidays

For ADs only (pod members):
- **4 holiday days** locked to 6 designated dates per year
- **2 holiday comp days** that float (no rules, used like personal but tracked separately)

The math: an AD has 4 days they can take off from the 6 holidays. They pick which 4 (or rather, they request time off on holiday dates and the system tracks usage against the holiday bucket). When the holiday bucket hits 0, requests for holidays go against personal or vacation (or get denied).

Holiday comp days have no notice rules and can be used any time of year. They're effectively bonus personal days.

### 5.8 Submission & approval flow

**On submit:**
1. Validate dates, category, balance (approved + pending combined)
2. Insert row with `status = pending`
3. Email admin: "New request from [employee] for [dates]"
4. Show in employee's "Your time off → Pending" section
5. Show in admin's pending queue (sorted by request start date, soonest first)

**On approve/deny:**
1. Admin can edit the request before deciding (dates, category, half-day, balance impact preview)
2. Update `status`, `decided_at`, `decided_by`. For denials, optional `deny_reason`.
3. Email employee with outcome
4. Move from pending → approved/denied
5. If approved, deduct from balance (the actual `balances` jsonb update)
6. Show in employee's "Recent decisions" banner for 48 hours
7. Log to audit trail

**Pending in calendar:**
- Pending requests are **not shown** on the pod calendar (only approved)
- Pending is shown to the employee in "Your time off" and to admins in the pending queue
- Validation uses "approved + pending combined" to prevent parallel-pending overbooking

**Cancellation:**
- Employee can cancel their own pending requests (with confirmation modal)
- Admin can edit any request at any time
- Cancelling = `status = cancelled`. Doesn't affect balance (it wasn't deducted yet since it was pending).

### 5.9 Allotments & rollover

**Annual allotments** are defined in `annual_allotments` table, keyed by year. Two profiles: `with_pod` and `no_pod`.

**Per-employee overrides** live in the `employees.totals` field. By default it matches the annual allotment for their pod status, but admin can edit it (e.g., signing bonus → +2 vacation days for this person only).

**Updating defaults:** when admin changes `annual_allotments`, they pick:
- **Apply now**: recompute every employee's `totals` to match the new defaults (preserving any overrides that diverged)
- **Next rollover**: only takes effect Jan 1

**Year-end rollover (Jan 1, automatic):**
1. Snapshot current state into `year_end_summaries`
2. Generate the year-end CSV (and eventually PDF)
3. Reset all employee balances and totals to the new year's allotments (prorated for new hires)
4. No rollover — unused days are forfeited (this is a hard rule)
5. Log a system event: "Year-end rollover: 2026 balances exported, 2027 allotments applied"

---

## 6. Pages & features

This section maps each prototype file to its real route and key behaviors. The prototype is the source of truth for visual/interaction design; this lists the wiring.

### `/login` ← `login.jsx`
- Magic link via Supabase Auth (`supabase.auth.signInWithOtp`)
- Email must match an `employees.email` where `active = true`
- If not found → "That email isn't registered. Contact your admin."
- Link expires in 15 minutes (Supabase default; configurable)

### `/time-off` (employee landing) ← `pto-request-form.jsx`
- Default route after login for employees
- Reads: `employees.balances` and `.totals` for current user; upcoming weekend coverage; pending requests; approved upcoming; recent decisions (last 48h)
- Request form is a modal triggered by header button
- "View request history →" links to `/time-off/history`
- Cancel pending → confirmation modal → `status = cancelled`

### `/time-off/history` ← `request-history.jsx`
- Tabs: Pending / Approved / Denied
- Defaults to current year; year picker for older
- Sorted by `from_date` (descending except Pending which is ascending — soonest first)
- Cancel from Pending tab uses the same confirmation modal as landing

### `/admin/requests` ← `admin-pending-queue.jsx`
- Admin-only. Lists all `requests WHERE status = 'pending'` ordered by `from_date ASC`
- Click row → opens detail panel with: dates, category chip, reason, balance preview ("X → Y after approval"), flags (pod conflict, insufficient balance, etc.), month calendar snapshot
- Edit mode lets admin change anything before deciding
- Approve/Deny actions each open confirmation modal → auto-loads next pending request

### `/calendar` ← `employee-calendar.jsx` (employees) and `admin-calendar.jsx` (admins)
- One route, behavior shifts based on role
- **Employee**: sees only their pod's calendar; "Just me" toggle to filter to own time off only
- **Admin**: sees all pods; pod filter chips (multi-select); right sidebar shows day detail when a day is clicked
- Month + Week view toggle
- Weekend coverage appears as a heading (not chip), pod-colored
- Own days on employee view: "You" label, thicker border

### `/admin/employees` ← `employee-management.jsx`
- List view (default, alphabetical) + Pod view (kanban with drag-drop to reassign pod)
- Tabs: Active (default) / Deactivated
- Click row → detail panel: name (editable in edit mode), title, pod dropdown, admin checkbox, hire date (custom date picker), balances (denominator editable, available auto-recomputes), expandable request history per employee
- Add Employee modal: name, email, title, pod, hire date, admin toggle; auto-prorates initial balances based on hire quarter
- Import CSV modal: stub in prototype, needs real CSV parsing per template `name, email, title, pod, hire_date, vacation, personal, holiday, holiday_comp, is_admin`
- Deactivate: confirmation modal explains consequences (no longer in active list, can't log in, removed from rotation, history preserved). Reactivate from Deactivated tab.

### `/admin/weekend-rotation` ← `weekend-rotation.jsx`
- Left panel: Rotation order (numbered, draggable to reorder) + Eligible (ADs not in rotation, drag to add)
- Right panel: Calendar with weekend assignments shown as pod-colored chips
- Live preview as roster changes; "Save & generate" commits and regenerates
- After save, drag a weekend chip onto another to swap (comp days auto-follow)
- Drag-swap disabled while preview is dirty (avoids confusion)

### `/admin/archive` ← `archive.jsx`
- Tabs: Audit log (default) / Year-end summaries
- **Audit log**: list of `audit_events` newest first, defaults to current year; filters for actor + date range + search; CSV export respects filters
- **Year-end summaries**: list of past years from `year_end_summaries`; each row has a CSV download button. (PDF is deferred.)

---

## 7. Audit & archive

### What gets logged

| Category | Trigger | Example description |
|---|---|---|
| `request` | Submitted, approved, denied, cancelled, edited | "Approved Sarah Chen's Jun 13–15 vacation request" |
| `balance` | Admin edits employee's totals/balances directly | "Changed Marcus Hill's vacation total: 10 → 12 days (reason: anniversary bonus)" |
| `employee` | Created, deactivated, reactivated, pod changed, admin toggled, title changed, etc. | "Changed Morgan Diaz's pod: East → North" |
| `rotation` | Roster saved, weekend swapped, employee added/removed from rotation | "Swapped weekend coverage: Sarah Chen (Jun 6) ↔ Mike Park (Jul 11). Comp days auto-followed." |
| `allotment` | Admin updates global annual allotments | "Updated default holiday comp allotment: 2 → 3 days. Apply: next rollover." |
| `login` | Successful magic link sign-in | "Logged in" |
| `system` | Year-end rollover, automated maintenance | "Year-end rollover: 2025 balances exported, 2026 allotments applied to all employees" |

Every mutation in the system must produce an audit event. Treat it as the system's source of truth for "what happened when" — many other features rely on it for back-filling history.

### Audit log filters (prototype shows the UI)

- **Actor** dropdown: list of unique actors from events
- **Date range**: From + To (custom date pickers, From defaults to Jan 1 of current year)
- **Search** box: case-insensitive match against description, actor, subject

### Year-end summary content

The CSV columns:
```
Employee, Pod,
Vacation Allotted, Vacation Used, Vacation Forfeited,
Personal Allotted, Personal Used, Personal Forfeited,
Holiday Used, Holiday Comp Used,
Total Days Off, Dates Off
```

Generated and stored on Jan 1 (during rollover). Available for download from the Archive page indefinitely.

---

## 8. Notifications & auth

### Magic link
- Supabase Auth's OTP via email
- Email link must validate against `employees` (not just `auth.users`) — block deactivated employees
- 15-minute expiry

### Email notifications
- Need a transactional email service (Resend recommended given Vercel ecosystem)
- Two templates needed initially:
  1. **Request submitted** (to admin): "New request from {employee} for {dates}. Review →"
  2. **Request decided** (to employee): "Your request for {dates} has been {approved|denied}. View →"
- Optional: Year-end summary email (to admin on Jan 1 with link to download)

### Session
- Persistent (long-lived session token), since this is an internal tool used daily

---

## 9. Edge cases & gotchas

### Concurrency
- Two admins approving the same request at once → second one fails (use a `status_version` column or row-level lock; UI shows "This was already decided by [admin]")
- Same employee submitting parallel requests that overlap → second one shows pod conflict warning at submit time but isn't blocked; admin handles at queue time

### Time zones
- Eastern Time, server-side
- Date fields are dates (not timestamps) — no TZ ambiguity for the day itself
- Display timestamps (audit log, decided_at) in Eastern

### Soft deletes
- Never hard-delete employees, requests, or audit events
- Deactivated employees are filtered from active lists but persist in history
- Admin can reactivate

### Magic link gotchas
- The email might land in spam — error message on login form already addresses this (resubmit with same email = resend)
- Link only valid once and only for 15 minutes

### Holiday balance vs. holiday dates
- The 4 holiday bucket means "you can take 4 of the 6 designated days off"
- A request that lands on a holiday date pulls from holiday bucket, not vacation/personal
- If the bucket is exhausted, the request goes against vacation or personal (or admin handles manually)

### Boundary spans (Personal/Vacation line)
- A multi-day request where day 1 is ≤21 days (Personal) but later days extend past 21 — flagged in queue, admin reclassifies if needed
- The prototype shows this as an inline note in the admin queue's detail panel

### Year-end rollover timing
- Runs at midnight Eastern on Jan 1
- Must be idempotent (cron jobs are unreliable; check if summary already exists before regenerating)

### RLS (Supabase row-level security)
- Employees see: only their own `requests`, `audit_events` they're subject of (or none if scoped strictly), their `employees` row, and all `weekend_assignments` for visibility
- Admins see: everything
- Anonymous (unauthenticated): nothing except the login page

---

## 10. Out of scope / deferred

- **Holiday coverage sign-up**: department heads need to weigh in on workflow
- **PDF year-end exports**: UI shows the intent; implementation needs a PDF library (e.g., react-pdf or server-side rendering via Puppeteer). Until then, CSV serves
- **Real-time multi-admin updates**: if two admins are looking at the queue at once, they currently see stale data until refresh. Acceptable for now; revisit if it causes conflicts in practice
- **Mobile-optimized admin pages**: design system is mobile-first conceptually, but the admin pages (kanban, weekend rotation calendar) haven't been responsively designed
- **Daily digest emails**: defer
- **External calendar integrations** (Google Calendar, Outlook): defer

---

## 11. File handoff guide

When implementing each page, do this:

1. **Open the prototype JSX file** in `prototypes/` for that page
2. **Read it top to bottom** — note the mock data shapes, the component breakdown, the styling
3. **Convert mock data to real queries** — replace `SEED_*` constants with Supabase queries
4. **Convert local state mutations to server actions** — instead of `setEmployees(...)`, call a server action that updates Supabase + logs to audit
5. **Preserve the design system** — copy CSS classes and styles as-is; do not "improve" the visual design. The design guide is authoritative
6. **Preserve copy** — microcopy, labels, button text, empty states, error messages are all locked. Don't rewrite

### Prototype-to-route mapping

| Prototype file | Route | Notes |
|---|---|---|
| `login.jsx` | `/login` | Public |
| `pto-request-form.jsx` | `/time-off` | Default route post-login for employees |
| `request-history.jsx` | `/time-off/history` | |
| `admin-pending-queue.jsx` | `/admin/requests` | |
| `admin-calendar.jsx` | `/calendar` (admin role) | Shares route with employee calendar; differs by role |
| `employee-calendar.jsx` | `/calendar` (employee role) | |
| `employee-management.jsx` | `/admin/employees` | |
| `weekend-rotation.jsx` | `/admin/weekend-rotation` | |
| `archive.jsx` | `/admin/archive` | Has two tabs (audit log + year-end summaries) |

### Build order (recommended)

Each is a separate Claude Code session for context discipline:

1. **Schema migration** — all tables, indexes, RLS policies, seed data (one holiday year, default allotments)
2. **Auth + login** — magic link wired to `employees`, redirect logic post-login by role
3. **Employee management** — without employees, nothing else has data. Includes Add modal + CSV import
4. **Weekend rotation** — generates the assignments that calendar + request form depend on
5. **PTO request form + admin pending queue** — the core flow, end-to-end
6. **Calendar views** — both employee and admin, since they share a route
7. **Request history** — extends the request form
8. **Archive** — audit log (sourced from audit_events accumulated during steps 3-7) + year-end summaries scaffolding
9. **Year-end rollover job** — cron + email + summary generation

### What's mocked in prototypes (must be replaced)

- All `SEED_*` and similar mock arrays
- `TODAY` constants (use actual `new Date()` server-side, but be careful with timezones)
- Local `useState` for data that should persist (employees, requests, assignments, etc.)
- The hardcoded `USER = { name: "Sarah Chen", ... }` in employee-facing pages — replace with real user from Supabase session
- CSV download triggers (real, but bound to mock data)
- Drag-and-drop is real (HTML5 native) — preserve as-is

### What's already wired and should stay as-is

- All design-system styles (CSS in `<style>` tags in prototypes — copy these into globals or a shared CSS module)
- Lucide icons (already a dependency per existing project setup)
- Fonts (Fraunces + Geist Sans — verify they're loaded in `app/layout.tsx`)
- HTML5 native drag-and-drop in pod kanban and weekend rotation
- Modal patterns (backdrop + panel)
- Custom Dropdown and DatePicker components (re-used across pages — extract to shared components)