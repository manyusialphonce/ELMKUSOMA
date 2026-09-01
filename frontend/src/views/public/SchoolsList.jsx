
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

/* =========================================================
   SAMPLE SCHOOLS
   FRONTEND FALLBACK DATA
========================================================= */

const sampleSchools = [

  // =======================================================
  // PRIMARY SCHOOLS
  // =======================================================

  {
    id: 1,
    name: 'Bunge Primary School',
    slug: 'bunge-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Bunge, Kinondoni',
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
    location: 'Oysterbay, Kinondoni',
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
    location: 'Tegeta A, Kinondoni',
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
    location: 'Mbezi Louis, Kinondoni',
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 680,
    teachers: 26,
    isVerified: true,
    description:
      'Mbezi Louis Primary School is dedicated to providing accessible and quality education. The school promotes academic development, discipline, creativity and positive relationships among learners.',
  },

  {
    id: 5,
    name: 'Mlimani Primary School',
    slug: 'mlimani-primary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Mlimani, Kinondoni',
    academicLevel: 'Primary',
    schoolType: 'Government',
    students: 790,
    teachers: 30,
    isVerified: true,
    description:
      'Mlimani Primary School promotes quality learning, creativity, discipline and active participation. The school aims to prepare learners with academic knowledge and practical skills for their future education.',
  },

  // =======================================================
  // SECONDARY SCHOOLS
  // =======================================================

  {
    id: 10,
    name: 'Kivukoni Secondary School',
    slug: 'kivukoni-secondary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Ilala' },
    location: 'Kivukoni, Ilala',
    academicLevel: 'Secondary',
    secondaryCategory: 'O-Level',
    schoolType: 'Government',
    students: 1200,
    teachers: 58,
    isVerified: true,
    description:
      'A government secondary school providing quality Ordinary Level education.',
  },

  {
    id: 11,
    name: 'Mlimani Secondary School',
    slug: 'mlimani-secondary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Mlimani, Kinondoni',
    academicLevel: 'Secondary',
    secondaryCategory: 'A-Level',
    schoolType: 'Government',
    students: 650,
    teachers: 42,
    isVerified: true,
    description:
      'A secondary school focused on Advanced Level education and academic excellence.',
  },

  {
    id: 12,
    name: 'Azania Secondary School',
    slug: 'azania-secondary-school',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Ilala' },
    location: 'Azania, Ilala',
    academicLevel: 'Secondary',
    secondaryCategory: 'O-Level & A-Level',
    schoolType: 'Government',
    students: 1450,
    teachers: 65,
    isVerified: true,
    description:
      'A secondary school offering both Ordinary Level and Advanced Level education.',
  },

  // =======================================================
  // COLLEGES
  // =======================================================

  {
    id: 20,
    name: 'Dar Technical College',
    slug: 'dar-technical-college',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Ilala' },
    location: 'Ilala, Dar es Salaam',
    academicLevel: 'College',
    schoolType: 'Government',
    students: 1800,
    teachers: 95,
    isVerified: true,
    description:
      'A technical college offering professional and practical education programmes.',
  },

  {
    id: 21,
    name: 'Mbezi Health College',
    slug: 'mbezi-health-college',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Mbezi, Kinondoni',
    academicLevel: 'College',
    schoolType: 'Private',
    students: 900,
    teachers: 48,
    isVerified: true,
    description:
      'A private college offering health and professional training programmes.',
  },

  // =======================================================
  // UNIVERSITIES
  // =======================================================

  {
    id: 30,
    name: 'Tanzania Institute University',
    slug: 'tanzania-institute-university',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Kinondoni, Dar es Salaam',
    academicLevel: 'University',
    schoolType: 'Government',
    students: 8500,
    teachers: 420,
    isVerified: true,
    description:
      'A higher learning institution offering undergraduate and postgraduate programmes.',
  },

  {
    id: 31,
    name: 'East Africa University',
    slug: 'east-africa-university',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Ubungo' },
    location: 'Ubungo, Dar es Salaam',
    academicLevel: 'University',
    schoolType: 'Private',
    students: 6200,
    teachers: 310,
    isVerified: true,
    description:
      'A private university providing academic and professional higher education.',
  },

  // =======================================================
  // ELMKUSOMA PRIVATE
  // =======================================================

  {
    id: 40,
    name: 'ELMKUSOMA Academy',
    slug: 'elmkusoma-academy',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Kinondoni, Dar es Salaam',
    academicLevel: 'ELMKUSOMA',
    schoolType: 'Private',
    isElmkusoma: true,
    isElmkusomaPrivate: true,
    students: 450,
    teachers: 35,
    isVerified: true,
    description:
      'A private ELMKUSOMA partner institution focused on modern learning and digital education.',
  },

  {
    id: 41,
    name: 'ELMKUSOMA Learning Centre',
    slug: 'elmkusoma-learning-centre',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Ilala' },
    location: 'Ilala, Dar es Salaam',
    academicLevel: 'ELMKUSOMA',
    schoolType: 'Private',
    isElmkusoma: true,
    isElmkusomaPrivate: true,
    students: 320,
    teachers: 22,
    isVerified: true,
    description:
      'A private learning centre providing technology-supported education through ELMKUSOMA.',
  },

];


