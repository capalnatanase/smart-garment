# Kit and Fit (LUMINOS) — Fit Assessment

Anonymous garment fit assessment: subjects log in with a Subject ID, select garment/size, and complete a functional fit assessment with movement-based feedback.

## Tech stack

- **Backend:** Laravel 12 (PHP), SQLite by default, Laravel Sanctum for API tokens
- **Frontend:** React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS

## What’s included (Phases 1–4)

- **Phase 1:** Subject login/signup, garments/sizes/movements/body-zones API, assessment session creation, token auth
- **Phase 2:** Intro screen with “Garment Under Review” from current session; redirect if no session
- **Phase 3:** Full assessment flow: 5 movement instruction screens (video placeholder), zone-select screens (body zones by front/back/side, “No issues”, Next), submit movement responses, complete session, thank-you page
- **Phase 4:** Resume flow (intro → first incomplete movement; garment-details “assessment in progress” banner with Resume link), API validation errors (422) surfaced in forms, accessibility (ARIA labels, aria-pressed on zone toggles, focus order)

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # if not already done
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

API base: `http://localhost:8000`. API routes: `http://localhost:8000/api/v1/...`

### Frontend

```bash
cd frontend
cp .env.example .env   # ensures VITE_API_BASE_URL=http://localhost:8000/api/v1
npm install
npm run dev
```

App: `http://localhost:5173`

### Try the flow

1. Open `http://localhost:5173`
2. Log in with any Subject ID of your choice (or use Sign up with organisation/job role)
3. On Garment Details, select “Base Layer” and a size, then Continue
4. On the intro screen, click “Start Assessment”
5. For each of the 5 movements: view instruction → “Select Discomfort Areas” → choose body zones or “No issues” → Next (last one completes the assessment)
6. See the thank-you page; optionally “Start another assessment”

## Admin panel (Filament)

A Filament admin panel is mounted at `http://localhost:8000/admin` for browsing and editing all data (organisations, subjects, garments, sizes, movements, body zones, assessment sessions, and movement responses).

After running `php artisan db:seed`, a default admin account is created:

- Email: `admin@example.com`
- Password: `password`

Change those immediately for any non-local environment, or create a different admin user with:

```bash
cd backend
php artisan make:filament-user
```

Admin access is gated by `User::canAccessPanel()` in `backend/app/Models/User.php`; tighten it (e.g. role/email allow-list) before exposing the panel publicly.

## Project layout

- `backend/` — Laravel app (API, migrations, seeders, Subject auth)
- `frontend/` — React app (pages, API client, routes)
- `IMPLEMENTATION_PLAN.md` — Full implementation plan and phases

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/subjects/login` | No | Body: `{ "subject_id": "<any-string>" }` → token + subject |
| POST | `/api/v1/subjects/signup` | No | Body: `{ "subject_id", "organisation", "job_role" }` → token + subject |
| GET | `/api/v1/garments` | No | List garments with sizes |
| GET | `/api/v1/movements` | No | List movements (order, name, video_url) |
| GET | `/api/v1/body-zones` | No | List body zones for discomfort mapping |
| GET | `/api/v1/assessment-sessions/current` | Bearer | Current active (incomplete) session |
| GET | `/api/v1/assessment-sessions/{id}` | Bearer | Session detail + movement responses |
| POST | `/api/v1/assessment-sessions` | Bearer | Body: `{ "garment_id", "size_id" }` → create session |
| POST | `/api/v1/assessment-sessions/{id}/movement-responses` | Bearer | Body: `{ "movement_id", "no_issues"? , "body_zone_ids"? }` |
| POST | `/api/v1/assessment-sessions/{id}/complete` | Bearer | Mark session completed |

Subject ID is free-text (any non-empty string up to 255 characters) and must be unique across subjects.
