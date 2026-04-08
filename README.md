# Artist Management System (RBAC)

This repository follows a phase-based implementation plan.

Current status: Phase 2 (Backend Core Setup) completed.

## Tech Constraints
- Backend runtime: Node.js
- Backend server: Node core `http` module
- Database: PostgreSQL
- DB driver: `pg`
- ORM: not used
- CRUD: raw SQL only

## Phase 1 Database Setup

## 1) Create Database
Create a database named `artist_management_db` in pgAdmin.

## 2) Run Schema
Open Query Tool on `artist_management_db` and execute:

```sql
\i /absolute/path/to/backend/sql/schema.sql
```

If using pgAdmin file-open, load and run [schema.sql](/Users/manojnepali/Desktop/artist-management-system-rbac/backend/sql/schema.sql).

## 3) Run Seed
Execute:

```sql
\i /absolute/path/to/backend/sql/seed.sql
```

Or run [seed.sql](/Users/manojnepali/Desktop/artist-management-system-rbac/backend/sql/seed.sql) from pgAdmin Query Tool.

## 4) Verify Seed Data
Run:

```sql
SELECT id, email, role FROM users ORDER BY id;
SELECT id, name FROM artists ORDER BY id;
SELECT id, artist_id, title FROM songs ORDER BY id;
SELECT user_id, artist_id FROM artist_user_links;
```

## 5) Seed Credentials
Seeded accounts:
- `suresh.adhikari@gmail.com` (`super_admin`) / `Suresh@123`
- `pramila.shrestha@gmail.com` (`artist_manager`) / `Pramila@123`
- `nabin.karki@gmail.com` (`artist`) / `Nabin@123`

## 6) Backend Environment (for upcoming phases)
Create backend `.env` later with:

```env
DATABASE_URL=postgresql://<db_user>:<db_password>@localhost:5432/artist_management_db
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=15m
PORT=4000
NODE_ENV=development
```

## 7) Run Backend (Phase 2)

From `backend` directory:

```bash
npm install
npm run dev
```

Health check endpoint:

```bash
curl http://localhost:4000/api/health
```
