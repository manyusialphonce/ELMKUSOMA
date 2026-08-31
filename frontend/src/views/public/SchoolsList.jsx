import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

const sampleSchools = [
  {
    id: 1,
    name: 'Bunge Primary School',
    slug: 'bunge-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 850,
    teachers: 32,
    isVerified: true,
    description:
      'A primary school committed to providing quality education and developing confident and responsible learners.',
  },
  {
    id: 2,
    name: 'Oysterbay Primary School',
    slug: 'oysterbay-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 720,
    teachers: 28,
    isVerified: true,
    description:
      'A learning institution focused on academic excellence, discipline and holistic development of pupils.',
  },
  {
    id: 3,
    name: 'Tegeta A Primary School',
    slug: 'tegeta-a-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 910,
    teachers: 35,
    isVerified: true,
    description:
      'An inclusive learning environment supporting pupils in achieving their academic and personal potential.',
  },
  {
    id: 4,
    name: 'Mbezi Louis Primary School',
    slug: 'mbezi-louis-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 680,
    teachers: 26,
    isVerified: true,
    description:
      'A community-focused primary school providing accessible and quality education for young learners.',
  },
  {
    id: 5,
    name: 'Mlimani Primary School',
    slug: 'mlimani-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 790,
    teachers: 30,
    isVerified: true,
    description:
      'A school promoting quality learning, creativity, discipline and active participation among pupils.',
  },
];

