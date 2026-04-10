# Artist Management System - Phase Plan (Hiring Assignment)

This document is the execution roadmap for building the assignment in small, reviewable commits.

PDF verification references:
- [Extracted assignment notes](/Users/manojnepali/Desktop/artist-management-system-rbac/docs/ASSIGNMENT_PDF_EXTRACT.md)
- [Assignment page 1 image](/Users/manojnepali/Desktop/artist-management-system-rbac/docs/assets/assignment_page1_task_detail.png)
- [Assignment page 2 schema image](/Users/manojnepali/Desktop/artist-management-system-rbac/docs/assets/assignment_page2_schema.png)
- [Coding style guide](/Users/manojnepali/Desktop/artist-management-system-rbac/docs/CODING_STYLE.md)

## 1) Project Architecture (High Level)

- **Frontend**: React (Vite), role-aware admin UI.
- **Backend**: Node.js core modules only (`http`, `url`, `crypto`, etc.).
- **Database**: PostgreSQL.
- **DB access**: `pg` package only, **raw SQL only** (no ORM).
- **Backend framework policy**: do not use `express`, `nest`, `fastify`, `koa`, or any backend framework wrapper.
- **Auth strategy**: JWT-based auth using short-lived access token in HTTP-only cookie.
- **Authorization**: RBAC + ownership checks for artist song operations.
- **Frontend state**: simple Zustand store for auth/user/role only; keep table/form state local to each page.
- **Data flow**:
  1. React app calls REST API.
  2. Node `http` server routes manually.
  3. Controllers call services/repositories.
  4. Repositories run parameterized raw SQL via `pg`.

## 2) Proposed Folder Structure

```text
artist-management-system-rbac/
  backend/
    src/
      app.js
      server.js
      config/
        env.js
      db/
        pool.js
      routes/
        index.js
        auth.routes.js
        users.routes.js
        artists.routes.js
        songs.routes.js
      controllers/
        auth.controller.js
        users.controller.js
        artists.controller.js
        songs.controller.js
      services/
        auth.service.js
        users.service.js
        artists.service.js
        songs.service.js
      repositories/
        auth.repository.js
        users.repository.js
        artists.repository.js
        songs.repository.js
      middleware/
        auth.middleware.js
        rbac.middleware.js
      utils/
        bodyParser.js
        cookies.js
        jwt.js
        response.js
        errors.js
        pagination.js
        validators.js
        csv.js
        password.js
      constants/
        roles.js
        permissions.js
    sql/
      schema.sql
      seed.sql
    package.json
    .env.example

  frontend/
    src/
      main.jsx
      App.jsx
      router/
        index.jsx
      layouts/
        DashboardLayout.jsx
      pages/
        LoginPage.jsx
        RegisterPage.jsx
        DashboardHomePage.jsx
        users/UsersListPage.jsx
        users/UserFormPage.jsx
        artists/ArtistsListPage.jsx
        artists/ArtistFormPage.jsx
        artists/ArtistSongsPage.jsx
        songs/SongFormPage.jsx
      components/
        common/Pagination.jsx
        common/ProtectedRoute.jsx
        common/RoleGuard.jsx
        common/Navbar.jsx
        forms/UserForm.jsx
        forms/ArtistForm.jsx
        forms/SongForm.jsx
      api/
        client.js
        auth.api.js
        users.api.js
        artists.api.js
        songs.api.js
      store/
        auth.store.js
      utils/
        validators.js
        csv.js
    package.json
    .env.example

  docs/
    PHASE_PLAN.md
  README.md
  .gitignore
```

## 3) API List (REST, Assignment Aligned)

### Auth
- `POST /api/auth/register` - Register admin user (default role: `artist_manager`, or restricted by rule we finalize).
- `POST /api/auth/login` - Login, issue JWT and set HTTP-only cookie.
- `POST /api/auth/logout` - Logout, invalidate current token version and clear auth cookie.
- `GET /api/auth/me` - Current logged-in user.

### Users (`super_admin` only)
- `GET /api/users?page=1&limit=10`
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Artists
- `GET /api/artists?page=1&limit=10` - `super_admin`, `artist_manager`
- `POST /api/artists` - `artist_manager`
- `GET /api/artists/:id` - `super_admin`, `artist_manager`
- `PUT /api/artists/:id` - `artist_manager`
- `DELETE /api/artists/:id` - `artist_manager`
- `GET /api/artists/export.csv` - `artist_manager`
- `POST /api/artists/import.csv` - `artist_manager`

### Songs
- `GET /api/artists/:artistId/songs?page=1&limit=10`
  - `super_admin`, `artist_manager`, `artist` (artist can view only own artist’s songs)
- `POST /api/artists/:artistId/songs` - `artist` (own artist only)
- `PUT /api/artists/:artistId/songs/:songId` - `artist` (own artist only)
- `DELETE /api/artists/:artistId/songs/:songId` - `artist` (own artist only)

### Frontend route behavior (from assignment)
- If user is not authenticated:
  - Landing route shows login page.
  - Registration page is available.
- After successful registration:
  - Redirect to login page.
- If user is already authenticated:
  - Opening login/register routes redirects to dashboard.
