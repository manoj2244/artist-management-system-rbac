# Coding Style Guide (Interview-Focused)

This project should look like practical human-written assignment code: clean, readable, and easy to explain.

## 1) Core principles
- Prefer clarity over cleverness.
- Keep functions short and single-purpose.
- Use explicit logic and straightforward control flow.
- Avoid unnecessary abstractions and overengineering.

## 2) Project structure rules
- Backend flow: `routes -> controllers -> services -> repositories`.
- Repositories contain raw SQL only (parameterized).
- Validation stays in dedicated validation utilities and request-level checks.
- Keep RBAC checks centralized in middleware and ownership checks in service/repository boundary.

## 3) Naming rules
- Use descriptive names:
  - `createUser`, `listArtists`, `updateSongById`
  - `validateArtistPayload`, `parsePagination`
  - `requireAuth`, `requireRole`
- Avoid vague names like `helper`, `temp`, `data1`, `process`.
- Keep file names and function names consistent with module purpose.

## 4) Formatting and style
- Use consistent indentation and spacing.
- Keep line length reasonable.
- Prefer early returns for validation and error branches.
- Keep conditionals explicit and readable.

## 5) SQL style
- Use parameterized SQL (`$1`, `$2`, ...), never string interpolation for values.
- Keep SQL readable with clear column lists (avoid `SELECT *` unless truly justified).
- Keep query names and repository method names aligned.

## 6) Error and response style
- Use one consistent JSON response shape across endpoints.
- Return validation errors in a predictable field-level format.
- Keep user-facing messages concise and clear.

## 7) No-code-comment rule (team preference)
- Do not add inline comments in production code files.
- Write self-explanatory code through naming and structure instead of comments.
- If documentation is needed, put it in docs or README, not inside code.

## 8) State management style (frontend)
- Use Zustand only for auth/user/role global state.
- Keep table/filter/form/pagination state local to pages/components.
- Avoid creating global stores for page-local concerns.

## 9) Commit quality rules
- Keep commits small and focused.
- Each commit should represent one logical change.
- Use clear commit messages with intent (`feat`, `fix`, `docs`, `chore`).
- Avoid mixing unrelated changes in a single commit.

## 10) Definition of readable code
- Another developer can understand a file in one pass.
- Business rules are obvious from function names and call flow.
- Minimal mental overhead to trace request -> validation -> authorization -> SQL -> response.