export default function SchoolsList() {
  const [schools, setSchools] = useState(sampleSchools);

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolsApi
      .list()
      .then(({ data }) => {
        if (data?.data?.length > 0) {
          setSchools(data.data);
        }
      })
      .catch(() => {
        setSchools(sampleSchools);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const regions = useMemo(() => {
    return [
      ...new Set(
        schools
          .map((school) => school.region?.name)
          .filter(Boolean),
      ),
    ];
  }, [schools]);

  const academicLevels = useMemo(() => {
    return [
      ...new Set(
        schools
          .map((school) => school.academicLevel)
          .filter(Boolean),
      ),
    ];
  }, [schools]);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const searchText = search.toLowerCase().trim();

      const schoolName = school.name?.toLowerCase() || '';
      const region = school.region?.name?.toLowerCase() || '';
      const district = school.district?.name?.toLowerCase() || '';

      const matchesSearch =
        searchText === '' ||
        schoolName.includes(searchText) ||
        region.includes(searchText) ||
        district.includes(searchText);

      const matchesRegion =
        selectedRegion === '' ||
        school.region?.name === selectedRegion;

      const matchesLevel =
        selectedLevel === '' ||
        school.academicLevel === selectedLevel;

      return (
        matchesSearch &&
        matchesRegion &&
        matchesLevel
      );
    });
  }, [
    schools,
    search,
    selectedRegion,
    selectedLevel,
  ]);

  const clearFilters = () => {
    setSearch('');
    setSelectedRegion('');
    setSelectedLevel('');
  };

  const totalStudents = useMemo(() => {
    return schools.reduce(
      (total, school) =>
        total + Number(school.students || 0),
      0,
    );
  }, [schools]);

  const totalTeachers = useMemo(() => {
    return schools.reduce(
      (total, school) =>
        total + Number(school.teachers || 0),
      0,
    );
  }, [schools]);

  const verifiedSchools = useMemo(() => {
    return schools.filter(
      (school) => school.isVerified,
    ).length;
  }, [schools]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================
          HERO SECTION
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">

        {/* SUBTLE BACKGROUND EFFECTS */}

        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

            {/* SMALL LABEL */}

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">

              <span className="h-2 w-2 rounded-full bg-sky-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                ELMKUSOMA Schools
              </span>

            </div>


            {/* TITLE */}

            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

              Find the right

              <span className="block text-sky-300">
                school for you.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">

              Explore schools, discover educational opportunities and
              find useful information to help you make the right
              educational choice.

            </p>

          </div>

        </div>

      </section>


      {/* ================================================
          MAIN CONTENT
      ================================================= */}

      <main className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">


        {/* ================================================
            SEARCH PANEL
        ================================================= */}

        <div className="-mt-8 relative z-20 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-7">

          <div className="mb-6 flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Search and explore schools
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Use the filters below to find schools that match
                what you are looking for.
              </p>

            </div>


            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">

              <span className="h-2 w-2 rounded-full bg-sky-500" />

              {schools.length} Available

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">


            {/* SEARCH */}

            <div className="md:col-span-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search schools
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="School name, region or district..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-12
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-sky-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-sky-500/10
                  "
                />

              </div>

            </div>


            {/* REGION */}

            <div className="md:col-span-3">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Region
              </label>

              <select
                value={selectedRegion}
                onChange={(e) =>
                  setSelectedRegion(e.target.value)
                }
                className="
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3.5
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-sky-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-sky-500/10
                "
              >

                <option value="">
                  All Regions
                </option>

                {regions.map((region) => (

                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>

                ))}

              </select>

            </div>


            {/* ACADEMIC LEVEL */}

            <div className="md:col-span-3">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Academic Level
              </label>

              <select
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(e.target.value)
                }
                className="
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3.5
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-sky-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-sky-500/10
                "
              >

                <option value="">
                  All Levels
                </option>

                {academicLevels.map((level) => (

                  <option
                    key={level}
                    value={level}
                  >
                    {level}
                  </option>

                ))}

              </select>

            </div>

          </div>


          {/* FILTER STATUS */}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">

              Showing{' '}

              <span className="font-bold text-slate-900">
                {filteredSchools.length}
              </span>{' '}

              of{' '}

              <span className="font-bold text-slate-900">
                {schools.length}
              </span>{' '}

              schools

            </p>


            {(search ||
              selectedRegion ||
              selectedLevel) && (

              <button
                onClick={clearFilters}
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-sky-700
                  transition
                  hover:text-slate-950
                "
              >

                <span>↺</span>

                Clear all filters

              </button>

            )}

          </div>

        </div>


        {/* ================================================
            STATISTICS
        ================================================= */}

        <section className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">


          {/* SCHOOLS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
                🏫
              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Schools
                </p>

                <p className="text-xl font-black text-slate-900">
                  {schools.length}
                </p>

              </div>

            </div>

          </div>


          {/* STUDENTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-lg">
                👨‍🎓
              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Students
                </p>

                <p className="text-xl font-black text-slate-900">
                  {totalStudents.toLocaleString()}
                </p>

              </div>

            </div>

          </div>


          {/* TEACHERS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                👩‍🏫
              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Teachers
                </p>

                <p className="text-xl font-black text-slate-900">
                  {totalTeachers.toLocaleString()}
                </p>

              </div>

            </div>

          </div>


          {/* VERIFIED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                ✓
              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Verified
                </p>

                <p className="text-xl font-black text-slate-900">
                  {verifiedSchools}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================
            SCHOOLS HEADER
        ================================================= */}

        <div className="mt-14 mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
              Explore Schools
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Discover educational opportunities.
            </h2>

          </div>


          <p className="text-sm text-slate-500">
            Browse available schools and learn more about them.
          </p>

        </div>


        {/* ================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (

              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-6 animate-pulse"
              >

                <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />

                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />

                <div className="mt-5 h-16 rounded bg-slate-200" />

                <div className="mt-5 h-20 rounded bg-slate-200" />

              </div>

            ))}

          </div>

        ) : filteredSchools.length > 0 ? (

          /* ================================================
              SCHOOL CARDS
          ================================================= */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredSchools.map((school) => (

              <Link
                key={school.id}
                to={`/schools/${school.slug}`}
                className="
                  group
                  flex
                  flex-col
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-slate-300
                  hover:shadow-xl
                  hover:shadow-slate-900/10
                "
              >


                {/* CARD BODY */}

                <div className="flex flex-1 flex-col p-6">


                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">


                    {/* SCHOOL INITIAL */}

                    <div className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-slate-900
                      text-xl
                      font-black
                      text-white
                      shadow-lg
                      shadow-slate-900/15
                      transition-all
                      duration-300
                      group-hover:bg-sky-600
                    ">

                      {school.name?.charAt(0)}

                    </div>


                    {/* VERIFIED */}

                    {school.isVerified && (

                      <span className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-emerald-100
                        bg-emerald-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-emerald-700
                      ">

                        <span className="
                          flex
                          h-4
                          w-4
                          items-center
                          justify-center
                          rounded-full
                          bg-emerald-500
                          text-[10px]
                          text-white
                        ">
                          ✓
                        </span>

                        Verified

                      </span>

                    )}

                  </div>


                  {/* SCHOOL NAME */}

                  <h2 className="mt-5 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700">

                    {school.name}

                  </h2>


                  {/* LOCATION */}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">

                    <span className="text-base">
                      📍
                    </span>

                    <span>
                      {school.region?.name ||
                        'Region unavailable'}
                    </span>

                    {school.district?.name && (
                      <>
                        <span className="text-slate-300">
                          •
                        </span>

                        <span>
                          {school.district.name}
                        </span>
                      </>
                    )}

                  </div>


                  {/* DESCRIPTION */}

                  <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-500 line-clamp-3">

                    {school.description ||
                      'Quality education and learning opportunities for students.'}

                  </p>


                  {/* TAGS */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    <span className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-sky-50
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-sky-700
                    ">

                      <span>🎓</span>

                      {school.academicLevel ||
                        'Primary'}

                    </span>


                    <span className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-slate-100
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-slate-600
                    ">

                      <span>🏫</span>

                      {school.schoolType ||
                        'Government'}

                    </span>

                  </div>


                  {/* STATS */}

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">


                    {/* STUDENTS */}

                    <div className="rounded-2xl bg-slate-50 p-4 transition group-hover:bg-sky-50">

                      <p className="text-xs font-medium text-slate-500">
                        Students
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-900">

                        {school.students
                          ? Number(
                              school.students,
                            ).toLocaleString()
                          : '—'}

                      </p>

                    </div>


                    {/* TEACHERS */}

                    <div className="rounded-2xl bg-slate-50 p-4 transition group-hover:bg-slate-100">

                      <p className="text-xs font-medium text-slate-500">
                        Teachers
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-900">

                        {school.teachers
                          ? Number(
                              school.teachers,
                            ).toLocaleString()
                          : '—'}

                      </p>

                    </div>

                  </div>

                </div>


                {/* CARD FOOTER */}

                <div className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-slate-100
                  bg-slate-50
                  px-6
                  py-4
                  transition-colors
                  group-hover:bg-slate-100
                ">

                  <span className="text-sm font-bold text-slate-800 group-hover:text-sky-700">

                    View School Details

                  </span>


                  <span className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-lg
                    text-slate-700
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:bg-slate-900
                    group-hover:text-white
                  ">

                    →

                  </span>

                </div>

              </Link>

            ))}

          </div>

        ) : (

          /* ================================================
              NO RESULTS
          ================================================= */

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
              🔍
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No schools found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">

              We could not find any schools matching your search
              and selected filters.

            </p>

            <button
              onClick={clearFilters}
              className="
                mt-6
                rounded-xl
                bg-slate-900
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-slate-900/20
                transition
                hover:-translate-y-0.5
                hover:bg-slate-800
              "
            >
              Clear Filters
            </button>

          </div>

        )}

      </main>

    </div>
  );
}