- Dashboard includes logout action and role-based modules/actions.

### Requirement coverage checklist (PDF + prompt)
- Relational database (PostgreSQL): covered.
- Minimum tables (`users`, `artists`, `songs`): covered.
- No ORM and raw SQL for CRUD: covered.
- Backend without frameworks (`express`/`nest`/`fastify`/`koa`): covered.
- API style REST with Node core `http` routing: covered.
- Login/register/redirect/dashboard/logout flows: covered.
- RBAC matrix for `super_admin`, `artist_manager`, `artist`: covered.
- Artist CSV import/export and artist-to-songs navigation: covered.
- Song ownership rule for `artist` role via user-artist linkage: covered.
- Validation requirement (request + DB constraints + CSV row validation): covered.
- JWT-based authentication and role-claims authorization (no framework): covered.

## 4) RBAC Matrix

| Module | Action | super_admin | artist_manager | artist |
|---|---|---:|---:|---:|
| Auth | Login/Logout/Me | Yes | Yes | Yes |
| User | List (paginated) | Yes | No | No |
| User | Create | Yes | No | No |
| User | Update/Delete | Yes | No | No |
| Artist | List (paginated) | Yes | Yes | No |
| Artist | Create | No | Yes | No |
| Artist | Update/Delete | No | Yes | No |
| Artist | CSV import/export | No | Yes | No |
| Song | List for artist | Yes | Yes | Yes (own only) |
| Song | Create | No | No | Yes (own only) |
| Song | Update/Delete | No | No | Yes (own only) |

## 5) Database Design (Core + Practical Ownership)

### Required tables
1. `users`
2. `artists`
3. `songs`

### Required columns (assignment-aligned)
- `users`:
  - `id`, `first_name`, `last_name`, `email`, `password`, `phone`, `dob`, `gender`, `address`, `role`, `token_version`, `created_at`, `updated_at`
- `artists`:
  - `id`, `name`, `dob`, `gender`, `address`, `first_release_year`, `no_of_albums_released`, `created_at`, `updated_at`
- `songs`:
  - `id`, `artist_id`, `title`, `album_name`, `genre`, `created_at`, `updated_at`

### Supporting tables (practical)
4. `artist_user_links` (maps artist role user -> artist profile for ownership checks)

### Key constraints
- `users.email` unique.
- `users.role` check/enum: `super_admin`, `artist_manager`, `artist`.
- `users.token_version` integer default `0` (used to invalidate old JWTs on logout/reset).
- `songs.artist_id` FK -> `artists.id` with `ON DELETE CASCADE`.
- `songs.genre` check/enum aligned with schema diagram: `rnb`, `country`, `classic`, `rock`, `jazz`.
- `artist_user_links.user_id` unique FK -> `users.id`.
- `artist_user_links.artist_id` unique FK -> `artists.id`.
  - This enforces one-to-one mapping between artist user account and artist profile.
- timestamp columns with defaults and update triggers/manual updates.

### Relationship rules
- One artist has many songs via `songs.artist_id`.
- One song belongs to one artist.

### SQL query standards (simple + optimized when needed)
- Keep queries straightforward and readable first.
- Use parameterized SQL only (`$1`, `$2`, ...); no string-concatenated values.
- Select only required columns for list/detail APIs.
- Always include deterministic ordering for pagination queries.
- Use `LIMIT/OFFSET` for assignment pagination and return total count.
- Add indexes only where they provide clear value:
  - `users(email)` unique index
  - `songs(artist_id)` index
  - optional composite index for common paging patterns if needed later
- Keep writes explicit (`INSERT`, `UPDATE`, `DELETE`) with clear `WHERE` clauses.
- Avoid premature optimization; optimize based on actual access patterns.
- Keep repository methods one-query-focused for easier review and maintenance.

### `users.role` usage (explicit)
- DB layer:
  - Stored as enum/check-constrained value: `super_admin`, `artist_manager`, `artist`.
- Auth layer:
  - Included in JWT claim and in login/me response payload.
- API authorization:
  - Checked by RBAC middleware on every protected endpoint.
  - Powers route permissions in the RBAC matrix above.
- Ownership logic:
  - If role is `artist`, song create/update/delete is limited to the linked artist via `artist_user_links`.
- Frontend:
  - Used for protected routes and role-based visibility (menu/actions/buttons).

### JWT implementation rules (assignment-sized)
- Issue one short-lived access token (no refresh token complexity for this assignment).
- JWT claims: `sub` (user id), `role`, `token_version`, `exp`.
- Transport token via HTTP-only cookie (`SameSite=Lax`, `Secure` in production).
- Verify JWT signature and expiry on each protected request.
- Reject token if JWT `token_version` does not match current `users.token_version`.
- On logout, increment `users.token_version` and clear auth cookie.

## 6) Assumptions (Explicit)

- We add `artist_user_links` to satisfy “artist can manage songs for that artist only.”
- Registration is for creating a non-super-admin account (safer default: `artist_manager`).
- `super_admin` is created from seed data (not open public registration).
- We use JWT in HTTP-only cookie with `users.token_version` for clean logout invalidation.
- CSV import is assignment-sized: validates headers, row-level required fields, and rejects invalid rows with clear message.
- Pagination defaults: `page=1`, `limit=10`, max limit cap (e.g., 100).

