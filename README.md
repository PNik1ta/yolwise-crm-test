# Yolwise CRM Test

Minimal CRM-like test project with:

- Backend API: auth + users
- Frontend: simple UI for auth and users list
- Docker, tests, Swagger docs

---

## Tech Stack

**Backend**

- Node.js, Express, TypeScript
- PostgreSQL + Prisma
- JWT auth (HttpOnly cookie + Bearer)
- bcrypt, express-rate-limit
- Jest + ts-jest + supertest
- Biome (lint/format)
- Docker + docker-compose
- swagger-ui-express

**Frontend**

- Next.js (App Router)
- React
- Plain CSS (no UI libs)

---

## Project Structure

```txt
yolwise-crm-test/
  backend/
  frontend/
  docker-compose.yml
```

---

## Why Prisma + PostgreSQL?

- Prisma + PostgreSQL give
  - Strong TypeScript types for the DB layer
  - Very quick iteration on schema + migrations
  - A clean way to split domain logic into modules later (`users`, customers, bookings, etc.)

---

## Auth decisions

- JWT is stored in an **HttpOnly cookie**:
  - Safer than localStorage (no direct JS access)
  - Nice DX for frontend – no need to manually attach token
- Also supports **Bearer** token in `Authorization` header, which is useful for:
  - Future integrations
  - API clients or mobile apps

---

## Migrations & test DB:

- There’s a separate **test database/schema** for Jest e2e tests:
  - Tests can safely call `prisma.user.deleteMany()` without touching real data.
  - This pattern scales to more domains (clear separation for `test` environment).

---

## Testing

- **Jest + Supertest** for backend:
  - e2e tests for auth:
    - registration (including password + fullName validation)
    - login
    - rate limiting
    - access control for `/api/users`
  - unit tests for password strength helper
- This is enough to show how I think about testing strategy:
  - Critical flows get e2e coverage
  - Pure logic (helpers/validators) get unit tests
  - More tests can be added per domain as the CRM grows

---

## Run with Docker (recommended)

From project root:

```bash
docker compose up --build
```

- API: http://localhost:4000
- Swagger: http://localhost:4000/docs
- Frontend: http://localhost:3000
- (Backend uses env from backend/.env.docker; frontend talks to backend via NEXT_PUBLIC_API_URL)

---

## Backend (local dev)

```bash
cd backend
npm install
# configure backend/.env with DATABASE_URL, JWT_SECRET, PORT=4000
npx prisma migrate deploy
npm run dev
```

API will be available at http://localhost:4000

### Backend scripts

```bash
npm run dev       # dev server
npm run build     # build TS -> dist
npm start         # run built server
npm run test:migrate # should be used before running npm test once to generate prisma client
npm test          # tests (Jest + supertest)
npm run lint      # Biome check
npm run lint:fix  # Biome autofix
```

---

## Frontend

```bash
cd frontend
npm install
# set NEXT_PUBLIC_API_URL=http://localhost:4000 in .env.local
npm run dev
```

- Frontend: http://localhost:3000
- `/login` — login/register page
- / — protected users list + welcome message (Welcome <Full Name>! To logout click here) (redirects to /login if not authenticated)

---

## Environments
# backend
- cp backend/.env.example backend/.env - using for local running
- cp backend/.env.test.example backend/.env.test - using for tests running
- cp backend/.env.docker.example backend/.env.docker - using for docker running

# frontend
- cp frontend/.env.local.example frontend/.env.local
- cp frontend/.env.docker.example frontend/.env.docker

---

## API Overview

Base URL: `http://localhost:4000`

- `GET /docs` — Swagger UI
- `POST /api/auth/register` — register user, returns user data and sets HttpOnly cookie token
- `POST /api/auth/login` — login, sets HttpOnly cookie `token`
- `POST /api/auth/logout` — clear auth cookie
- `GET /api/users` — list users (requires cookie or Bearer token)

Auth endpoints are rate-limited.

---

## Notes

- Tests use a separate Postgres schema (configured via .env.test).
- Frontend talks to backend with `credentials: "include"` to send HttpOnly cookies.
- Both backend and frontend can be run together via `docker compose up --build.`

