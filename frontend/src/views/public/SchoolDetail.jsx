
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

/* =========================================================
   FALLBACK SCHOOL DATA
   Used when backend/API is unavailable
========================================================= */

const schoolDetails = {
  'bunge-primary-school': {
    id: 1,
    name: 'Bunge Primary School',
    slug: 'bunge-primary-school',

    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Bunge, Kinondoni',

    academicLevel: 'Primary',
    schoolType: 'Government',

    students: 850,
    teachers: 32,

    isVerified: true,

    phone: '+255 700 000 001',
    email: 'bungeprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',

    description:
      'Bunge Primary School is committed to providing quality primary education in a safe, inclusive and supportive learning environment. The school focuses on academic achievement, discipline, creativity and the development of responsible learners.',

    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],

    subjects: [
      'Mathematics',
      'English',
      'Kiswahili',
      'Science',
      'Social Studies',
      'Civics',
      'ICT',
      'Physical Education',
    ],

    facilities: [
      'Classrooms',
      'Library',
      'Computer Laboratory',
      'Science Laboratory',
      'Playground',
      'Clean Water',
      'Toilets',
    ],
  },

  'oysterbay-primary-school': {
    id: 2,
    name: 'Oysterbay Primary School',
    slug: 'oysterbay-primary-school',

    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Oysterbay, Kinondoni',

    academicLevel: 'Primary',
    schoolType: 'Government',

    students: 720,
    teachers: 28,

    isVerified: true,

    phone: '+255 700 000 002',
    email: 'oysterbayprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',

    description:
      'Oysterbay Primary School provides a supportive learning environment where pupils are encouraged to achieve academic excellence, develop good character and participate actively in school and community activities.',

    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],

    subjects: [
      'Mathematics',
      'English',
      'Kiswahili',
      'Science',
      'Social Studies',
      'Civics',
      'ICT',
      'Art and Sports',
    ],

    facilities: [
      'Classrooms',
      'Library',
      'Computer Laboratory',
      'Playground',
      'Clean Water',
      'School Garden',
    ],
  },

  'tegeta-a-primary-school': {
    id: 3,
    name: 'Tegeta A Primary School',
    slug: 'tegeta-a-primary-school',

    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Tegeta A, Kinondoni',

    academicLevel: 'Primary',
    schoolType: 'Government',

    students: 910,
    teachers: 35,

    isVerified: true,

    phone: '+255 700 000 003',
    email: 'tegetaprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',

    description:
      'Tegeta A Primary School provides an inclusive learning environment that supports pupils academically, socially and creatively. The school encourages active learning, discipline and community participation.',

    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],

    subjects: [
      'Mathematics',
      'English',
      'Kiswahili',
      'Science',
      'Social Studies',
      'Civics',
      'ICT',
      'Physical Education',
    ],

    facilities: [
      'Classrooms',
      'Library',
      'Computer Laboratory',
      'Science Laboratory',
      'Playground',
      'Clean Water',
      'Health Facility',
    ],
  },

  'mbezi-louis-primary-school': {
    id: 4,
    name: 'Mbezi Louis Primary School',
    slug: 'mbezi-louis-primary-school',

    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mbezi Louis, Kinondoni',

    academicLevel: 'Primary',
    schoolType: 'Government',

    students: 680,
    teachers: 26,

    isVerified: true,

    phone: '+255 700 000 004',
    email: 'mbezilouisprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',

    description:
      'Mbezi Louis Primary School is dedicated to providing accessible and quality education. The school promotes academic development, discipline, creativity and positive relationships among learners.',

    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],

    subjects: [
      'Mathematics',
      'English',
      'Kiswahili',
      'Science',
      'Social Studies',
      'Civics',
      'ICT',
      'Physical Education',
    ],

    facilities: [
      'Classrooms',
      'Library',
      'Computer Laboratory',
      'Playground',
      'Clean Water',
      'Toilets',
    ],
  },

  'mlimani-primary-school': {
    id: 5,
    name: 'Mlimani Primary School',
    slug: 'mlimani-primary-school',

    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mlimani, Kinondoni',

    academicLevel: 'Primary',
    schoolType: 'Government',

    students: 790,
    teachers: 30,

    isVerified: true,

    phone: '+255 700 000 005',
    email: 'mlimaniprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',

    description:
      'Mlimani Primary School promotes quality learning, creativity, discipline and active participation. The school aims to prepare learners with academic knowledge and practical skills for their future education.',

    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],

    subjects: [
      'Mathematics',
      'English',
      'Kiswahili',
      'Science',
      'Social Studies',
      'Civics',
      'ICT',
      'Art and Sports',
    ],

    facilities: [
      'Classrooms',
      'Library',
      'Computer Laboratory',
      'Science Laboratory',
      'Playground',
      'Clean Water',
      'School Garden',
    ],
  },
};


