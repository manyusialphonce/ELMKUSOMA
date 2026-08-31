import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

const schoolDetails = {
  'bunge-primary-school': {
    name: 'Bunge Primary School',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Bunge, Kinondoni',
    academicLevel: 'Primary Education',
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
    name: 'Oysterbay Primary School',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Oysterbay, Kinondoni',
    academicLevel: 'Primary Education',
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
    name: 'Tegeta A Primary School',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Tegeta A, Kinondoni',
    academicLevel: 'Primary Education',
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
    name: 'Mbezi Louis Primary School',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mbezi Louis, Kinondoni',
    academicLevel: 'Primary Education',
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
    name: 'Mlimani Primary School',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Mlimani, Kinondoni',
    academicLevel: 'Primary Education',
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

export default function SchoolDetail() {
  const { slug } = useParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * First try to get the school from the API.
     */
    schoolsApi
      .getBySlug(slug)
      .then(({ data }) => {
        if (data?.data) {
          setSchool(data.data);
        } else {
          setSchool(schoolDetails[slug]);
        }
      })
      .catch(() => {
        /*
         * If API is unavailable,
         * use the five school details above.
         */
        setSchool(schoolDetails[slug]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-500 mt-4">
            Loading school information...
          </p>
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md">

          <div className="text-5xl">
            🔍
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-5">
            School Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The school you are looking for could not be found.
          </p>

          <Link
            to="/schools"
            className="inline-block mt-6 bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800"
          >
            ← Back to Schools
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Link
            to="/schools"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium"
          >
            ← Back to Schools
          </Link>


          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-8">

            {/* School logo */}

            <div className="w-20 h-20 rounded-2xl bg-white text-blue-800 flex items-center justify-center text-3xl font-bold shadow-lg">
              {school.name?.charAt(0)}
            </div>


            {/* School name */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl md:text-4xl font-bold">
                  {school.name}
                </h1>

                {school.isVerified && (
                  <span className="bg-green-500/20 border border-green-300/20 text-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </span>
                )}

              </div>


              <p className="text-blue-100 mt-3">
                📍 {school.location || school.district || 'Location unavailable'}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="lg:col-span-2 space-y-6">


            {/* ABOUT */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  📚
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    About the School
                  </h2>

                  <p className="text-sm text-gray-500">
                    School overview
                  </p>
                </div>

              </div>

              <p className="text-gray-600 leading-7">
                {school.description}
              </p>

            </section>


            {/* SCHOOL INFORMATION */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-5">
                School Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InfoCard
                  icon="🎓"
                  label="Academic Level"
                  value={school.academicLevel}
                />

                <InfoCard
                  icon="🏫"
                  label="School Type"
                  value={school.schoolType}
                />

                <InfoCard
                  icon="📍"
                  label="Region"
                  value={school.region}
                />

                <InfoCard
                  icon="🏙️"
                  label="District"
                  value={school.district}
                />

                <InfoCard
                  icon="📌"
                  label="Location"
                  value={school.location}
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

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                  🎓
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Education Levels
                </h2>

              </div>

              <div className="flex flex-wrap gap-3">

                {(school.educationLevels || []).map((level, index) => (

                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    {typeof level === 'string'
                      ? level
                      : level.educationLevel?.name}
                  </span>

                ))}

              </div>

            </section>


            {/* SUBJECTS */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  📖
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Subjects Offered
                  </h2>

                  <p className="text-sm text-gray-500">
                    Main subjects taught at the school
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {(school.subjects || []).map((subject, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >

                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      ✓
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      {subject}
                    </span>

                  </div>

                ))}

              </div>

            </section>


            {/* FACILITIES */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                  🏫
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    School Facilities
                  </h2>

                  <p className="text-sm text-gray-500">
                    Available facilities
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {(school.facilities || []).map((facility, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
                  >

                    <span className="text-green-600">
                      ✓
                    </span>

                    <span className="text-sm text-gray-700">
                      {facility}
                    </span>

                  </div>

                ))}

              </div>

            </section>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">


            {/* STATISTICS */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <h2 className="text-lg font-bold text-gray-900">
                School Statistics
              </h2>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="bg-blue-50 rounded-xl p-4">

                  <p className="text-xs text-gray-500">
                    Students
                  </p>

                  <p className="text-2xl font-bold text-blue-800 mt-1">
                    {school.students?.toLocaleString() || '—'}
                  </p>

                </div>


                <div className="bg-green-50 rounded-xl p-4">

                  <p className="text-xs text-gray-500">
                    Teachers
                  </p>

                  <p className="text-2xl font-bold text-green-800 mt-1">
                    {school.teachers || '—'}
                  </p>

                </div>

              </div>

            </section>


            {/* CONTACT */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Contact School
              </h2>

              <div className="space-y-4">

                {school.phone && (
                  <a
                    href={`tel:${school.phone}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition"
                  >

                    <span className="text-xl">
                      📞
                    </span>

                    <div>
                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {school.phone}
                      </p>
                    </div>

                  </a>
                )}


                {school.email && (
                  <a
                    href={`mailto:${school.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition"
                  >

                    <span className="text-xl">
                      ✉️
                    </span>

                    <div className="min-w-0">

                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="text-sm font-semibold text-gray-900 break-all">
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
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition"
                  >

                    <span className="text-xl">
                      🌐
                    </span>

                    <div>

                      <p className="text-xs text-gray-500">
                        Website
                      </p>

                      <p className="text-sm font-semibold text-blue-700">
                        Visit Website
                      </p>

                    </div>

                  </a>
                )}

              </div>

            </section>


            {/* VERIFICATION */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <h2 className="text-lg font-bold text-gray-900 mb-4">
                School Verification
              </h2>

              {school.isVerified ? (

                <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                  <div className="flex gap-3">

                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      ✓
                    </div>

                    <div>

                      <p className="font-semibold text-green-800">
                        Verified School
                      </p>

                      <p className="text-xs text-green-700 mt-1">
                        This school has been verified on ELM KUSOMA.
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">

                  <p className="font-semibold text-yellow-800">
                    Verification Pending
                  </p>

                </div>

              )}

            </section>


            {/* BROWSE OTHER SCHOOLS */}

            <section className="bg-blue-700 rounded-2xl p-6 text-white">

              <h2 className="text-lg font-bold">
                Explore More Schools
              </h2>

              <p className="text-blue-100 text-sm mt-2">
                Browse other schools available on ELM KUSOMA.
              </p>

              <Link
                to="/schools"
                className="inline-flex mt-5 bg-white text-blue-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50"
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

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          {icon}
        </div>

        <div>

          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="font-semibold text-gray-900 mt-1">
            {value || 'Not available'}
          </p>

        </div>

      </div>

    </div>
  );
}