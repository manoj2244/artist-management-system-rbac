# Assignment PDF Extraction Notes

Source PDF: `/Users/manojnepali/Downloads/4-2-Task Details [Programmer-Advanced RBAC].pdf`

Generated reference images:
- [Page 1](/Users/manojnepali/Desktop/artist-management-system-rbac/docs/assets/assignment_page1_task_detail.png)
- [Page 2](/Users/manojnepali/Desktop/artist-management-system-rbac/docs/assets/assignment_page2_schema.png)

## Page 1 (Task Details) - extracted requirements

## Summary
- Build a simple admin panel to manage records of artists and their songs collection.

## Technical requirements (from page 1)
- Relational database.
- Minimum tables: User, Artist, Song.
- ORM must not be used.
- CRUD must be performed by raw query.
- Language: any.
- API: native or REST.

## Core task requirements (from page 1)
- Initial landing page:
  - Login screen.
  - New registration option.
  - New admin registration redirects to login.
  - Logged-in admin should be redirected to dashboard.
- Dashboard:
  - Admin can perform CRUD for required tables.
  - Logout button is required.

### User table permissions
- List users with pagination: `super_admin`
- Create user: `super_admin`
- Update/Delete user: `super_admin`

### Artist table permissions
- List artists with pagination: `super_admin`, `artist_manager`
- Create artist: `artist_manager`
- Update/Delete artist: `artist_manager`
- CSV import/export artists: `artist_manager`
- Button to go to songs list for a specific artist: `super_admin`, `artist_manager`

### Song permissions
- List songs for user/artist: `super_admin`, `artist_manager`, `artist`
- Create song for that artist: `artist`
- Update/Delete song for that artist: `artist`

### Validation note
- “Please make sure validations are performed properly.”

## Page 2 (Schema Diagram) - extracted structure

Diagram shows 3 tables:
- `user`
- `artist`
- `music`

### `user`
- `id` int (PK)
- `first_name` varchar(255)
- `last_name` varchar(255)
- `email` varchar(255)
- `password` varchar(500)
- `phone` varchar(20)
- `dob` datetime
- `gender` enum('m', 'f', 'o')
- `Address` varchar(255)
- `created_at` datetime
- `updated_at` datetime

### `artist`
- `id` int (PK)
- `name` varchar(255)
- `dob` datetime
- `gender` enum('m', 'f', 'o')
- `address` varchar(255)
- `first_release_year` year
- `no_of_albums_released` int
- `created_at` datetime
- `update_at` datetime

### `music`
- `artist_id` int (FK)
- `title` varchar(255)
- `album_name` varchar(255)
- `genre` enum('rnb', 'country', 'classic', 'rock', 'jazz')
- `created_at` datetime
- `updated_at` datetime

### Relationship shown
- `artist.id` -> `music.artist_id` (one artist to many music rows)

## Reconciliation decisions for implementation

There is a mismatch between page-1 requirements and page-2 schema image:
- Page 1 uses **Song**, page 2 uses **music**.
- Page 1 requires RBAC roles (`super_admin`, `artist_manager`, `artist`), page 2 user schema does not explicitly show a `role` column.

Implementation choices to stay assignment-safe:
- Use table name **`songs`** (matches requirement text and your prompt).
- Add `users.role` enum with values `super_admin`, `artist_manager`, `artist`.
- Keep song genre options from diagram (`rnb`, `country`, `classic`, `rock`, `jazz`).
- Use snake_case standardized names (`address`, `updated_at`) while noting diagram typos/casing (`Address`, `update_at`).

These reconciliation assumptions will be documented in `README.md` during implementation.
