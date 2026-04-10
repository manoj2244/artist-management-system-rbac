# Artist Management System (RBAC)

Admin panel to manage artists and their songs with role-based access control.

Built with Node.js (no framework), PostgreSQL (raw SQL only), and React.

---

## Tech used

- Backend: Node.js core http module, no express or any framework
- Database: PostgreSQL with raw SQL, no ORM
- Frontend: React with Vite and Zustand
- Auth: JWT stored in HTTP-only cookie

---

## How to run

### Step 1 - Database setup

Create the database and run the schema and seed files.

```bash
psql -U postgres -c "CREATE DATABASE artist_management_db;"
psql -U postgres -d artist_management_db -f backend/sql/schema.sql
psql -U postgres -d artist_management_db -f backend/sql/seed.sql
```

The seed file creates 3 default users, 3 artist profiles, 6 songs and the ownership link.

### Step 2 - Backend

```bash
cd backend
cp .env.example .env
```

Open .env and set your database credentials and a JWT secret.

```
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/artist_management_db
JWT_SECRET=any_long_random_string
```

Then install and run.

```bash
npm install
npm run dev
```

Backend runs on http://localhost:4000

You can verify it is working by visiting http://localhost:4000/api/health

### Step 3 - Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on http://localhost:5173

---

## Test accounts

The login page has quick-fill buttons for each role so you do not need to type these manually.

- super_admin: suresh.adhikari@gmail.com / Suresh@123
- artist_manager: pramila.shrestha@gmail.com / Pramila@123
- artist: nabin.karki@gmail.com / Nabin@123

The artist account (Nabin Karki) is already linked to his artist profile so he can manage songs immediately after login.

---

## What each role can do

super_admin can create, edit and delete user accounts. Can also view artists and their songs.

artist_manager can create, edit and delete artist profiles. Can import and export artists via CSV. Can view songs for any artist.

artist can only manage songs for their own artist profile. They cannot see other artists songs or touch any user or artist data.

---

## How to create a new artist account

This is the flow a real admin would follow.

1. Login as artist_manager and create an artist profile from the Artists page.
2. Login as super_admin and go to Users, click Add User.
3. Set the role to artist. A dropdown will appear showing unlinked artist profiles.
4. Select the correct artist profile from the dropdown and save.
5. The artist can now login with the credentials you set and manage their songs.

---

## CSV import format for artists

Use the sample file at backend/sql/sample_artists_import.csv as a reference.

Required columns: name, dob, gender, address, first_release_year, no_of_albums_released

- dob must be in YYYY-MM-DD format and a past date
- gender must be m, f or o
- first_release_year must be between 1900 and next year
- no_of_albums_released must be zero or a positive number

Rows that fail validation are skipped and reported in the response. Valid rows are still inserted.

---

## Assumptions

- Public registration creates artist_manager role by default
- super_admin is created via seed only, not through registration
- artist accounts must be created by super_admin and linked to an artist profile
- Deleting an artist also deletes all their songs