## 7) Edge Cases We Will Handle

- Duplicate email on registration/user creation.
- Invalid role values.
- Invalid date formats (`dob`, release year bounds).
- Artist user trying to modify songs for another artist.
- Deleting artist with songs (cascade policy is explicit).
- CSV with missing columns, invalid gender/year, blank names.
- Missing/invalid/expired JWT token.
- Stale JWT token after logout (token_version mismatch).
- Pagination with negative or non-numeric query values.

## 8) Phase Breakdown + Commit Plan

## Phase 0 - Bootstrap & Standards
**Goal**: clean repo baseline for reviewer confidence.

**Deliverables**
- Initialize backend/frontend folders.
- Add `.editorconfig`, `.gitignore`, root `README.md` skeleton.
- Add `docs/PHASE_PLAN.md`.

**Suggested commits**
1. `chore: initialize repository structure and planning docs`

## Phase 1 - Database Foundation
**Goal**: schema + seed + reproducible local setup.

**Deliverables**
- `backend/sql/schema.sql`
- `backend/sql/seed.sql`
- DB setup instructions in README.
- Seed users: `super_admin`, `artist_manager`, `artist`.

**Suggested commits**
2. `feat(db): add normalized schema with constraints and ownership mapping`
3. `feat(db): add seed data for users artists songs and ownership links`

## Phase 2 - Backend Core (No Framework)
**Goal**: boot server and routing foundation.

**Deliverables**
- Node `http` server, manual router, JSON parser, error responses.
- `pg` pool setup and health-check endpoint.
- Base middleware pattern.
- Explicitly no backend framework dependencies (`express`, `nest`, `fastify`, `koa`).

**Suggested commits**
4. `feat(api): setup node http server with manual routing and db pool`
5. `feat(api): add shared utils for parsing responses validation and errors`

## Phase 3 - Auth + JWT + RBAC
**Goal**: secure login/logout and access controls.

**Deliverables**
- Register/login/logout/me endpoints.
- Password hashing using Node `crypto.scrypt`.
- JWT signing/verifying + HTTP-only cookie handling.
- Token invalidation using `users.token_version`.
- Auth middleware + RBAC guard.

**Suggested commits**
6. `feat(auth): implement registration login logout and jwt middleware`
7. `feat(auth): implement role-based authorization guards`

## Phase 4 - User Module
**Goal**: full super_admin-only user CRUD.

**Deliverables**
- User CRUD endpoints with pagination.
- Input validation and safe SQL parameterization.

**Suggested commits**
8. `feat(users): implement super-admin user CRUD with pagination`

## Phase 5 - Artist Module + CSV
**Goal**: artist CRUD and CSV workflows.

**Deliverables**
- Artist CRUD endpoints.
- CSV export endpoint.
- CSV import endpoint with row validation and summary result.

**Suggested commits**
9. `feat(artists): implement artist CRUD with role restrictions`
10. `feat(artists): add csv import export for artists`

## Phase 6 - Song Module with Ownership Rules
**Goal**: artist-only song CUD for own profile.

**Deliverables**
- Song list/create/update/delete endpoints.
- Ownership checks via `artist_user_links`.

**Suggested commits**
11. `feat(songs): implement artist-scoped song CRUD with ownership enforcement`

## Phase 7 - Frontend Core (React)
**Goal**: auth and protected navigation.

**Deliverables**
- Login/register pages.
- Simple Zustand auth store (`user`, `role`, `isAuthenticated`, `setAuth`, `clearAuth`).
- Protected routes and role guards.
- Dashboard shell + logout.

**Suggested commits**
12. `feat(web): setup react app with auth flow and protected dashboard routes`

## Phase 8 - Frontend Modules
**Goal**: user/artist/song management screens.

**Deliverables**
- User management UI (super_admin).
- Artist management UI + CSV import/export.
- Artist songs screen + song CRUD UI.
- Pagination components and form validation.
- Keep list/filter/form/pagination state local with `useState` (avoid unnecessary global store complexity).

**Suggested commits**
13. `feat(web): add user management pages and forms`
14. `feat(web): add artist management and csv actions`
15. `feat(web): add song management pages with ownership-aware behavior`

## Phase 9 - Finalization for GitHub Submission
**Goal**: reviewer-ready repository.

**Deliverables**
- `.env.example` for backend/frontend.
- Full README: setup, run, API list, roles, assumptions, sample creds.
- Manual QA checklist.

**Suggested commits**
16. `docs: add complete setup guide api reference and reviewer instructions`
17. `chore: final polish and pre-submission cleanup`

## 9) Definition of Done (Per Phase)

- All code compiles/runs locally.
- Each phase has dedicated commit(s) with clear message.
- README updated incrementally, not only at the end.
- No backend framework used.
- No ORM used.
- Every DB operation uses raw parameterized SQL.

---

If this plan looks good, next step is **Phase 1 implementation** (`schema.sql` + `seed.sql` + DB setup docs) with commit-by-commit execution.
