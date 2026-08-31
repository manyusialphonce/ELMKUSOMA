# ELMKUSOMA Backend (Express + Prisma + PostgreSQL)

## Setup (run locally — Prisma's engine binary can't be fetched in a sandboxed environment)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in your local DB credentials
cp .env.example .env

# 3. Generate the Prisma client (downloads the query engine — needs real internet access)
npx prisma generate

# 4. Create the database and run all migrations
npx prisma migrate dev --name init

# 5. Seed reference data (Tanzania regions, education levels, universities, plans)
npm run prisma:seed

# 6. Start the dev server (auto-restarts on file changes)
npm run dev
```

The API will be running at `http://localhost:8000`. Health check: `GET /health`.

## Project layout

```
src/
├── app.js                 Express app setup (middleware, routes)
├── server.js              Entry point — starts the HTTP server
├── config/prisma.js        Prisma client singleton
├── middleware/
│   ├── authenticate.js      Verifies JWT, attaches req.user
│   ├── authorize.js         Role-based access control (RBAC)
│   ├── requireActiveSubscription.js   Enforces SRS BR-002/BR-004
│   ├── requireVerified.js   Blocks unverified teachers from publishing
│   ├── validate.js          Turns express-validator errors into ApiError
│   └── errorHandler.js      Centralized error responses
├── routes/                 One file per module, mounted under /api/v1:
│                            auth, geography, education, schools,
│                            subscriptions, payments, live-classes, questions,
│                            recordings, resources, quizzes, assignments,
│                            submissions, notifications, admin
├── controllers/            Request handlers — thin, delegate to services
├── services/payment/        Strategy-pattern payment providers (Selcom, ClickPesa)
├── validators/              express-validator rule sets per route
└── utils/
    ├── ApiError.js, asyncHandler.js, jwt.js, userResource.js
    └── signedUrl.js          Central content-protection gateway (SRS §11) —
                               the only place storageKey turns into a URL

prisma/
├── schema.prisma            Full data model (users → geography → education →
│                            schools → commerce → live classes → recordings →
│                            resources → quizzes → assignments → notifications)
└── seed.js                  Tanzania regions, education levels, universities, starter plans
```

## Testing the auth flow with curl

