
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

/* =========================================================
   FALLBACK SCHOOL DATA

   Hii ni sample data ya frontend.
   Baadaye backend ikianza kufanya kazi, data itatoka API.
========================================================= */

const sampleSchools = [
  {
    id: 1,
    slug: 'bunge-primary-school',
    name: 'Bunge Primary School',
    academicLevel: 'Primary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Bunge, Kinondoni',
    students: 850,
    teachers: 32,
    isVerified: true,
  },

  {
    id: 2,
    slug: 'oysterbay-primary-school',
    name: 'Oysterbay Primary School',
    academicLevel: 'Primary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Oysterbay, Kinondoni',
    students: 720,
    teachers: 28,
    isVerified: true,
  },

  {
    id: 3,
    slug: 'tegeta-a-primary-school',
    name: 'Tegeta A Primary School',
    academicLevel: 'Primary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Tegeta A, Kinondoni',
    students: 910,
    teachers: 35,
    isVerified: true,
  },

  {
    id: 4,
    slug: 'mbezi-louis-primary-school',
    name: 'Mbezi Louis Primary School',
    academicLevel: 'Primary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mbezi Louis, Kinondoni',
    students: 680,
    teachers: 26,
    isVerified: true,
  },

  {
    id: 5,
    slug: 'mlimani-primary-school',
    name: 'Mlimani Primary School',
    academicLevel: 'Primary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mlimani, Kinondoni',
    students: 790,
    teachers: 30,
    isVerified: true,
  },

  {
    id: 10,
    slug: 'kinondoni-secondary-school',
    name: 'Kinondoni Secondary School',
    academicLevel: 'Secondary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Kinondoni, Dar es Salaam',
    students: 1200,
    teachers: 45,
    isVerified: true,
  },

  {
    id: 11,
    slug: 'ilala-secondary-school',
    name: 'Ilala Secondary School',
    academicLevel: 'Secondary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Ilala',
    location: 'Ilala, Dar es Salaam',
    students: 980,
    teachers: 38,
    isVerified: true,
  },

  {
    id: 12,
    slug: 'temeke-secondary-school',
    name: 'Temeke Secondary School',
    academicLevel: 'Secondary',
    schoolType: 'Government',
    region: 'Dar es Salaam',
    district: 'Temeke',
    location: 'Temeke, Dar es Salaam',
    students: 1100,
    teachers: 41,
    isVerified: false,
  },

  {
    id: 20,
    slug: 'dar-es-salaam-college',
    name: 'Dar es Salaam College',
    academicLevel: 'College',
    schoolType: 'Private',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Kinondoni, Dar es Salaam',
    students: 1500,
    teachers: 70,
    isVerified: true,
  },

  {
    id: 21,
    slug: 'tanzania-professional-college',
    name: 'Tanzania Professional College',
    academicLevel: 'College',
    schoolType: 'Private',
    region: 'Dar es Salaam',
    district: 'Ilala',
    location: 'Ilala, Dar es Salaam',
    students: 900,
    teachers: 42,
    isVerified: true,
  },

  {
    id: 30,
    slug: 'university-of-dar-es-salaam',
    name: 'University of Dar es Salaam',
    academicLevel: 'University',
    schoolType: 'Public',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mlimani, Dar es Salaam',
    students: 20000,
    teachers: 1200,
    isVerified: true,
  },

  {
    id: 31,
    slug: 'ardhi-university',
    name: 'Ardhi University',
    academicLevel: 'University',
    schoolType: 'Public',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Kijitonyama, Dar es Salaam',
    students: 8500,
    teachers: 500,
    isVerified: true,
  },

  {
    id: 40,
    slug: 'elmkusoma-private-school',
    name: 'ELMKUSOMA Private School',
    academicLevel: 'ELMKUSOMA',
    schoolType: 'Private',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Kinondoni, Dar es Salaam',
    students: 650,
    teachers: 25,
    isVerified: true,
    isElmkusoma: true,
  },

  {
    id: 41,
    slug: 'elmkusoma-academy',
    name: 'ELMKUSOMA Academy',
    academicLevel: 'ELMKUSOMA',
    schoolType: 'Private',
    region: 'Dar es Salaam',
    district: 'Ilala',
    location: 'Ilala, Dar es Salaam',
    students: 780,
    teachers: 29,
    isVerified: true,
    isElmkusoma: true,
  },
];


/* =========================================================
   CATEGORY INFORMATION
========================================================= */

