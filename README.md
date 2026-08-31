# ELMKUSOMA

Digital education platform for Tanzania — live classes, recorded lessons,
notes library, quizzes, assignments, subscriptions, and payments, from
Nursery to University.

## Structure

```
elmkusoma/
├── backend/     Express + Prisma + PostgreSQL — REST API
└── frontend/    React + Vite + Tailwind — SPA
```

The two are independent applications that only talk to each other over
HTTP. Each has its own `package.json`, its own `node_modules`, and its own
README with setup steps — start with `backend/README.md`.

## Quick start (run both, in two terminals)

**Terminal 1 — backend:**
```bash
cd backend
npm install
cp .env.example .env      # fill in your PostgreSQL connection string
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev               # http://localhost:8000
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL should point at the backend above
npm run dev                # http://localhost:5173
```

Then open `http://localhost:5173` in your browser.

## Stack

- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, JWT auth, RBAC
  (role-based access control), Selcom/ClickPesa payment strategy pattern
- **Frontend**: React, Vite, Tailwind CSS v4, React Router, Zustand, Axios

## Status

Auth (register/login/RBAC), geography/education reference data, schools,
and subscriptions/payments are built end to end on both sides. Live Classes,
Recordings, Quizzes, Assignments, and Notifications are the next modules —
see each project's README for exactly what's stubbed vs. built.
