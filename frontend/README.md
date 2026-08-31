# ELMKUSOMA Frontend (React + Vite + Tailwind)

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your running backend
npm run dev
```

App runs at `http://localhost:5173`. Make sure `backend` is running at
`http://localhost:8000` first (or update `VITE_API_URL`).

## What's built

- **Auth**: Login, Register (role-aware — Student/Teacher/School Administrator),
  session restore on page load via Zustand (`src/stores/authStore.js`)
- **Routing**: `src/router/index.jsx` — role-guarded route tree for
  Public / Student / Teacher / Admin areas (`ProtectedRoute.jsx`)
- **Layouts**: sidebar navigation per role, matching SRS §24 exactly
  (`StudentLayout`, `TeacherLayout`, `AdminLayout`, `PublicLayout`)
- **API layer**: one file per resource under `src/api/` (`auth.js`,
  `schools.js`, `reference.js`, `subscriptions.js`), all going through a
  shared axios instance with automatic JWT attachment (`src/api/client.js`)
- **Teacher verification UX**: dashboard banner and register-page notice
  reflecting the identity-verification requirement from the founder's notes

## Still to build (stubbed as commented routes in `src/router/index.jsx`)

Live Classes, Recorded Lessons, Notes Library, Quizzes, Assignments, Results,
Subscription checkout flow, Notifications, Profile — one view file per item,
following the same pattern as `StudentDashboard.jsx` / `TeacherDashboard.jsx`.

## Verified working in this environment

- `npm install` — real packages installed (React, Vite, Tailwind v4, React
  Router, Axios, Zustand)
- `npm run build` — production build succeeds, 101 modules, no errors
- `npm run dev` — dev server boots and serves correctly on port 5173

## Real-time (Socket.IO)

`src/api/socket.js` holds a lazily-connected, JWT-authenticated Socket.IO
client. `src/hooks/useLiveClassSocket.js` joins a live class's room and wires
up event handlers for the lifetime of a component — used in
`TeacherLiveClasses.jsx` (question requests appear instantly) and can be
reused in the student-facing live class view once built.

## Pages added in this pass

- `StudentRecordings` — browse + play recordings via signed URL
- `StudentSubscription` — plan selection, Selcom/ClickPesa checkout, history
- `TeacherLiveClasses` — schedule, start/end, manage questions in real time
- `TeacherQuizzes` — dynamic question builder (MCQ/True-False/Short Answer)
- `TeacherAssignments` — create, view submissions, grade with comments
- `AdminTeacherVerifications` — approve/reject NIDA/Passport submissions

## Pages added — Parent module, Certificates, Audit Logs

- `ParentDashboard` — link a child by email, view their progress/quizzes/
  submissions/attendance inline (SRS v1.0 Parent module)
- `CertificateVerify` — public, no-login page for verifying a certificate by code
- `StudentCertificates` — student's own issued certificates
- `AdminAuditLogs` — admin view of recorded sensitive actions

Register now offers "Parent" as a self-registerable role, and login redirects
parents to `/parent` after authentication.

## Pages added — Nursery Games, Live Chat

- `NurseryGames` — grouped by Baby 1/2/3 exactly as sketched, video player +
  "I finished!" progress button
- Live chat panel added inline to `StudentLiveClasses` — real-time via the
  same `useLiveClassSocket` hook (separate from the teacher's structured
  Q&A panel in `TeacherLiveClasses`)

## Pages added — ED Advertising, Search, Academic Structure

- `EdAdvertising` — public page listing approved announcements
  (scholarships, admissions, exam results, etc.)
- `AdminAdvertisements` — moderation queue (approve/reject pending submissions)
- `SearchResults` — global search results page, wired to a search bar in
  `PublicLayout` header (searches lessons, recordings, resources, schools,
  teachers, subjects in one call)
- `api/academic.js` — ready for building Department/Programme/Course admin
  screens when needed (not yet built as pages)

## Dashboards now show real numbers

`StudentDashboard`, `TeacherDashboard`, and `AdminDashboard` all pull from
`/reports/*` instead of showing "—" placeholders. `TeacherLiveClasses` and
`StudentLiveClasses` now receive real Agora streaming credentials
(appId/token/channelName/uid) from `start`/`join` — currently logged to the
console as the wiring point; connect the Agora Web SDK there to render
actual video.

## Home page — redesigned marketing page

