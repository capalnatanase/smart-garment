# Kit and Fit (LUMINOS) — Implementation Plan

Tech stack: **Laravel** (backend API) + **React + TypeScript** (frontend SPA).

---

## 1. Overview and Scope

- **Product**: Anonymous garment fit assessment — subjects log in with ID, select garment/size, perform 5 movements, and report discomfort by body zone.
- **Backend**: REST API, subject auth by ID, CRUD for assessments and responses.
- **Frontend**: Mobile-first React SPA (390px target from Figma), multi-step flows, body-zone selection UI.

---

## 2. Backend (Laravel)

### 2.1 Project Setup

- Laravel 11.x, PHP 8.2+.
- Database: PostgreSQL or MySQL.
- Auth: no traditional user accounts — **subject identified by a free-text Subject ID** (any string chosen by the participant or study). Optional: session token or signed link per subject.
- CORS configured for the React app origin.
- API prefix: `/api/v1`.

### 2.2 Database Schema

**Core entities**

| Table | Purpose |
|------|--------|
| `subjects` | `id`, `subject_id` (unique, free-text string up to 255 chars), `organisation`, `job_role` (nullable), `created_at`, `updated_at` |
| `garments` | `id`, `name` (e.g. "Base Layer"), `created_at` |
| `sizes` | `id`, `garment_id`, `name` (e.g. "S", "M"), `created_at` |
| `assessment_sessions` | `id`, `subject_id`, `garment_id`, `size_id`, `started_at`, `completed_at` (nullable), `created_at`, `updated_at` |
| `movements` | `id`, `name` (e.g. "Arms Raised"), `order`, `video_url` or `video_path`, `created_at` — seed 5 movements |
| `body_zones` | `id`, `name`, `slug` (e.g. front-shoulder), `side` (front|back|side), `created_at` — seed from Figma zones |
| `movement_responses` | `id`, `assessment_session_id`, `movement_id`, `created_at` |
| `movement_response_zones` | `id`, `movement_response_id`, `body_zone_id` — optional: severity or “no_issues” flag on `movement_responses` |

**Optional**

- `organisations` if you need to validate or list organisations.
- `sign_ups` or extra subject metadata if Sign Up flow stores more than `subjects`.

### 2.3 API Endpoints

**Auth / Subject**

- `POST /api/v1/subjects/login` — body: `{ "subject_id": "<any-string>" }`. Create or find subject, return session token + subject payload.
- `POST /api/v1/subjects/signup` — body: `{ "subject_id", "organisation", "job_role" }`. Create subject, return session token.

**Config (public or authenticated)**

- `GET /api/v1/garments` — list garments (and nested sizes) for dropdowns.
- `GET /api/v1/movements` — list movements in order (id, name, order, video_url).
- `GET /api/v1/body-zones` — list body zones (id, name, slug, side) for zone-select UI.

**Assessment flow**

- `POST /api/v1/assessment-sessions` — body: `{ "garment_id", "size_id" }`. Create session, return `session_id`.
- `GET /api/v1/assessment-sessions/current` — return current active session (garment, size, progress).
- `POST /api/v1/assessment-sessions/{id}/movement-responses` — body: `{ "movement_id", "body_zone_ids": [...] }` or `"no_issues": true`. Create/update response for that movement.
- `GET /api/v1/assessment-sessions/{id}` — session detail + movement responses (for “resume” or summary).
- `POST /api/v1/assessment-sessions/{id}/complete` — set `completed_at`.

Auth: subject session token in header (e.g. `Authorization: Bearer <token>` or cookie). Middleware: ensure subject owns the assessment session.

### 2.4 Laravel Structure

- **Models**: `Subject`, `Garment`, `Size`, `AssessmentSession`, `Movement`, `BodyZone`, `MovementResponse`, `MovementResponseZone`.
- **Controllers**: `SubjectAuthController`, `GarmentController`, `MovementController`, `BodyZoneController`, `AssessmentSessionController`.
- **Policies**: e.g. `AssessmentSessionPolicy` so a subject can only access their own session.
- **Form requests**: `LoginRequest`, `SignUpRequest`, `StartAssessmentRequest`, `MovementResponseRequest`.
- **Resources**: JSON API resources for consistent response shape (e.g. `SubjectResource`, `AssessmentSessionResource`).
- **Seeders**: `GarmentSeeder`, `SizeSeeder`, `MovementSeeder`, `BodyZoneSeeder` (mirror Figma zones).

