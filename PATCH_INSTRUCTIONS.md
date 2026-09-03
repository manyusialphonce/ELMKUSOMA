# ELMKUSOMA — Patch: Admin Reference-Data Management

Hii ni patch ndogo, si mradi mzima. Ina faili mpya/zilizobadilika PEKEE
kutoka kwenye kazi yangu ya mwisho (Admin: Regions, Education Levels,
Subjects, Settings). Sikugusa Register.jsx, Login.jsx, Home.jsx, wala
ukurasa wako wa kuvinjari shule (Colleges, Universities, PrimarySchools,
n.k.) — hivyo bado ni vyako kikamilifu.

## 1. Backend — nakili moja kwa moja (FULL REPLACE, salama)

Nimethibitisha faili hizi 4 kwenye repo yako bado ni toleo la zamani
(halikuguswa na wewe), kwa hiyo unaweza kunakili moja kwa moja bila hofu:

```
backend/src/controllers/geography.controller.js   → REPLACE
backend/src/controllers/education.controller.js   → REPLACE
backend/src/routes/geography.routes.js             → REPLACE
backend/src/routes/education.routes.js             → REPLACE
```

Baada ya kunakili, kwa sababu schema.prisma haijabadilika (nimethibitisha
ni sawa 100% na yako), HAKUNA haja ya `prisma migrate` — endpoints mpya
zinatumia jedwali zilizopo tayari.

## 2. Frontend API files — nakili moja kwa moja (FULL REPLACE, salama)

Faili hizi mbili pia nimethibitisha bado ni toleo la zamani kwako:

```
frontend/src/api/reference.js   → REPLACE
frontend/src/api/admin.js       → REPLACE
```

## 3. Frontend Admin pages — faili MPYA kabisa (ONGEZA, hakuna mgongano)

```
frontend/src/views/admin/AdminRegions.jsx          → NEW FILE
frontend/src/views/admin/AdminEducationLevels.jsx  → NEW FILE
frontend/src/views/admin/AdminSubjects.jsx         → NEW FILE
frontend/src/views/admin/AdminSettings.jsx         → NEW FILE
```

## 4. router/index.jsx — HII USINAKILI, ONGEZA MISTARI TU

Router yako imepangwa vizuri kwa mtindo wako mwenyewe (comments, sections,
AuthLayout, ForgotPassword, School directory pages) — usiibadilishe yote.
Ongeza mistari ifuatayo tu:

**(a) Kwenye sehemu ya "ADMIN PAGES" (karibu na mstari 131), baada ya
`SchoolSetupWizard` import, ongeza:**

```jsx
const AdminRegions = lazy(() =>
  import('../views/admin/AdminRegions')
);

const AdminEducationLevels = lazy(() =>
  import('../views/admin/AdminEducationLevels')
);

const AdminSubjects = lazy(() =>
  import('../views/admin/AdminSubjects')
);

const AdminSettings = lazy(() =>
  import('../views/admin/AdminSettings')
);
```

**(b) Kwenye children array ya `/admin` route (karibu na mstari 490,
baada ya "SCHOOL SETUP" block), ongeza:**

```jsx
          // REGIONS & DISTRICTS
          {
            path: 'regions',
            element: page(<AdminRegions />),
          },

          // EDUCATION LEVELS & CLASSES
          {
            path: 'education-levels',
            element: page(<AdminEducationLevels />),
          },
          {
            path: 'classes',
            element: page(<AdminEducationLevels />),
          },

          // SUBJECTS
          {
            path: 'subjects',
            element: page(<AdminSubjects />),
          },

          // SETTINGS
          {
            path: 'settings',
            element: page(<AdminSettings />),
          },
```

Hiyo ndiyo yote. Baada ya hapo `npm run dev` (backend) na `npm run dev`
(frontend) — huhitaji `npm install` mpya kwa sababu hakuna package mpya
iliyoongezwa kwenye patch hii.

## Uthibitisho niliofanya kabla ya kukutumia hii

- Schema.prisma: sawa 100% na yako — hakuna tofauti.
- admin.routes.js: sawa 100% na yako — hakuna mabadiliko yanayohitajika.
- Faili zote 6 nilizosema "REPLACE" — nimezilinganisha na zako kwanza,
  zote hazikuwa zimeguswa (toleo la zamani kabisa), kwa hiyo ni salama.
