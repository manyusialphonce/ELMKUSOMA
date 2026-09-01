import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';
import InstitutionCard from '../../components/schools/InstitutionCard';
import SchoolFilters from '../../components/schools/SchoolFilters';

function isUniversity(school) {
const type = String(
school?.institutionType ||
school?.type ||
school?.category ||
''
).toLowerCase();

return (
type === 'university' ||
type.includes('university')
);
}

function getLocation(school) {
const region =
typeof school?.region === 'string'
? school.region
: school?.region?.name;

const district =
typeof school?.district === 'string'
? school.district
: school?.district?.name;

return [district, region].filter(Boolean).join(', ');
}

export default function Universities() {
const [schools, setSchools] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

const [search, setSearch] = useState('');
const [region, setRegion] = useState('');

useEffect(() => {
schoolsApi
.list()
.then(({ data }) => {
setSchools(data?.data || []);
})
.catch(() => {
setError(true);
})
.finally(() => {
setLoading(false);
});
}, []);

const universities = useMemo(
() => schools.filter(isUniversity),
[schools]
);

const regions = useMemo(() => {
return [
...new Set(
universities
.map((school) =>
typeof school?.region === 'string'
? school.region
: school?.region?.name
)
.filter(Boolean)
),
];
}, [universities]);

const filtered = useMemo(() => {
const query = search.toLowerCase().trim();

```
return universities.filter((school) => {
  const name =
    school?.name?.toLowerCase() || '';

  const location =
    getLocation(school).toLowerCase();

  const matchesSearch =
    !query ||
    name.includes(query) ||
    location.includes(query);

  const schoolRegion =
    typeof school?.region === 'string'
      ? school.region
      : school?.region?.name;

  return (
    matchesSearch &&
    (!region || schoolRegion === region)
  );
});
```

}, [universities, search, region]);

return ( <main className="min-h-screen bg-gray-50"> <section className="border-b border-gray-200 bg-white"> <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"> <Link
         to="/schools"
         className="text-sm font-semibold text-blue-700 hover:text-blue-800"
       >
← Back to Categories </Link>

```
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-700">
        Higher Education
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
        Universities
      </h1>

      <p className="mt-3 max-w-2xl text-gray-600">
        Find universities and higher learning institutions,
        including their faculties, programs and courses.
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
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Unable to load universities. Please try again.
      </div>
    )}

    {loading ? (
      <div className="py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />
        <p className="mt-4 text-gray-600">
          Loading universities...
        </p>
      </div>
    ) : filtered.length === 0 ? (
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <div className="text-4xl">🎓</div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          No universities found
        </h2>

        <p className="mt-2 text-gray-600">
          No universities match your current search and filters.
        </p>
      </div>
    ) : (
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((school) => (
          <InstitutionCard
            key={school.id || school.slug}
            school={school}
          />
        ))}
      </div>
    )}
  </section>
</main>


);
}
