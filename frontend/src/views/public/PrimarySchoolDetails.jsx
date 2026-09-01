
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

const fallbackSchools = {
  'bunge-primary-school': {
    id: 1,
    name: 'Bunge Primary School',
    slug: 'bunge-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Bunge, Kinondoni',
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A primary school committed to providing quality primary education in a safe and supportive environment.',
  },

  'oysterbay-primary-school': {
    id: 2,
    name: 'Oysterbay Primary School',
    slug: 'oysterbay-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Oysterbay, Kinondoni',
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A school focused on academic excellence, discipline and holistic development of pupils.',
  },

  'tegeta-a-primary-school': {
    id: 3,
    name: 'Tegeta A Primary School',
    slug: 'tegeta-a-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Tegeta, Kinondoni',
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'An inclusive learning environment supporting pupils academically and personally.',
  },

  'mbezi-louis-primary-school': {
    id: 4,
    name: 'Mbezi Louis Primary School',
    slug: 'mbezi-louis-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Mbezi Louis, Kinondoni',
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A community-focused primary school providing accessible and quality education.',
  },

  'mlimani-primary-school': {
    id: 5,
    name: 'Mlimani Primary School',
    slug: 'mlimani-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    location: 'Mlimani, Kinondoni',
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A school promoting quality learning, creativity, discipline and participation.',
  },
};

function getValue(value) {
  if (!value) return '';

  return typeof value === 'string'
    ? value
    : value.name || '';
}

export default function PrimarySchoolDetails() {
  const { slug } = useParams();

  const [school, setSchool] = useState(
    fallbackSchools[slug] || null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSchool() {
      try {
        /*
         * If your API already provides a slug endpoint,
         * replace this request with:
         *
         * schoolsApi.getBySlug(slug)
         *
         * The fallback remains available for development.
         */

        if (schoolsApi.getBySlug) {
          const response = await schoolsApi.getBySlug(slug);

          if (mounted && response?.data) {
            const apiSchool =
              response.data.data || response.data;

            if (apiSchool) {
              setSchool(apiSchool);
            }
          }
        }
      } catch {
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSchool();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const location = useMemo(() => {
    if (!school) return '';

    const district = getValue(school.district);
    const region = getValue(school.region);

    return [district, region]
      .filter(Boolean)
      .join(', ');
  }, [school]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading school information...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl">
            !
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            School not found
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            The school you are looking for could not be found.
            It may have been removed or the requested link may
            be invalid.
          </p>

          <Link
            to="/schools/primary"
            className="mt-8 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            ← Back to Primary Schools
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <Link
            to="/schools/primary"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
          >
            ← Back to Primary Schools
          </Link>

          <div className="mt-10 max-w-4xl">

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
                Primary School
              </span>

              {school.schoolType && (
                <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/20">
                  {school.schoolType}
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {school.name}
            </h1>

            {location && (
              <p className="mt-5 flex items-center gap-2 text-base text-blue-100">
                <span>📍</span>
                {location}
              </p>
            )}

            {school.description && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
                {school.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            We are currently showing available school information.
            Some information may not be up to date.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main Information */}
          <div className="space-y-8 lg:col-span-2">

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🏫
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    About the School
                  </h2>

                  <p className="text-sm text-gray-500">
                    Institution overview
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <p className="leading-7 text-gray-600">
                  {school.description ||
                    'Information about this school is currently being updated.'}
                </p>
              </div>
            </section>

            {/* Academic Information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Academic Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <InfoItem
                  label="Academic Level"
                  value={
                    school.academicLevel ||
                    'Primary Education'
                  }
                />

                <InfoItem
                  label="Institution Type"
                  value="Primary School"
                />

                <InfoItem
                  label="School Type"
                  value={
                    school.schoolType ||
                    'Not specified'
                  }
                />

                <InfoItem
                  label="Region"
                  value={
                    getValue(school.region) ||
                    'Not specified'
                  }
                />

                <InfoItem
                  label="District"
                  value={
                    getValue(school.district) ||
                    'Not specified'
                  }
                />

                <InfoItem
                  label="Location"
                  value={
                    school.location ||
                    location ||
                    'Not specified'
                  }
                />

              </div>
            </section>

            {/* Future Sections */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                School Services
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Services and facilities provided by the institution.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <Feature
                  title="Learning Environment"
                  description="Information about the school's learning environment."
                />

                <Feature
                  title="Student Services"
                  description="Information about services available to pupils."
                />

                <Feature
                  title="School Facilities"
                  description="Details about facilities and learning resources."
                />

                <Feature
                  title="Community Engagement"
                  description="Information about the school's community involvement."
                />

              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                School Information
              </h2>

              <div className="mt-5 space-y-4">

                <InfoRow
                  label="Name"
                  value={school.name}
                />

                <InfoRow
                  label="Region"
                  value={getValue(school.region)}
                />

                <InfoRow
                  label="District"
                  value={getValue(school.district)}
                />

                <InfoRow
                  label="Level"
                  value={school.academicLevel}
                />

                <InfoRow
                  label="Type"
                  value={school.schoolType}
                />

              </div>
            </section>

            <section className="rounded-2xl bg-blue-700 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                ℹ️
              </div>

              <h2 className="mt-5 text-lg font-bold">
                About ELMKUSOMA
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Explore educational institutions and access
                useful information to support informed
                education decisions.
              </p>

              <Link
                to="/schools/primary"
                className="mt-5 inline-flex items-center text-sm font-bold text-white hover:text-blue-100"
              >
                Explore more schools →
              </Link>
            </section>

          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-900">
        {value || 'Not specified'}
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value || 'Not specified'}
      </p>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:shadow-sm">
      <h3 className="font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