### 2.5 Security and Validation

- Rate limiting on login/signup.
- `subject_id` is free-text; only enforce `required`, `string`, `max:255`, and uniqueness on signup.
- Ensure all assessment endpoints are scoped to the authenticated subject and their sessions.

---

## 3. Frontend (React + TypeScript)

### 3.1 Project Setup

- **Vite** + React + TypeScript.
- **React Router** v6 for SPA routing.
- **State**: React Query (TanStack Query) for server state; **Zustand** (or React Context) for client-only flow state (e.g. “which step am I on”, “selected zones” before submit).
- **HTTP**: Axios or fetch wrapper with base URL and auth header.
- **UI**: Tailwind CSS; mobile-first (max-width 390px or 428px for safe area). Optional component library (e.g. Headless UI, Radix) for dropdowns and accessibility.
- **Env**: `VITE_API_BASE_URL` for Laravel API.

### 3.2 Route and Screen Map

| Route | Screen | Purpose |
|-------|--------|--------|
| `/` | Redirect or landing | e.g. redirect to `/login` |
| `/login` | Log In | Subject ID input, submit → session, then redirect to garment selection |
| `/signup` | Sign Up | Subject ID + Organisation + Job Role → session → garment |
| `/garment-details` | Garment Details | Garment + size dropdowns, Continue → create session, go to intro |
| `/assessment/intro` | Functional Fit Intro | Copy + “Garment Under Review” summary + Start Assessment |
| `/assessment/movements/:movementIndex` | Movement instruction (M1–M5) | Video placeholder + instruction + “Select Discomfort Areas” |
| `/assessment/movements/:movementIndex/zones` | Zone select | Body diagram + zone selection + “No issues” + Next |
| `/assessment/complete` | Thank you / Complete | Optional confirmation screen |

Use a layout with back button and “Fit Assessment” header where the design shows it.

### 3.3 State and Data Flow

- **Auth**: After login/signup, store token (e.g. in memory + localStorage or httpOnly cookie). React Query for “current subject” or minimal session info.
- **Assessment session**: After “Continue” on Garment Details, `POST /assessment-sessions`, store `session_id` in client state (and optionally refetch from `GET .../current`). Use this for all movement response submissions.
- **Movement progress**: Derive from route (`movementIndex`) and from API (which movements have responses). “Movement X of 5” from route or from session progress.
- **Zone selection**: Local state (e.g. `Set<BodyZoneId>`) on the zone screen; on “Next”, `POST .../movement-responses` with `movement_id` and `body_zone_ids` (or `no_issues`), then navigate to next movement or complete.

### 3.4 Key Components (by screen)

- **Log In**: Form (Subject ID), primary button “Continue” / “Log In”, link to Sign Up.
- **Sign Up**: Form (Subject ID, Organisation, Job Role), primary button.
- **Garment Details**: Two dropdowns (garment, size), “Continue”; optional back to login if you support “change user”.
- **Functional Fit Intro**: Title, body copy, “Garment Under Review” block (garment name, size), “Start Assessment” button.
- **Movement instruction**: Header with movement name, video area (placeholder or real video), instruction text, “Select Discomfort Areas” button, progress “Movement X of 5”, back.
- **Zone select**: Body diagram (SVG or image map) with clickable regions mapped to `body_zones`; “No issues” button; “Next” (and optional “Back”). Diagram can be front/back/side or a single composite; highlight selected zones.
- **Complete**: Simple thank-you message; optional “Start another assessment” if in scope.

### 3.5 Body Diagram and Zones

- **Data**: Use `GET /body-zones` to get id, name, slug, side. Map Figma zones (front/back/side) to these.
- **Implementation**: SVG with `<g>` or `<path>` per zone, or image map. Store zone IDs in state; send selected IDs (or “no_issues”) on Next. Ensure touch targets are large enough on mobile.