```bash
# Register a student
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Asha Juma","email":"asha@example.com","password":"Passw0rd1","role":"STUDENT"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"Passw0rd1"}'

# Use the returned token
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

## Notes carried over from the founder's original sketches

- Each school/college gets its own profile ("box") in the system — see `GET /api/v1/schools/:slug`.
- Teachers/lecturers require identity verification (NIDA/Passport) before they
  can publish content — enforced by `requireVerified` middleware, wired onto
  live-class/recording/resource/quiz/assignment creation routes. Admins
  review pending verifications via `GET /api/v1/admin/verifications`.
- Schools without a studio (`hasStudio: false`) are expected to offer recorded
  lessons only, not live streaming — enforce this check when wiring up the
  actual streaming provider call in `startLiveClass`.

## Modules built so far

| Module | Routes prefix | Notes |
|---|---|---|
| Auth | `/auth` | register, login, logout, me |
| Geography | `/geography` | regions, districts (Tanzania) |
| Education structure | `/education` | levels, classes, subjects, universities/faculties |
| Schools | `/schools` | list, detail, create |
| Subscriptions & Payments | `/subscriptions`, `/payments` | Selcom/ClickPesa strategy pattern |
| Live Classes | `/live-classes` | create/start/end/join/leave, attendance |
| Student Questions | `/questions` (+ nested under live-classes) | full SRS 10.8 workflow, real-time via Socket.IO |
| Recordings | `/recordings` | signed-URL playback, publish workflow |
| Notes Library (Resources) | `/resources` | signed-URL download, publish workflow |
| Quizzes | `/quizzes` | create with questions, auto-graded submission, results |
| Assignments | `/assignments`, `/submissions` | submit, grade, comments |
| Notifications | `/notifications` | list, mark read, internal `notifyUser()` helper |
| Admin | `/admin` | teacher verification queue, user management, audit logs |
| **Real-time (Socket.IO)** | `src/realtime/socket.js` | JWT-authenticated, room-per-live-class — emits `live-class:started/ended`, `question:requested/updated` |
| **Lessons & Progress** | `/lessons` | self-paced structured lessons (video/text), distinct from Live Classes/Recordings, with per-student progress tracking |
| **Certificates** | `/certificates` | issuance (with eligibility check against quiz pass state), public verification by code, revocation |
| **Parents** | `/parents` | link/unlink children, view linked child's lessons/quizzes/assignments/attendance |
| **Audit Logging** | `src/utils/auditLog.js` | records sensitive admin actions (suspend, verify, revoke) — queried via `/admin/audit-logs` |

## Real-time layer

`src/realtime/socket.js` attaches Socket.IO to the same HTTP server as the
REST API (`server.js` uses `http.createServer(app)` so both share one port).
Clients authenticate the socket handshake with the same JWT used for REST
calls, then join a `live-class:<id>` room. This replaces what Laravel Reverb
would do — no separate WebSocket process to run.

## Aligned with the expanded SRS v1.0

The founder's more detailed SRS (v1.0, React+Vite / Node-Express / Prisma /
PostgreSQL) introduced several concepts not in the original module set, now
implemented on top of the same architecture rather than replacing it:

- **Parent role** + `ParentStudent` linking — a parent links to a student by
  email, then can view that child's lesson progress, quiz results,
  assignment submissions, and live class attendance (read-only, scoped to
  linked children only).
- **Lesson + LessonProgress** — self-paced structured content (video or
  text), separate from live classes and recordings, matching the SRS
  activity diagram: open lesson → save progress → (optionally) take quiz.
- **Certificate** — issuance checks eligibility (e.g. quiz passing score)
  rather than assuming every request qualifies, generates a unique
  certificate number + verification code, and exposes a public
  no-auth-required verification endpoint (`GET /certificates/verify/:code`).
- **AuditLog** — every sensitive admin action (suspend/reactivate a user,
  approve/reject verification, issue/revoke a certificate) is recorded via
  `logAction()` and queryable at `/admin/audit-logs`.
- **NotificationPreference** — now wired into `notifyUser()`: in-app
  notifications are skipped if the user disabled them, or opted out of that
  specific category via `categoryFlags`. Manage via `GET/PUT
  /notifications/preferences`.
- **NurseryGame + NurseryGameProgress** — directly implements the founder's
  original sketch (Baby 1 → video reading, Baby 2 → video math, Baby 3 →
  reading game video). Seeded with one example game per baby group.
- **LiveChatMessage** — free-form chat during a live class, broadcast via
  Socket.IO (`chat:message` event), kept separate from the structured
  `StudentQuestion` approve/answer workflow since the two serve different
  purposes (casual chat vs. moderated Q&A).
- **Academic Structure (higher ed)** — `Department`, `AcademicProgramme`,
  `AcademicCourse`, `AcademicYear`, `Semester` extend the existing
  University/Faculty models for institutions that need full degree-programme
  structure, not just live classes by subject.
- **ED Advertising** — submissions go through `PENDING_APPROVAL` before
  becoming publicly visible (SRS BR-008), with a moderation queue at
  `/advertisements/pending` and approve/reject actions that notify the
  advertiser and write to the audit log.
- **SystemSetting** — simple key/value platform configuration, restricted to
  Super Administrator for writes (`PUT /admin/settings/:key`).
- **Unified Search** — `GET /search?q=...` searches lessons, recordings,
  resources, schools, teachers, and subjects in one call. Implemented on
  PostgreSQL for now (see Still to build for the Meilisearch swap path).

## Still to build

Attendance/quiz reporting dashboards with charts (raw numbers are now served
by `/reports/*` — charting is a frontend-only task from here), and richer
InstitutionSetupDraft wizard UI (backend endpoints exist, no frontend wizard
built yet).

## Live streaming — now real, not a placeholder

`src/services/streaming/index.js` generates genuine Agora RTC tokens using
Agora's own official `agora-token` npm package — this is a pure
cryptographic operation (no network call to Agora needed to generate a
token), verified working in this environment with Agora's published sample
credentials. Set `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` in `.env` (from
your Agora console) and `startLiveClass`/`joinLiveClass` will return real,
usable tokens immediately — the only remaining step is wiring the Agora Web
SDK into the frontend to actually publish/subscribe using them.

## Reports (SRS FR-REPORT)

`/reports/student/me`, `/reports/teacher/me`, `/reports/admin/overview`, and
`/reports/admin/geography` aggregate real data with Prisma (`count`,
`groupBy`, `aggregate`) — no mock numbers. Wired into the dashboard summary
cards on both the student, teacher, and admin frontend home pages.

## Institution Setup Draft (SRS v1.0 §18)

`/setup-drafts` supports a resumable multi-step wizard: start a draft,
save progress on each step (merged, not overwritten), and complete it to
create the actual `School` record in one transaction. No frontend wizard UI
built yet — the API is ready for one.