/* =========================================================
   NORMALIZE API DATA
========================================================= */

function normalizeSchool(data) {
  if (!data) return null;

  return {
    ...data,

    region:
      typeof data.region === 'object'
        ? data.region?.name
        : data.region,

    district:
      typeof data.district === 'object'
        ? data.district?.name
        : data.district,

    location:
      data.location ||
      data.address ||
      [
        typeof data.district === 'object'
          ? data.district?.name
          : data.district,

        typeof data.region === 'object'
          ? data.region?.name
          : data.region,
      ]
        .filter(Boolean)
        .join(', '),

    educationLevels: Array.isArray(data.educationLevels)
      ? data.educationLevels
      : [],

    subjects: Array.isArray(data.subjects)
      ? data.subjects.map((subject) =>
          typeof subject === 'string'
            ? subject
            : subject?.name ||
              subject?.subject?.name ||
              'Subject'
        )
      : [],

    facilities: Array.isArray(data.facilities)
      ? data.facilities.map((facility) =>
          typeof facility === 'string'
            ? facility
            : facility?.name ||
              facility?.facility?.name ||
              'Facility'
        )
      : [],
  };
}


/* =========================================================
   SCHOOL DETAIL PAGE
========================================================= */

export default function SchoolDetail() {
  const { slug } = useParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);


  /* =====================================================
     FETCH SCHOOL
  ===================================================== */

  useEffect(() => {
    let active = true;

    const fetchSchool = async () => {
      try {
        setLoading(true);

        const { data } =
          await schoolsApi.getBySlug(slug);

        const apiSchool =
          data?.data || data;

        if (active && apiSchool) {
          setSchool(
            normalizeSchool(apiSchool)
          );
        } else if (active) {
          setSchool(
            schoolDetails[slug] || null
          );
        }

      } catch (error) {
        console.error(
          'Failed to load school:',
          error
        );

        if (active) {
          setSchool(
            schoolDetails[slug] || null
          );
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSchool();

    return () => {
      active = false;
    };

  }, [slug]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading school information...
          </p>

        </div>

      </div>
    );
  }


  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!school) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="text-5xl">
            🔍
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            School Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            The school you are looking for could not be found.
          </p>

          <Link
            to="/schools"
            className="mt-6 inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            ← Back to Schools
          </Link>

        </div>

      </div>
    );
  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 text-white">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/schools"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white"
          >
            ← Back to Schools
          </Link>


          <div className="mt-8 flex flex-col items-start gap-6 md:flex-row md:items-center">

            {/* SCHOOL INITIAL */}

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-black text-blue-800 shadow-lg">

              {school.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>


            {/* SCHOOL NAME */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-black tracking-tight md:text-4xl">

                  {school.name}

                </h1>


                {school.isVerified && (

                  <span className="rounded-full border border-green-300/20 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-100">

                    ✓ Verified

                  </span>

                )}

              </div>


              <p className="mt-3 text-blue-100">

                📍{' '}

                {school.location ||
                  school.district ||
                  school.region ||
                  'Location unavailable'}

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">


            {/* ABOUT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  📚
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    About the School
                  </h2>

                  <p className="text-sm text-slate-500">
                    School overview
                  </p>

                </div>

              </div>


              <p className="leading-7 text-slate-600">

                {school.description ||
                  'Information about this school is currently being updated.'}

              </p>

            </section>


            {/* SCHOOL INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-bold text-slate-900">
                School Information
              </h2>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoCard
                  icon="🎓"
                  label="Academic Level"
                  value={
                    school.academicLevel
                  }
                />

                <InfoCard
                  icon="🏫"
                  label="School Type"
                  value={
                    school.schoolType
                  }
                />

                <InfoCard
                  icon="📍"
                  label="Region"
                  value={
                    school.region
                  }
                />

                <InfoCard
                  icon="🏙️"
                  label="District"
                  value={
                    school.district
                  }
                />

                <InfoCard
                  icon="📌"
                  label="Location"
                  value={
                    school.location
                  }
                />

                <InfoCard
                  icon="✓"
                  label="Status"
                  value={
                    school.isVerified
                      ? 'Verified School'
                      : 'Verification Pending'
                  }
                />

              </div>

            </section>


            {/* EDUCATION LEVELS */}

            {school.educationLevels?.length > 0 && (

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                    🎓
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Education Levels
                    </h2>

                    <p className="text-sm text-slate-500">
                      Levels offered by this institution
                    </p>

                  </div>

                </div>


                <div className="flex flex-wrap gap-3">

                  {school.educationLevels.map(
                    (level, index) => {

                      const levelName =
                        typeof level === 'string'
                          ? level
                          : level?.educationLevel?.name ||
                            level?.name ||
                            'Education Level';

                      return (

                        <span
                          key={index}
                          className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                        >
                          {levelName}
                        </span>

                      );
                    }
                  )}

                </div>

              </section>

            )}


            {/* SUBJECTS */}

            {school.subjects?.length > 0 && (

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
                    📖
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Subjects Offered
                    </h2>

                    <p className="text-sm text-slate-500">
                      Main subjects taught at the school
                    </p>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {school.subjects.map(
                    (subject, index) => (

                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-green-600">
                          ✓
                        </div>

                        <span className="text-sm font-medium text-slate-700">
                          {subject}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </section>

            )}


            {/* FACILITIES */}

            {school.facilities?.length > 0 && (

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    🏫
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      School Facilities
                    </h2>

                    <p className="text-sm text-slate-500">
                      Available facilities
                    </p>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {school.facilities.map(
                    (facility, index) => (

                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                      >

                        <span className="text-green-600">
                          ✓
                        </span>

                        <span className="text-sm text-slate-700">
                          {facility}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </section>

            )}

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">


            {/* STATISTICS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                School Statistics
              </h2>


              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-blue-50 p-4">

                  <p className="text-xs text-slate-500">
                    Students
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-800">

                    {school.students
                      ? Number(
                          school.students
                        ).toLocaleString()
                      : '—'}

                  </p>

                </div>


                <div className="rounded-xl bg-green-50 p-4">

                  <p className="text-xs text-slate-500">
                    Teachers
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-800">

                    {school.teachers
                      ? Number(
                          school.teachers
                        ).toLocaleString()
                      : '—'}

                  </p>

                </div>

              </div>

            </section>


            {/* CONTACT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Contact School
              </h2>


              <div className="space-y-4">


                {school.phone && (

                  <a
                    href={`tel:${school.phone}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50"
                  >

                    <span className="text-xl">
                      📞
                    </span>

                    <div>

                      <p className="text-xs text-slate-500">
                        Phone
                      </p>

                      <p className="text-sm font-semibold text-slate-900">
                        {school.phone}
                      </p>

                    </div>

                  </a>

                )}


                {school.email && (

                  <a
                    href={`mailto:${school.email}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50"
                  >

                    <span className="text-xl">
                      ✉️
                    </span>

                    <div className="min-w-0">

                      <p className="text-xs text-slate-500">
                        Email
                      </p>

                      <p className="break-all text-sm font-semibold text-slate-900">
                        {school.email}
                      </p>

                    </div>

                  </a>

                )}


                {school.website && (

                  <a
                    href={
                      school.website.startsWith('http')
                        ? school.website
                        : `https://${school.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50"
                  >

                    <span className="text-xl">
                      🌐
                    </span>

                    <div>

                      <p className="text-xs text-slate-500">
                        Website
                      </p>

                      <p className="text-sm font-semibold text-blue-700">
                        Visit Website
                      </p>

                    </div>

                  </a>

                )}


                {!school.phone &&
                  !school.email &&
                  !school.website && (

                    <p className="text-sm text-slate-500">
                      Contact information is not available yet.
                    </p>

                  )}

              </div>

            </section>


            {/* VERIFICATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-4 text-lg font-bold text-slate-900">
                School Verification
              </h2>


              {school.isVerified ? (

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      ✓
                    </div>

                    <div>

                      <p className="font-semibold text-green-800">
                        Verified School
                      </p>

                      <p className="mt-1 text-xs text-green-700">
                        This school has been verified on ELMKUSOMA.
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">

                  <p className="font-semibold text-yellow-800">
                    Verification Pending
                  </p>

                </div>

              )}

            </section>


            {/* EXPLORE MORE */}

            <section className="rounded-2xl bg-blue-700 p-6 text-white">

              <h2 className="text-lg font-bold">
                Explore More Schools
              </h2>

              <p className="mt-2 text-sm text-blue-100">
                Browse other schools available on ELMKUSOMA.
              </p>

              <Link
                to="/schools"
                className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Browse Schools →
              </Link>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
          {icon}
        </div>

        <div>

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {value || 'Not available'}
          </p>

        </div>

      </div>

    </div>
  );
}