const categoryInfo = {
  primary: {
    title: 'Primary Schools',
    description:
      'Explore registered primary schools and view their learning information, location, facilities and contact details.',
    icon: '🏫',
    level: 'Primary',
  },

  secondary: {
    title: 'Secondary Schools',
    description:
      'Explore secondary schools and view information about their education, location and school services.',
    icon: '📚',
    level: 'Secondary',
  },

  colleges: {
    title: 'Colleges',
    description:
      'Explore colleges and professional institutions available through ELMKUSOMA.',
    icon: '🏛️',
    level: 'College',
  },

  universities: {
    title: 'Universities',
    description:
      'Explore universities and higher learning institutions available through ELMKUSOMA.',
    icon: '🎓',
    level: 'University',
  },

  'elmkusoma-private': {
    title: 'ELMKUSOMA Private Schools',
    description:
      'Explore private schools available through the ELMKUSOMA platform.',
    icon: '⭐',
    level: 'ELMKUSOMA',
  },
};


/* =========================================================
   NORMALIZE SCHOOL DATA
========================================================= */

function normalizeSchool(school) {
  if (!school) return null;

  return {
    ...school,

    slug:
      school.slug ||
      school.name
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),

    name:
      school.name ||
      school.schoolName ||
      'Unnamed School',

    academicLevel:
      typeof school.academicLevel === 'object'
        ? school.academicLevel?.name
        : school.academicLevel,

    schoolType:
      typeof school.schoolType === 'object'
        ? school.schoolType?.name
        : school.schoolType,

    region:
      typeof school.region === 'object'
        ? school.region?.name
        : school.region,

    district:
      typeof school.district === 'object'
        ? school.district?.name
        : school.district,

    location:
      school.location ||
      school.address ||
      [
        typeof school.district === 'object'
          ? school.district?.name
          : school.district,

        typeof school.region === 'object'
          ? school.region?.name
          : school.region,
      ]
        .filter(Boolean)
        .join(', '),
  };
}


/* =========================================================
   CATEGORY MATCHING
========================================================= */

function schoolBelongsToCategory(school, category) {
  if (!school || !category) return false;

  const normalizedSchool = normalizeSchool(school);

  /* -----------------------------------------------
     ELMKUSOMA PRIVATE
  ------------------------------------------------ */

  if (category === 'elmkusoma-private') {
    return (
      normalizedSchool.isElmkusoma === true ||
      normalizedSchool.isElmkusomaPrivate === true ||
      String(normalizedSchool.academicLevel || '')
        .toLowerCase() === 'elmkusoma'
    );
  }

  /* -----------------------------------------------
     NORMAL CATEGORIES
  ------------------------------------------------ */

  const level =
    categoryInfo[category]?.level;

  if (!level) return false;

  return (
    String(normalizedSchool.academicLevel || '')
      .toLowerCase() === level.toLowerCase()
  );
}


/* =========================================================
   SCHOOL CARD
========================================================= */

