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
        // Use database schools if they exist.
        // Otherwise keep the five sample schools.
        if (data?.data?.length > 0) {
          setSchools(data.data);
        }
      })
      .catch(() => {
        // Keep sample schools if API is unavailable.
        setSchools(sampleSchools);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*
   * Get unique regions
   */
  const regions = useMemo(() => {
    return [
      ...new Set(
        schools
          .map((school) => school.region?.name)
          .filter(Boolean)
      ),
    ];
  }, [schools]);

  /*
   * Get unique academic levels
   */
  const academicLevels = useMemo(() => {
    return [
      ...new Set(
        schools
          .map((school) => school.academicLevel)
          .filter(Boolean)
      ),
    ];
  }, [schools]);

  /*
   * Search + filters
   */
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

  /*
   * Clear all filters
   */
  const clearFilters = () => {
    setSearch('');
    setSelectedRegion('');
    setSelectedLevel('');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER / BLUE HERO SECTION
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* CENTERED BLUE BACKGROUND CONTENT */}
          <div className="flex flex-col items-center text-center">

            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider">
              ELMKUSOMA
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Find a School
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Explore schools, discover educational opportunities,
              and find detailed information about each school.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* ===================================================
            SEARCH AND FILTERS
        =================================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">


            {/* SEARCH */}

            <div className="md:col-span-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search schools
              </label>

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by school name, region or district..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

            </div>


            {/* REGION */}

            <div className="md:col-span-3">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Region
              </label>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Regions
                </option>

                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}

              </select>

            </div>


            {/* ACADEMIC LEVEL */}

            <div className="md:col-span-3">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Level
              </label>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Academic Levels
                </option>

                {academicLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* FILTER INFORMATION */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-gray-100">

            <p className="text-sm text-gray-500">

              Showing{' '}

              <span className="font-bold text-gray-900">
                {filteredSchools.length}
              </span>{' '}

              of{' '}

              <span className="font-bold text-gray-900">
                {schools.length}
              </span>{' '}

              schools

            </p>


            {(search || selectedRegion || selectedLevel) && (

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Clear all filters
              </button>

            )}

          </div>

        </div>


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5].map((item) => (

              <div
                key={item}
                className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
              >

                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>

                <div className="h-5 bg-gray-200 rounded mt-5 w-3/4"></div>

                <div className="h-4 bg-gray-200 rounded mt-3 w-1/2"></div>

                <div className="h-16 bg-gray-200 rounded mt-5"></div>

                <div className="h-10 bg-gray-200 rounded mt-5"></div>

              </div>

            ))}

          </div>

        ) : filteredSchools.length > 0 ? (

          /* =================================================
             SCHOOL CARDS
          ================================================= */

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredSchools.map((school) => (

              <Link
                key={school.id}
                to={`/schools/${school.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* CARD BODY */}

                <div className="p-6">

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-3">

                    {/* SCHOOL ICON */}

                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold group-hover:bg-blue-700 group-hover:text-white transition-colors">

                      {school.name?.charAt(0)}

                    </div>


                    {/* VERIFIED */}

                    {school.isVerified && (

                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">

                        ✓ Verified

                      </span>

                    )}

                  </div>


                  {/* SCHOOL NAME */}

                  <h2 className="text-xl font-bold text-gray-900 mt-5 group-hover:text-blue-700 transition-colors">

                    {school.name}

                  </h2>


                  {/* LOCATION */}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">

                    <span>📍</span>

                    <span>
                      {school.region?.name || 'Region unavailable'}
                    </span>

                    {school.district && (
                      <>
                        <span>•</span>

                        <span>
                          {school.district.name}
                        </span>
                      </>
                    )}

                  </div>


                  {/* DESCRIPTION */}

                  <p className="text-sm text-gray-500 leading-6 mt-4 line-clamp-2">

                    {school.description ||
                      'Quality education and learning opportunities for students.'}

                  </p>


                  {/* TAGS */}

                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">

                      🎓 {school.academicLevel || 'Primary'}

                    </span>

                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">

                      🏫 {school.schoolType || 'Government'}

                    </span>

                  </div>


                  {/* STATISTICS */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-xs text-gray-500">
                        Students
                      </p>

                      <p className="text-lg font-bold text-gray-900 mt-1">

                        {school.students
                          ? school.students.toLocaleString()
                          : '—'}

                      </p>

                    </div>


                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-xs text-gray-500">
                        Teachers
                      </p>

                      <p className="text-lg font-bold text-gray-900 mt-1">

                        {school.teachers || '—'}

                      </p>

                    </div>

                  </div>

                </div>


                {/* CARD FOOTER */}

                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">

                  <span className="text-sm font-semibold text-blue-700">
                    View School Details
                  </span>

                  <span className="text-lg text-blue-700 group-hover:translate-x-1 transition-transform">
                    →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        ) : (

          /* =================================================
             NO RESULTS
          ================================================= */

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 px-6">

            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              🔍
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No schools found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching for another school or change your filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold transition"
            >
              Clear Filters
            </button>

          </div>

        )}

      </main>

    </div>
  );
}