### 3.6 TypeScript Types

Mirror API shapes:

- `Subject`, `Garment`, `Size`, `Movement`, `BodyZone`, `AssessmentSession`, `MovementResponse`.
- Request types: `LoginRequest`, `SignUpRequest`, `StartAssessmentRequest`, `MovementResponseRequest`.

Use a shared `api` module (e.g. `api/client`, `api/endpoints`, `api/types`) so all components use the same types and client.

---

## 4. Implementation Order

### Phase 1 — Foundation (Backend + Frontend shell)

1. Laravel project: install, DB, env, CORS.
2. Migrations for subjects, garments, sizes, assessment_sessions, movements, body_zones, movement_responses (+ junction).
3. Models, relationships, seeders (garments, sizes, 5 movements, body zones).
4. Subject “auth”: login/signup endpoints, simple token (e.g. Sanctum or custom), middleware.
5. React app: Vite + React + TS, Router, Tailwind, env. Placeholder pages for Login, Sign Up, Garment Details.
6. API client + auth header; login/signup forms calling API and storing token; redirect to `/garment-details`.

### Phase 2 — Garment and session flow

7. Laravel: garments + sizes endpoints; create assessment session endpoint; session scoped to subject.
8. Frontend: Garment and size dropdowns (data from API); on Continue, create session and navigate to `/assessment/intro`.
9. Intro screen: copy + “Garment Under Review” from session; “Start Assessment” → `/assessment/movements/0`.

### Phase 3 — Movements and responses

10. Laravel: movement-responses endpoint (create/update per movement); optional GET session with responses; complete-session endpoint.
11. Frontend: Movement instruction screen (dynamic by index); video placeholder; “Select Discomfort Areas” → zone screen.
12. Zone screen: body diagram + zone data from API; select zones or “No issues”; “Next” → POST response, then next movement or complete.
13. Progress indicator “Movement X of 5” and back navigation.

### Phase 4 — Polish and edge cases

14. Back button behaviour: allow going back to change garment/size before starting movements? Or lock after session created (per product decision).
15. Persist and resume: if user leaves mid-assessment, “current session” endpoint and redirect to correct step.
16. Accessibility: labels, focus order, ARIA where needed; keyboard support for zone selection if applicable.
17. Error handling: API errors, validation messages, network failures.
18. Optional: admin or internal view of assessment results (separate Laravel routes or simple dashboard).

---

## 5. Deployment and Environment

- **Backend**: Laravel on PHP-FPM (e.g. on Forge, Ploi, or Docker). Queue worker if you add jobs later. Env: `APP_URL`, `FRONTEND_URL` (for CORS), DB, cache.
- **Frontend**: Build with `npm run build`; serve as static files from Laravel (`public/`) or from CDN/host; set `VITE_API_BASE_URL` per environment.
- **Auth**: If using token in localStorage, ensure HTTPS and consider short-lived tokens + refresh if needed.

---

## 6. Optional Enhancements

- **Videos**: Store movement videos (e.g. in S3 or Laravel `storage`); serve via signed URLs or public path; play in React (e.g. `<video>` or player library).
- **Analytics**: Log assessment starts/completions, drop-off per step (backend or frontend analytics).
- **i18n**: Laravel localization and React (e.g. react-i18next) if multiple languages required.
- **Offline**: Service worker + cache for static assets; queue movement responses when back online if you need offline support.

---

## 7. Summary

| Layer | Deliverables |
|-------|--------------|
| **Laravel** | Subjects (login/signup by ID), garments/sizes, movements/body_zones, assessment sessions, movement responses, REST API, seeders, auth middleware. |
| **React** | Login, Sign Up, Garment Details, Intro, Movement instruction (×5), Zone select (×5), Complete; routing, API client, types, mobile-first UI. |
| **Integration** | Token-based subject auth; session creation after garment/size selection; submission of zone (or “no issues”) per movement; completion and optional resume. |

This plan aligns with the Figma “All Together MVP – LUMINOS” flow and keeps the backend simple (REST + subject-by-ID auth) while giving a clear path to implement the full assessment journey in React + TypeScript.
