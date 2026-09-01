
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

const fallbackSchoolDetails = {
  'bunge-primary-school': {
    name: 'Bunge Primary School',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    location: 'Bunge, Kinondoni',
    academicLevel: 'Primary Education',
    institutionType: 'primary',
    schoolType: 'Government',
    students: 850,
    teachers: 32,
    isVerified: true,
    isElmkusomaPrivate: false,
    phone: '+255 700 000 001',
    email: 'bungeprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',
    description:
      'Bunge Primary School is committed to providing quality primary education in a safe, inclusive and supportive learning environment. The school focuses on academic achievement, discipline, creativity and the development of responsible learners.',
    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],
    classesAvailable: [
      'Pre-Primary',
      'Standard I',
      'Standard II',
      'Standard III',
      'Standard IV',
      'Standard V',
      'Standard VI',
      'Standard VII',
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
    institutionType: 'primary',
    schoolType: 'Government',
    students: 720,
    teachers: 28,
    isVerified: true,
    isElmkusomaPrivate: false,
    phone: '+255 700 000 002',
    email: 'oysterbayprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',
    description:
      'Oysterbay Primary School provides a supportive learning environment where pupils are encouraged to achieve academic excellence, develop good character and participate actively in school and community activities.',
    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],
    classesAvailable: [
      'Pre-Primary',
      'Standard I',
      'Standard II',
      'Standard III',
      'Standard IV',
      'Standard V',
      'Standard VI',
      'Standard VII',
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
    institutionType: 'primary',
    schoolType: 'Government',
    students: 910,
    teachers: 35,
    isVerified: true,
    isElmkusomaPrivate: false,
    phone: '+255 700 000 003',
    email: 'tegetaprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',
    description:
      'Tegeta A Primary School provides an inclusive learning environment that supports pupils academically, socially and creatively.',
    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],
    classesAvailable: [
      'Pre-Primary',
      'Standard I',
      'Standard II',
      'Standard III',
      'Standard IV',
      'Standard V',
      'Standard VI',
      'Standard VII',
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
    institutionType: 'primary',
    schoolType: 'Government',
    students: 680,
    teachers: 26,
    isVerified: true,
    isElmkusomaPrivate: false,
    phone: '+255 700 000 004',
    email: 'mbezilouisprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',
    description:
      'Mbezi Louis Primary School is dedicated to providing accessible and quality education. The school promotes academic development, discipline, creativity and positive relationships among learners.',
    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],
    classesAvailable: [
      'Pre-Primary',
      'Standard I',
      'Standard II',
      'Standard III',
      'Standard IV',
      'Standard V',
      'Standard VI',
      'Standard VII',
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
    institutionType: 'primary',
    schoolType: 'Government',
    students: 790,
    teachers: 30,
    isVerified: true,
    isElmkusomaPrivate: false,
    phone: '+255 700 000 005',
    email: 'mlimaniprimary@elmkusoma.co.tz',
    website: 'www.elmkusoma.co.tz',
    description:
      'Mlimani Primary School promotes quality learning, creativity, discipline and active participation. The school aims to prepare learners with academic knowledge and practical skills for their future education.',
    educationLevels: [
      'Pre-Primary Education',
      'Primary Education',
    ],
    classesAvailable: [
      'Pre-Primary',
      'Standard I',
      'Standard II',
      'Standard III',
      'Standard IV',
      'Standard V',
      'Standard VI',
      'Standard VII',
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

function getInstitutionType(school) {
  const value = String(
    school?.institutionType ||
      school?.type ||
      school?.category ||
      ''
  ).toLowerCase();

  if (value.includes('primary')) return 'primary';
  if (value.includes('secondary')) return 'secondary';
  if (value.includes('college')) return 'college';
  if (value.includes('university')) return 'university';

  const academicLevel = String(
    school?.academicLevel || ''
  ).toLowerCase();

  if (academicLevel.includes('primary')) return 'primary';
  if (academicLevel.includes('secondary')) return 'secondary';

  return value;
}

function getSecondaryLevel(school) {
  const value = String(
    school?.educationLevel ||
      school?.secondaryLevel ||
      school?.academicLevel ||
      school?.level ||
      ''
  ).toLowerCase();

  if (
    value === 'both' ||
    value.includes('o-level & a-level') ||
    value.includes('o level & a level') ||
    (value.includes('ordinary') &&
      value.includes('advanced'))
  ) {
    return 'O-Level & A-Level';
  }

  if (
    value.includes('alevel') ||
    value.includes('a-level') ||
    value.includes('a level') ||
    value.includes('advanced')
  ) {
    return 'A-Level';
  }

  if (
    value.includes('olevel') ||
    value.includes('o-level') ||
    value.includes('o level') ||
    value.includes('ordinary')
  ) {
    return 'O-Level';
  }

  return null;
}

function getLocation(school) {
  if (school?.location) {
    return school.location;
  }

  const district =
    typeof school?.district === 'string'
      ? school.district
      : school?.district?.name;

  const region =
    typeof school?.region === 'string'
      ? school.region
      : school?.region?.name;

  return [district, region]
    .filter(Boolean)
    .join(', ');
}

function getArray(school, ...keys) {
  for (const key of keys) {
    if (Array.isArray(school?.[key])) {
      return school[key];
    }
  }

  return [];
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

function ListItems({ items }) {
  if (!items.length) {
    return (
      <p className="text-sm text-gray-500">
        Information not available.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => {
        const value =
          typeof item === 'string'
            ? item
            : item?.name ||
              item?.title ||
              item?.program ||
              'Information';

        return (
          <li
            key={`${value}-${index}`}
            className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700"
          >
            <span className="font-bold text-blue-700">
              ✓
            </span>

            <span>{value}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function SchoolDetail() {
  const { slug } = useParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(false);

    schoolsApi
      .getBySlug(slug)
      .then(({ data }) => {
        if (!isMounted) return;

        if (data?.data) {
          setSchool(data.data);
        } else {
          setSchool(
            fallbackSchoolDetails[slug] || null
          );
        }
      })
      .catch(() => {
        if (!isMounted) return;

        const fallback =
          fallbackSchoolDetails[slug];

        if (fallback) {
          setSchool(fallback);
        } else {
          setError(true);
          setSchool(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const institutionType = useMemo(
    () => getInstitutionType(school),
    [school]
  );

  const secondaryLevel = useMemo(
    () => getSecondaryLevel(school),
    [school]
  );

  const facilities = useMemo(
    () =>
      getArray(
        school,
        'facilities',
        'amenities'
      ),
    [school]
  );

  const subjects = useMemo(
    () =>
      getArray(
        school,
        'subjects',
        'subject'
      ),
    [school]
  );

  const educationLevels = useMemo(
    () =>
      getArray(
        school,
        'educationLevels',
        'educationLevel'
      ),
    [school]
  );

  const classes = useMemo(
    () =>
      getArray(
        school,
        'classesAvailable',
        'classes',
        'formLevels'
      ),
    [school]
  );

  const programs = useMemo(
    () =>
      getArray(
        school,
        'programs',
        'courses'
      ),
    [school]
  );

  const faculties = useMemo(
    () =>
      getArray(
        school,
        'faculties',
        'faculty'
      ),
    [school]
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 text-gray-600">
            Loading school information...
          </p>
        </div>
      </main>
    );
  }

  if (error || !school) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">🔍</div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            School Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            The institution you are looking for could
            not be found.
          </p>

          <Link
            to="/schools"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back to Schools
          </Link>
        </div>
      </main>
    );
  }

  const isPrivate =
    school?.isElmkusomaPrivate === true ||
    school?.isPrivate === true;

  const typeLabel =
    {
      primary: 'Primary School',
      secondary: 'Secondary School',
      college: 'College',
      university: 'University',
    }[institutionType] ||
    school?.schoolType ||
    'Institution';

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/schools"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Back to Schools
          </Link>

          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {typeLabel}
                </span>

                {isPrivate && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    ELMKUSOMA Private
                  </span>
                )}

                {school?.isVerified && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    ✓ Verified
                  </span>
                )}

              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {school.name}
              </h1>

              <p className="mt-3 text-gray-600">
                📍 {getLocation(school) || 'Location not provided'}
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main Column */}
          <div className="space-y-6 lg:col-span-2">

            <Section title="About the Institution">
              <p className="leading-7 text-gray-600">
                {school.description ||
                  'Institution description is not available.'}
              </p>
            </Section>

            {institutionType === 'primary' && (
              <>
                <Section title="Education Level">
                  <ListItems
                    items={educationLevels}
                  />
                </Section>

                <Section title="Classes Available">
                  <ListItems items={classes} />
                </Section>

                <Section title="Subjects">
                  <ListItems items={subjects} />
                </Section>
              </>
            )}

            {institutionType === 'secondary' && (
              <>
                <Section title="Education Level">
                  <div className="rounded-xl bg-blue-50 p-5">
                    <p className="text-sm text-gray-600">
                      Secondary Education
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-800">
                      {secondaryLevel ||
                        school?.educationLevel ||
                        'Information not available'}
                    </p>
                  </div>
                </Section>

                <Section title="Form Levels">
                  <ListItems items={classes} />
                </Section>

                <Section title="Subjects & Programs">
                  <ListItems
                    items={
                      subjects.length
                        ? subjects
                        : programs
                    }
                  />
                </Section>
              </>
            )}

            {institutionType === 'college' && (
              <Section title="Programs & Courses">
                <ListItems items={programs} />
              </Section>
            )}

            {institutionType === 'university' && (
              <>
                <Section title="Faculties">
                  <ListItems items={faculties} />
                </Section>

                <Section title="Programs & Courses">
                  <ListItems items={programs} />
                </Section>
              </>
            )}

            {facilities.length > 0 && (
              <Section title="Facilities">
                <ListItems items={facilities} />
              </Section>
            )}

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            <Section title="Institution Information">
              <dl className="space-y-4">

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Institution Type
                  </dt>

                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {typeLabel}
                  </dd>
                </div>

                {school.schoolType && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Type
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {school.schoolType}
                    </dd>
                  </div>
                )}

                {school.region && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Region
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {typeof school.region === 'string'
                        ? school.region
                        : school.region?.name}
                    </dd>
                  </div>
                )}

                {school.district && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      District
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {typeof school.district === 'string'
                        ? school.district
                        : school.district?.name}
                    </dd>
                  </div>
                )}

                {school.students != null && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Students
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {school.students}
                    </dd>
                  </div>
                )}

                {school.teachers != null && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Teachers
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {school.teachers}
                    </dd>
                  </div>
                )}

              </dl>
            </Section>

            <Section title="Contact Information">

              <div className="space-y-4 text-sm">

                {school.phone && (
                  <div>
                    <p className="font-semibold text-gray-800">
                      Phone
                    </p>

                    <a
                      href={`tel:${school.phone}`}
                      className="mt-1 block text-blue-700 hover:underline"
                    >
                      {school.phone}
                    </a>
                  </div>
                )}

                {school.email && (
                  <div>
                    <p className="font-semibold text-gray-800">
                      Email
                    </p>

                    <a
                      href={`mailto:${school.email}`}
                      className="mt-1 block break-all text-blue-700 hover:underline"
                    >
                      {school.email}
                    </a>
                  </div>
                )}

                {school.website && (
                  <div>
                    <p className="font-semibold text-gray-800">
                      Website
                    </p>

                    <a
                      href={
                        school.website.startsWith('http')
                          ? school.website
                          : `https://${school.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block break-all text-blue-700 hover:underline"
                    >
                      {school.website}
                    </a>
                  </div>
                )}

                {!school.phone &&
                  !school.email &&
                  !school.website && (
                    <p className="text-gray-500">
                      Contact information is not available.
                    </p>
                  )}

              </div>

            </Section>

          </aside>

        </div>

      </section>
    </main>
  );
}

