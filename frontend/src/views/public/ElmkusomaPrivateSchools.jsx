import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';
import InstitutionCard from '../../components/schools/InstitutionCard';
import SchoolFilters from '../../components/schools/SchoolFilters';

function isPrivateSchool(school) {
return (
school?.isElmkusomaPrivate === true ||
school?.isPrivate === true
);
}

export default function ElmkusomaPrivateSchools() {
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

const privateSchools = useMemo(
() => schools.filter(isPrivateSchool),
[schools]
);

const regions = useMemo(() => {
return [
...new Set(
privateSchools
.map((school) =>
typeof school?.region === 'string'
? school.region
: school?.region?.name
)
.filter(Boolean)
),
];
}, [privateSchools]);

const filtered = useMemo(() => {
const query = search.toLowerCase().trim();

```
return privateSchools.filter((school) => {
  const name =
    school?.name?.toLowerCase() || '';

  const location = [
    typeof school?.district === 'string'
      ? school.district
      : school?.district?.name,
    typeof school?.region === 'string'
      ? school.region
      : school?.region?.name,
  ]
    .filter(Boolean)
    .join(', ')
    .toLowerCase();

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

}, [privateSchools, search, region]);

return ( <main className="min-h-screen bg-gray-50"> <section className="border-b border-gray-200 bg-white"> <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"> <Link
         to="/schools"
         className="text-sm font-semibold text-blue-700 hover:text-blue-800"
       >
← Back to Categories </Link>

```
      <div className="mt-6 max-w-3xl">
        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          ELMKUSOMA Private
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          ELMKUSOMA Private Schools
        </h1>

        <p className="mt-3 text-gray-600">
          Explore private schools registered or connected with
          the ELMKUSOMA platform.
        </p>
      </div>
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
        Unable to load private schools. Please try again.
      </div>
    )}

    {loading ? (
      <div className="py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />
        <p className="mt-4 text-gray-600">
          Loading ELMKUSOMA private schools...
        </p>
      </div>
    ) : filtered.length === 0 ? (
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <div className="text-4xl">🏫</div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          No ELMKUSOMA private schools found
        </h2>

        <p className="mt-2 text-gray-600">
          No private schools are currently available in this
          category.
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
