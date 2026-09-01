import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';
import InstitutionCard from '../../components/schools/InstitutionCard';
import SchoolFilters from '../../components/schools/SchoolFilters';

const LEVELS = [
{ value: '', label: 'All Secondary Schools' },
{ value: 'olevel', label: 'O-Level' },
{ value: 'alevel', label: 'A-Level' },
{ value: 'both', label: 'O-Level & A-Level' },
];

function getInstitutionType(school) {
return String(
school?.institutionType ||
school?.type ||
school?.category ||
''
).toLowerCase();
}

function isSecondary(school) {
const type = getInstitutionType(school);

const academicLevel = String(
school?.academicLevel || ''
).toLowerCase();

return (
type === 'secondary' ||
type.includes('secondary') ||
academicLevel.includes('secondary')
);
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
value.includes('ordinary & advanced') ||
(value.includes('ordinary') && value.includes('advanced'))
) {
return 'both';
}

if (
value === 'alevel' ||
value.includes('a-level') ||
value.includes('a level') ||
value.includes('advanced level') ||
value.includes('advanced')
) {
return 'alevel';
}

if (
value === 'olevel' ||
value.includes('o-level') ||
value.includes('o level') ||
value.includes('ordinary level') ||
value.includes('ordinary')
) {
return 'olevel';
}

return '';
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

export default function SecondarySchools() {
const [schools, setSchools] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

const [search, setSearch] = useState('');
const [region, setRegion] = useState('');
const [level, setLevel] = useState('');

useEffect(() => {
schoolsApi
.list()
.then(({ data }) => {
setSchools(data?.data || []);
})
.catch(() => {
setError(true);
setSchools([]);
})
.finally(() => {
setLoading(false);
});
}, []);

const secondarySchools = useMemo(
() => schools.filter(isSecondary),
[schools]
);

const regions = useMemo(() => {
return [
...new Set(
secondarySchools
.map((school) =>
typeof school?.region === 'string'
? school.region
: school?.region?.name
)
.filter(Boolean)
),
];
}, [secondarySchools]);

const filteredSchools = useMemo(() => {
const searchText = search.toLowerCase().trim();

```
return secondarySchools.filter((school) => {
  const name =
    school?.name?.toLowerCase() || '';

  const location =
    getLocation(school).toLowerCase();

  const schoolLevel = getSecondaryLevel(school);

  const matchesSearch =
    !searchText ||
    name.includes(searchText) ||
    location.includes(searchText);

  const matchesRegion =
    !region ||
    (typeof school?.region === 'string'
      ? school.region
      : school?.region?.name) === region;

  const matchesLevel =
    !level || schoolLevel === level;

  return (
    matchesSearch &&
    matchesRegion &&
    matchesLevel
  );
});
```

}, [
secondarySchools,
search,
region,
level,
]);

return ( <main className="min-h-screen bg-gray-50"> <section className="border-b border-gray-200 bg-white"> <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"> <Link
         to="/schools"
         className="text-sm font-semibold text-blue-700 hover:text-blue-800"
       >
← Back to Categories </Link>

```
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-700">
        Schools
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
        Secondary Schools
      </h1>

      <p className="mt-3 max-w-2xl text-gray-600">
        Find secondary schools and filter them by O-Level,
        A-Level or both education levels.
      </p>
    </div>
  </section>

  <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-5 flex flex-wrap gap-2">
      {LEVELS.map((item) => {
        const active = level === item.value;

        return (
          <button
            key={item.value || 'all'}
            type="button"
            onClick={() => setLevel(item.value)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? 'bg-blue-700 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>

    <SchoolFilters
      search={search}
      setSearch={setSearch}
      region={region}
      setRegion={setRegion}
      regions={regions}
      level={level}
      setLevel={setLevel}
      levelOptions={LEVELS.slice(1)}
      showLevel={true}
    />

    {error && (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Unable to load schools. Please try again.
      </div>
    )}

    {loading ? (
      <div className="py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />
        <p className="mt-4 text-gray-600">
          Loading secondary schools...
        </p>
      </div>
    ) : filteredSchools.length === 0 ? (
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <div className="text-4xl">🎓</div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          No secondary schools found
        </h2>

        <p className="mt-2 text-gray-600">
          Try another education level, region or search term.
        </p>
      </div>
    ) : (
      <>
        <div className="mt-8 mb-4">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <strong className="text-gray-800">
              {filteredSchools.length}
            </strong>{' '}
            secondary schools
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchools.map((school) => (
            <InstitutionCard
              key={school.id || school.slug}
              school={school}
            />
          ))}
        </div>
      </>
    )}
  </section>
</main>


);
}
