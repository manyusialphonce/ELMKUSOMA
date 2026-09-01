import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { schoolsApi } from '../../api/schools';
import InstitutionCard from '../../components/InstitutionCard';
import SchoolFilters from '../../components/SchoolFilters';

const fallbackSchools = [
  {
    id: 1,
    name: 'Bunge Primary School',
    slug: 'bunge-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A primary school committed to providing quality primary education in a safe and supportive environment.',
  },
  {
    id: 2,
    name: 'Oysterbay Primary School',
    slug: 'oysterbay-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A school focused on academic excellence, discipline and holistic development of pupils.',
  },
  {
    id: 3,
    name: 'Tegeta A Primary School',
    slug: 'tegeta-a-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'An inclusive learning environment supporting pupils academically and personally.',
  },
  {
    id: 4,
    name: 'Mbezi Louis Primary School',
    slug: 'mbezi-louis-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A community-focused primary school providing accessible and quality education.',
  },
  {
    id: 5,
    name: 'Mlimani Primary School',
    slug: 'mlimani-primary-school',
    institutionType: 'primary',
    region: { name: 'Dar es Salaam' },
    district: { name: 'Kinondoni' },
    academicLevel: 'Primary Education',
    schoolType: 'Government',
    description:
      'A school promoting quality learning, creativity, discipline and participation.',
  },
];

function getLocation(school) {
  const region =
    typeof school?.region === 'string'
      ? school.region
      : school?.region?.name || '';

  const district =
    typeof school?.district === 'string'
      ? school.district
      : school?.district?.name || '';

  return [district, region]
    .filter(Boolean)
    .join(', ');
}

function getRegion(school) {
  return typeof school?.region === 'string'
    ? school.region
    : school?.region?.name || '';
}

function isPrimary(school) {
  const type = String(
    school?.institutionType ||
      school?.type ||
      school?.category ||
      ''
  ).toLowerCase();

  const level = String(
    school?.academicLevel || ''
  ).toLowerCase();

  return (
    type === 'primary' ||
    type.includes('primary') ||
    level.includes('primary')
  );
}

export default function PrimarySchools() {
  const [schools, setSchools] =
    useState(fallbackSchools);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [region, setRegion] =
    useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSchools() {
      try {
        setLoading(true);
        setError(false);

        const response =
          await schoolsApi.list();

        const data =
          response?.data?.data;

        if (
          isMounted &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setSchools(data);
        }
      } catch (err) {
        console.error(
          'Unable to load schools:',
          err
        );

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSchools();

    return () => {
      isMounted = false;
    };
  }, []);

  const primarySchools = useMemo(() => {
    return schools.filter(isPrimary);
  }, [schools]);

  const regions = useMemo(() => {
    const regionList =
      primarySchools
        .map(getRegion)
        .filter(Boolean);

    return [...new Set(regionList)].sort();
  }, [primarySchools]);

  const filteredSchools = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return primarySchools.filter(
      (school) => {
        const name =
          String(
            school?.name || ''
          ).toLowerCase();

        const location =
          getLocation(
            school
          ).toLowerCase();

        const matchesSearch =
          !searchText ||
          name.includes(searchText) ||
          location.includes(searchText);

        const matchesRegion =
          !region ||
          getRegion(school) === region;

        return (
          matchesSearch &&
          matchesRegion
        );
      }
    );
  }, [
    primarySchools,
    search,
    region,
  ]);

  return (
    <main className="min-h-screen bg-gray-50">

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/schools"
            className="inline-flex items-center text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            <span className="mr-2">
              ←
            </span>

            Back to Categories
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Schools
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Primary Schools
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Explore registered primary schools
            and discover information about their
            learning environment and services.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <SchoolFilters
          search={search}
          setSearch={setSearch}
          region={region}
          setRegion={setRegion}
          regions={regions}
        />

        {error && (
          <div
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            Unable to load schools from
            the server. Showing available
            school information instead.
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">

            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"
              aria-hidden="true"
            />

            <p className="mt-4 text-gray-600">
              Loading schools...
            </p>

          </div>
        ) : filteredSchools.length === 0 ? (

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div
              className="text-4xl"
              aria-hidden="true"
            >
              🔎
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No primary schools found
            </h2>

            <p className="mt-2 text-gray-600">
              Try changing your search or
              region filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRegion('');
              }}
              className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredSchools.map(
              (school) => (
                <InstitutionCard
                  key={
                    school.id ||
                    school.slug ||
                    school.name
                  }
                  school={school}
                />
              )
            )}

          </div>
        )}

      </section>

    </main>
  );
}