The public home page (`src/views/public/Home.jsx`) was rebuilt from a
generic hero into a page grounded in Tanzanian school culture:

**Design system** (see `@theme` in `src/index.css`):
- `ink` (#16241E) — chalkboard dark, used for the hero and bookend sections
- `paper` (#FAF9F4) — warm off-white for body sections
- `marigold` (#E8A33D) — primary CTA accent
- `forest` (#2F6B4F) — secondary accent, role-card links
- `margin` (#C1443D) — the signature "daftari" (exercise book) red margin
  rule, used as a structural device (hero edge, ladder connector), not decoration
- Type: **Fraunces** (display headlines), **IBM Plex Sans** (body),
  **IBM Plex Mono** (labels/eyebrows/marquee) — loaded via Google Fonts in `index.html`

**Sections, in order:**
1. Hero — bilingual headline ("Kila darasa. Kila mkoa. Daftari moja."),
   two CTAs (Get Started → `/register`, Explore → scrolls to `#explore`)
2. Marquee — real platform scope (education levels + regions), not fake
   usage stats — respects `prefers-reduced-motion`
3. Capability strip — 6 concrete facts about what the platform does
4. Learning Journey — Nursery → University as a numbered ladder (numbering
   is justified here since it's a real sequence)
5. Explore/Features — 8-card bento grid on dark background (`id="explore"`)
6. Built for everyone — Student/Teacher/Parent/School Administrator cards,
   each linking to `/register?role=X` (Register page now reads this query param)
7. Certificate trust band — links to the public verification page
8. Final CTA

`PublicLayout` header was also updated to match: Fraunces logo, marigold
Register button, search bar hidden below `sm` breakpoint to avoid squeezing
on small phones.

## Real video calls — Agora Web SDK wired in

`src/hooks/useAgoraClient.js` wraps Agora's official `agora-rtc-sdk-ng`
package: publishers (teachers) get their camera/mic created and published
automatically; subscribers (students) receive and render remote tracks as
they arrive. `src/components/common/LiveVideoStage.jsx` renders the actual
video tiles. Both `TeacherLiveClasses` and `StudentLiveClasses` now call
`agora.join(credentials, isPublisher, ...)` with the real token the backend
returns from `start`/`join` — no more `console.log` placeholder. Teachers
get mic/camera toggle buttons once connected.

**To test end-to-end:** set `AGORA_APP_ID`/`AGORA_APP_CERTIFICATE` in the
backend's `.env`, run both apps, have a teacher start a class and a student
join it in two different browser windows — real camera/mic video should
flow between them.

## Real charts — Recharts wired into Admin Dashboard

`AdminDashboard` now renders an actual pie chart (users by role) and two
bar charts (users/schools by region) fed by the existing `/reports/*`
endpoints — no more raw numbers only.

## Code-splitting

`src/router/index.jsx` now lazy-loads every page (`React.lazy` +
`Suspense`) instead of importing them all eagerly. This matters because
Agora's SDK and Recharts are both large — after this change, the initial
bundle dropped from ~2.3MB to ~392KB; the video SDK (~1.5MB) and charting
library (~377KB) only download when someone actually visits a live-class
page or the admin dashboard, respectively. This is expected/normal for a
site that includes a video-calling SDK — don't be alarmed if those
per-route chunks still show as "large" in the build output; they're lazy,
not part of what every visitor downloads.

## Institution Setup Wizard — now with a real UI

`SchoolSetupWizard` (`/admin/setup-school`) is a 4-step resumable wizard
backed by the `InstitutionSetupDraft` API built earlier:

1. **Basic Info** — name (auto-generates a URL slug), description
2. **Location** — region/district pickers (reuses `geographyApi`)
3. **Contact & Studio** — phone, email, website, and the `hasStudio` flag
   that determines whether the school can offer live streaming
4. **Review** — summary of everything entered, then "Create School"

Progress is saved to the backend after every step (`PUT /setup-drafts/:id`),
so an admin can close the tab and resume later — reopening the wizard calls
`GET /setup-drafts?type=school` first and picks up exactly where they left
off. Completing the wizard calls `POST /setup-drafts/:id/complete`, which
creates the real `School` record and redirects to its public profile page.

Also added: `SchoolsList` (`/schools`) and `SchoolDetail` (`/schools/:slug`)
— these were referenced by nav links and the wizard's redirect but hadn't
been built yet.