function SchoolCard({ school }) {
  const normalizedSchool =
    normalizeSchool(school);

  return (
    <Link
      to={`/schools/${normalizedSchool.slug}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >

      {/* ================================================
          CARD HEADER
      ================================================= */}

      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 p-6 text-white">

        <div className="flex items-start justify-between gap-4">

          {/* SCHOOL INITIAL */}

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-blue-800 shadow-lg">
            {normalizedSchool.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          {/* VERIFIED */}

          {normalizedSchool.isVerified && (
            <span className="rounded-full border border-green-300/20 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-100">
              ✓ Verified
            </span>
          )}

        </div>

        {/* SCHOOL NAME */}

        <h3 className="mt-5 text-xl font-bold leading-7">
          {normalizedSchool.name}
        </h3>

        {/* LOCATION */}

        <p className="mt-2 text-sm text-blue-100">
          📍{' '}
          {normalizedSchool.location ||
            normalizedSchool.district ||
            normalizedSchool.region ||
            'Location unavailable'}
        </p>

      </div>


      {/* ================================================
          CARD BODY
      ================================================= */}

      <div className="p-6">

        {/* SCHOOL INFORMATION */}

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-xs text-slate-500">
              School Type
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {normalizedSchool.schoolType ||
                'Not available'}
            </p>

          </div>


          <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-xs text-slate-500">
              Region
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {normalizedSchool.region ||
                'Not available'}
            </p>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="mt-4 grid grid-cols-2 gap-3">

          <div className="rounded-xl border border-slate-100 p-3">

            <p className="text-xs text-slate-500">
              Students
            </p>

            <p className="mt-1 text-lg font-bold text-blue-700">
              {normalizedSchool.students
                ? Number(
                    normalizedSchool.students,
                  ).toLocaleString()
                : '—'}
            </p>

          </div>


          <div className="rounded-xl border border-slate-100 p-3">

            <p className="text-xs text-slate-500">
              Teachers
            </p>

            <p className="mt-1 text-lg font-bold text-green-700">
              {normalizedSchool.teachers
                ? Number(
                    normalizedSchool.teachers,
                  ).toLocaleString()
                : '—'}
            </p>

          </div>

        </div>


        {/* ACTION */}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

          <span className="text-sm font-bold text-slate-700">
            View School Details
          </span>

          <span className="text-lg font-bold text-blue-700 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>

        </div>

      </div>

    </Link>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SchoolCategory() {
  const { category } = useParams();

  const [schools, setSchools] =
    useState(sampleSchools);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  /* =====================================================
     CATEGORY
  ===================================================== */

  const currentCategory =
    categoryInfo[category];

  /* =====================================================
     LOAD SCHOOLS
  ===================================================== */

  useEffect(() => {
    let active = true;

    const loadSchools = async () => {
      try {
        setLoading(true);

        /*
         * Tunatumia API kupata schools.
         *
         * Kama backend inaruhusu filtering:
         * /schools?academicLevel=Primary
         *
         * Hata kama backend bado haifanyi filtering,
         * tutafanya filtering hapa frontend.
         */

        const response =
          await schoolsApi.list({
            academicLevel:
              currentCategory?.level,
          });

        const data =
          response?.data?.data ||
          response?.data ||
          [];

        if (
          active &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setSchools(data);
        } else if (active) {
          setSchools(sampleSchools);
        }

      } catch (error) {

        console.error(
          'Failed to load schools:',
          error,
        );

        if (active) {
          setSchools(sampleSchools);
        }

      } finally {

        if (active) {
          setLoading(false);
        }

      }
    };

    loadSchools();

    return () => {
      active = false;
    };

  }, [category, currentCategory?.level]);


  /* =====================================================
     INVALID CATEGORY
  ===================================================== */

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">

          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <div className="text-5xl">
              🔍
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Category Not Found
            </h1>

            <p className="mt-2 text-slate-500">
              The institution category you are looking
              for does not exist.
            </p>

            <Link
              to="/schools"
              className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              ← Back to Schools
            </Link>

          </div>

        </div>

      </div>
    );
  }


  /* =====================================================
     FILTER SCHOOLS
  ===================================================== */

  const categorySchools =
    schools
      .filter((school) =>
        schoolBelongsToCategory(
          school,
          category,
        ),
      )
      .filter((school) => {

        if (!search.trim()) {
          return true;
        }

        const normalized =
          normalizeSchool(school);

        const searchText =
          search.toLowerCase();

        return (
          normalized.name
            ?.toLowerCase()
            .includes(searchText) ||

          normalized.region
            ?.toLowerCase()
            .includes(searchText) ||

          normalized.district
            ?.toLowerCase()
            .includes(searchText) ||

          normalized.location
            ?.toLowerCase()
            .includes(searchText) ||

          normalized.schoolType
            ?.toLowerCase()
            .includes(searchText)
        );
      });


  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),_transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          {/* BACK */}

          <Link
            to="/schools"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white"
          >
            ← Back to Categories
          </Link>


          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">

            {/* ICON */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-4xl shadow-xl">
              {currentCategory.icon}
            </div>


            {/* TITLE */}

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                ELMKUSOMA Schools
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {currentCategory.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                {currentCategory.description}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Browse {currentCategory.title}
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Available Institutions
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {categorySchools.length}{' '}
              {categorySchools.length === 1
                ? 'institution'
                : 'institutions'}{' '}
              available
            </p>

          </div>


          {/* SEARCH */}

          <div className="w-full lg:max-w-sm">

            <label className="sr-only">
              Search schools
            </label>

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search school..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (

                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >

                  <div className="h-52 bg-slate-200" />

                  <div className="p-6">

                    <div className="h-5 w-3/4 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />

                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <div className="h-16 rounded-xl bg-slate-200" />

                      <div className="h-16 rounded-xl bg-slate-200" />

                    </div>

                    <div className="mt-5 h-10 rounded-xl bg-slate-200" />

                  </div>

                </div>

              ),
            )}

          </div>

        ) : (

          /* =================================================
             SCHOOL LIST
          ================================================= */

          categorySchools.length > 0 ? (

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {categorySchools.map(
                (school) => (

                  <SchoolCard
                    key={
                      school.id ||
                      school.slug
                    }
                    school={school}
                  />

                ),
              )}

            </div>

          ) : (

            /* =================================================
               NO SCHOOLS
            ================================================= */

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🏫
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No Institutions Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                {search
                  ? `No ${currentCategory.title.toLowerCase()} match your search.`
                  : `There are currently no ${currentCategory.title.toLowerCase()} available.`}

              </p>


              {search && (

                <button
                  type="button"
                  onClick={() =>
                    setSearch('')
                  }
                  className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Clear Search
                </button>

              )}


              {!search && (

                <Link
                  to="/schools"
                  className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  ← Back to Categories
                </Link>

              )}

            </div>

          )

        )}

      </main>

    </div>
  );
}

