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

## Run with Docker (recommended)

From project root:

```bash
docker compose up --build
```

- API: http://localhost:4000
- Swagger: http://localhost:4000/docs
- (Backend uses env from backend/.env.docker)

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
- `/` — protected users list (redirects to `/login` if not authenticated)

---

## Environments
# backend
- cp backend/.env.example backend/.env - using for local running
- cp backend/.env.test.example backend/.env.test - using for tests running
- cp backend/.env.docker.example backend/.env.docker - using for docker running

# frontend
- cp frontend/.env.local.example frontend/.env.local

---

## API Overview

Base URL: `http://localhost:4000`

- `GET /docs` — Swagger UI
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login, sets HttpOnly cookie `token`
- `POST /api/auth/logout` — clear auth cookie
- `GET /api/users` — list users (requires cookie or Bearer token)

Auth endpoints are rate-limited.

---

## Notes

- Tests use a separate Postgres schema (configured via .env.test).
- Frontend talks to backend with `credentials: "include"` to send HttpOnly cookies.