/* =========================================================
   CATEGORIES
========================================================= */

const categories = [

  {
    id: 'primary',
    title: 'Primary Schools',
    description:
      'Explore registered primary schools and their learning information.',
    icon: '🏫',
    level: 'Primary',
  },

  {
    id: 'secondary',
    title: 'Secondary Schools',
    description:
      'Find O-Level, A-Level and schools offering both levels.',
    icon: '📚',
    level: 'Secondary',
  },

  {
    id: 'colleges',
    title: 'Colleges',
    description:
      'Explore colleges and professional institutions.',
    icon: '🏛️',
    level: 'College',
  },

  {
    id: 'universities',
    title: 'Universities',
    description:
      'Find universities and higher learning institutions.',
    icon: '🎓',
    level: 'University',
  },

  {
    id: 'elmkusoma-private',
    title: 'ELMKUSOMA Private Schools',
    description:
      'Explore private schools available through the ELMKUSOMA platform.',
    icon: '⭐',
    level: 'ELMKUSOMA',
  },

];


/* =========================================================
   COMPONENT
========================================================= */

export default function SchoolsList() {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const categoryFromUrl =
    searchParams.get('category') || '';

  const [schools, setSchools] =
    useState(sampleSchools);

  const [search, setSearch] =
    useState('');

  const [selectedRegion, setSelectedRegion] =
    useState('');

  const [selectedSecondaryLevel, setSelectedSecondaryLevel] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  /* =====================================================
     LOAD SCHOOL DATA
  ===================================================== */

  useEffect(() => {

    let active = true;

    const loadSchools = async () => {

      try {

        const response =
          await schoolsApi.list();

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
        }

      } catch (error) {

        console.warn(
          'Using sample school data because API is unavailable.',
        );

        if (active) {
          setSchools(sampleSchools);
        }

      }

    };

    loadSchools();

    return () => {
      active = false;
    };

  }, []);


  /* =====================================================
     SELECTED CATEGORY
  ===================================================== */

  const selectedCategory =
    categories.find(
      (category) =>
        category.id === categoryFromUrl,
    );


  /* =====================================================
     REGIONS
  ===================================================== */

  const regions = useMemo(() => {

    return [
      ...new Set(
        schools
          .map((school) => {

            if (
              typeof school.region === 'string'
            ) {
              return school.region;
            }

            return school.region?.name;

          })
          .filter(Boolean),
      ),
    ];

  }, [schools]);


  /* =====================================================
     CATEGORY COUNT
  ===================================================== */

  const getCategoryCount =
    (category) => {

      return schools.filter(
        (school) => {

          if (
            category.id ===
            'elmkusoma-private'
          ) {

            return (
              school.isElmkusoma === true ||
              school.isElmkusomaPrivate === true ||
              school.academicLevel ===
                'ELMKUSOMA'
            );

          }

          return (
            String(
              school.academicLevel || '',
            ).toLowerCase() ===
            category.level.toLowerCase()
          );

        },
      ).length;

    };


  /* =====================================================
     FILTER SCHOOLS
  ===================================================== */

  const filteredSchools =
    useMemo(() => {

      return schools.filter(
        (school) => {

          const searchText =
            search
              .toLowerCase()
              .trim();


          const schoolName =
            school.name
              ?.toLowerCase() || '';


          const region =
            typeof school.region ===
            'string'
              ? school.region.toLowerCase()
              : school.region?.name
                  ?.toLowerCase() || '';


          const district =
            typeof school.district ===
            'string'
              ? school.district.toLowerCase()
              : school.district?.name
                  ?.toLowerCase() || '';


          /* SEARCH */

          const matchesSearch =
            searchText === '' ||
            schoolName.includes(
              searchText,
            ) ||
            region.includes(
              searchText,
            ) ||
            district.includes(
              searchText,
            );


          /* REGION */

          const schoolRegion =
            typeof school.region ===
            'string'
              ? school.region
              : school.region?.name;


          const matchesRegion =
            selectedRegion === '' ||
            schoolRegion ===
              selectedRegion;


          /* CATEGORY */

          let matchesCategory = true;


          if (categoryFromUrl) {

            if (
              categoryFromUrl ===
              'elmkusoma-private'
            ) {

              matchesCategory =
                school.isElmkusoma === true ||
                school.isElmkusomaPrivate === true ||
                school.academicLevel ===
                  'ELMKUSOMA';

            } else {

              const category =
                categories.find(
                  (item) =>
                    item.id ===
                    categoryFromUrl,
                );


              if (category) {

                matchesCategory =
                  String(
                    school.academicLevel ||
                      '',
                  ).toLowerCase() ===
                  category.level.toLowerCase();

              }

            }

          }


          /* SECONDARY LEVEL */

          let matchesSecondaryLevel =
            true;


          if (
            categoryFromUrl ===
              'secondary' &&
            selectedSecondaryLevel
          ) {

            const secondaryCategory =
              school.secondaryCategory ||
              school.secondaryLevel ||
              '';


            matchesSecondaryLevel =
              secondaryCategory ===
              selectedSecondaryLevel;

          }


          return (
            matchesSearch &&
            matchesRegion &&
            matchesCategory &&
            matchesSecondaryLevel
          );

        },
      );

    }, [
      schools,
      search,
      selectedRegion,
      categoryFromUrl,
      selectedSecondaryLevel,
    ]);


  /* =====================================================
     CATEGORY CLICK
  ===================================================== */

  const handleCategoryClick =
    (categoryId) => {

      setSearch('');

      setSelectedRegion('');

      setSelectedSecondaryLevel('');

      setSearchParams({
        category: categoryId,
      });

    };


  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {

    setSearch('');

    setSelectedRegion('');

    setSelectedSecondaryLevel('');

  };


  /* =====================================================
     BACK TO ALL CATEGORIES
  ===================================================== */

  const handleViewAll =
    () => {

      setSearch('');

      setSelectedRegion('');

      setSelectedSecondaryLevel('');

      setSearchParams({});

    };


  /* =====================================================
     HELPERS
  ===================================================== */

  const getRegionName =
    (region) => {

      if (
        typeof region === 'string'
      ) {
        return region;
      }

      return (
        region?.name ||
        'Region unavailable'
      );

    };


  const getDistrictName =
    (district) => {

      if (
        typeof district === 'string'
      ) {
        return district;
      }

      return district?.name || '';

    };


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

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              ELMKUSOMA Schools
            </span>


            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">

              Explore Education

              <span className="block text-blue-300">
                Institutions
              </span>

            </h1>


            <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg">

              Choose an institution category below
              to explore schools, colleges and
              universities available through ELMKUSOMA.

            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">


        {/* =================================================
            CATEGORY SECTION
        ================================================= */}

        <section>

          <div className="mb-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Browse Institutions
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Choose a category
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select the type of institution you want
              to explore.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {categories.map(
              (category) => {

                const count =
                  getCategoryCount(
                    category,
                  );

                const isActive =
                  categoryFromUrl ===
                  category.id;


                return (

                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        category.id,
                      )
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      p-6
                      text-left
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      ${
                        isActive
                          ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'border-slate-200 bg-white text-slate-900'
                      }
                    `}
                  >

                    {/* ICON */}

                    <div className="flex items-start justify-between">

                      <div
                        className={`
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          text-2xl
                          ${
                            isActive
                              ? 'bg-white/15'
                              : 'bg-slate-100'
                          }
                        `}
                      >
                        {category.icon}
                      </div>


                      {/* COUNT */}

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          ${
                            isActive
                              ? 'bg-white/15 text-white'
                              : 'bg-blue-50 text-blue-700'
                          }
                        `}
                      >
                        {count}
                      </span>

                    </div>


                    {/* TITLE */}

                    <h3 className="mt-6 text-lg font-bold">
                      {category.title}
                    </h3>


                    {/* DESCRIPTION */}

                    <p
                      className={`
                        mt-3
                        text-sm
                        leading-6
                        ${
                          isActive
                            ? 'text-blue-100'
                            : 'text-slate-500'
                        }
                      `}
                    >
                      {category.description}
                    </p>


                    {/* ACTION */}

                    <div
                      className={`
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        pt-5
                        ${
                          isActive
                            ? 'border-white/10'
                            : 'border-slate-100'
                        }
                      `}
                    >

                      <span className="text-sm font-bold">
                        Explore Category
                      </span>

                      <span className="text-lg font-bold">
                        →
                      </span>

                    </div>

                  </button>

                );

              },
            )}

          </div>

        </section>


        {/* =================================================
            SCHOOL LIST AREA
        ================================================= */}

        <section className="mt-12">


          {/* HEADER */}

          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Available Institutions
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">

                {selectedCategory
                  ? selectedCategory.title
                  : 'All Schools & Institutions'}

              </h2>

            </div>


            {categoryFromUrl && (

              <button
                type="button"
                onClick={handleViewAll}
                className="text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                ← View all categories
              </button>

            )}

          </div>


          {/* =================================================
              FILTER PANEL
          ================================================= */}

          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">


              {/* SEARCH */}

              <div className="md:col-span-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search school, region or district..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>


              {/* REGION */}

              <div className="md:col-span-3">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Region
                </label>

                <select
                  value={selectedRegion}
                  onChange={(event) =>
                    setSelectedRegion(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                >

                  <option value="">
                    All Regions
                  </option>

                  {regions.map(
                    (region) => (

                      <option
                        key={region}
                        value={region}
                      >
                        {region}
                      </option>

                    ),
                  )}

                </select>

              </div>


              {/* SECONDARY LEVEL */}

              {categoryFromUrl ===
                'secondary' && (

                <div className="md:col-span-4">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Secondary Level
                  </label>

                  <select
                    value={
                      selectedSecondaryLevel
                    }
                    onChange={(event) =>
                      setSelectedSecondaryLevel(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  >

                    <option value="">
                      All Secondary Levels
                    </option>

                    <option value="O-Level">
                      O-Level
                    </option>

                    <option value="A-Level">
                      A-Level
                    </option>

                    <option value="O-Level & A-Level">
                      O-Level & A-Level
                    </option>

                  </select>

                </div>

              )}

            </div>


            {/* STATUS */}

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">

                Showing{' '}

                <strong className="text-slate-900">
                  {filteredSchools.length}
                </strong>{' '}

                institutions

              </p>


              {(search ||
                selectedRegion ||
                selectedSecondaryLevel) && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-left text-sm font-bold text-blue-700 hover:text-blue-900"
                >
                  Clear filters
                </button>

              )}

            </div>

          </section>


          {/* =================================================
              RESULTS
          ================================================= */}

          {filteredSchools.length > 0 ? (

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredSchools.map(
                (school) => (

                  <Link
                    key={school.id}
                    to={`/schools/${school.slug}`}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >

                    <div className="flex flex-1 flex-col p-6">


                      {/* TOP */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-black text-white transition-colors group-hover:bg-blue-600">

                          {school.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>


                        {school.isVerified && (

                          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            ✓ Verified
                          </span>

                        )}

                      </div>


                      {/* NAME */}

                      <h3 className="mt-5 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">

                        {school.name}

                      </h3>


                      {/* LOCATION */}

                      <p className="mt-3 text-sm text-slate-500">

                        📍{' '}

                        {getRegionName(
                          school.region,
                        )}

                        {getDistrictName(
                          school.district,
                        ) && (

                          <>
                            {' • '}

                            {getDistrictName(
                              school.district,
                            )}
                          </>

                        )}

                      </p>


                      {/* DESCRIPTION */}

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">

                        {school.description ||
                          'Quality education and learning opportunities.'}

                      </p>


                      {/* TAGS */}

                      <div className="mt-5 flex flex-wrap gap-2">

                        <span className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">

                          🎓{' '}

                          {school.academicLevel}

                        </span>


                        {school.secondaryCategory && (

                          <span className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">

                            📚{' '}

                            {school.secondaryCategory}

                          </span>

                        )}


                        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">

                          🏫{' '}

                          {school.schoolType ||
                            'Not specified'}

                        </span>

                      </div>


                      {/* STATS */}

                      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

                        <div className="rounded-2xl bg-slate-50 p-4">

                          <p className="text-xs text-slate-500">
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


                        <div className="rounded-2xl bg-slate-50 p-4">

                          <p className="text-xs text-slate-500">
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


                    {/* FOOTER */}

                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 transition-colors group-hover:bg-blue-50">

                      <span className="text-sm font-bold text-slate-800">
                        View Details
                      </span>

                      <span className="text-lg font-bold text-blue-700 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>

                    </div>

                  </Link>

                ),
              )}

            </div>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">

              <div className="text-5xl">
                🔍
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No institutions found
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Try changing your category or search filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Clear Filters
              </button>

            </div>

          )}

        </section>

      </main>

    </div>

  );

}

