import { useEffect, useMemo, useState } from 'react';
import { schoolsApi } from '../../api/schools';
import SchoolCategoryCard from '../../components/SchoolCategoryCard';

const sampleSchools = [
{
id: 1,
name: 'Bunge Primary School',
slug: 'bunge-primary-school',
institutionType: 'primary',
region: { name: 'Dar es Salaam' },
district: { name: 'Kinondoni' },
academicLevel: 'Primary',
schoolType: 'Government',
description:
'A primary school committed to providing quality education and developing confident and responsible learners.',
},
{
id: 2,
name: 'Oysterbay Primary School',
slug: 'oysterbay-primary-school',
institutionType: 'primary',
region: { name: 'Dar es Salaam' },
district: { name: 'Kinondoni' },
academicLevel: 'Primary',
schoolType: 'Government',
description:
'A learning institution focused on academic excellence, discipline and holistic development of pupils.',
},
{
id: 3,
name: 'Tegeta A Primary School',
slug: 'tegeta-a-primary-school',
institutionType: 'primary',
region: { name: 'Dar es Salaam' },
district: { name: 'Kinondoni' },
academicLevel: 'Primary',
schoolType: 'Government',
description:
'An inclusive learning environment supporting pupils in achieving their academic and personal potential.',
},
{
id: 4,
name: 'Mbezi Louis Primary School',
slug: 'mbezi-louis-primary-school',
institutionType: 'primary',
region: { name: 'Dar es Salaam' },
district: { name: 'Kinondoni' },
academicLevel: 'Primary',
schoolType: 'Government',
description:
'A community-focused primary school providing accessible and quality education for young learners.',
},
{
id: 5,
name: 'Mlimani Primary School',
slug: 'mlimani-primary-school',
institutionType: 'primary',
region: { name: 'Dar es Salaam' },
district: { name: 'Kinondoni' },
academicLevel: 'Primary',
schoolType: 'Government',
description:
'A school promoting quality learning, creativity, discipline and active participation among pupils.',
},
];

function getInstitutionType(school) {
return String(
school?.institutionType ||
school?.type ||
school?.category ||
''
).toLowerCase();
}

function isPrimary(school) {
const type = getInstitutionType(school);

if (type === 'primary' || type.includes('primary')) {
return true;
}

const academicLevel = String(
school?.academicLevel || ''
).toLowerCase();

return academicLevel.includes('primary');
}

function isSecondary(school) {
const type = getInstitutionType(school);

if (type === 'secondary' || type.includes('secondary')) {
return true;
}

const academicLevel = String(
school?.academicLevel || ''
).toLowerCase();

return academicLevel.includes('secondary');
}

function isCollege(school) {
const type = getInstitutionType(school);

return type === 'college' || type.includes('college');
}

function isUniversity(school) {
const type = getInstitutionType(school);

return (
type === 'university' ||
type.includes('university')
);
}

function isElmkusomaPrivate(school) {
return (
school?.isElmkusomaPrivate === true ||
school?.isPrivate === true
);
}

export default function SchoolsList() {
const [schools, setSchools] = useState(sampleSchools);
const [loading, setLoading] = useState(true);

useEffect(() => {
schoolsApi
.list()
.then(({ data }) => {
if (data?.data?.length > 0) {
setSchools(data.data);
}
})
.catch(() => {
setSchools(sampleSchools);
})
.finally(() => {
setLoading(false);
});
}, []);

const counts = useMemo(() => {
return {
primary: schools.filter(isPrimary).length,
secondary: schools.filter(isSecondary).length,
colleges: schools.filter(isCollege).length,
universities: schools.filter(isUniversity).length,
private: schools.filter(isElmkusomaPrivate).length,
};
}, [schools]);

const categories = [
{
title: 'Primary Schools',
description:
'Explore registered primary schools and their learning information.',
icon: '📚',
count: counts.primary,
to: '/schools/primary',
},
{
title: 'Secondary Schools',
description:
'Find O-Level and A-Level secondary schools.',
icon: '🎓',
count: counts.secondary,
to: '/schools/secondary',
},
{
title: 'Colleges',
description:
'Explore colleges and professional institutions.',
icon: '🏛️',
count: counts.colleges,
to: '/schools/colleges',
},
{
title: 'Universities',
description:
'Find universities and higher learning institutions.',
icon: '🎓',
count: counts.universities,
to: '/schools/universities',
},
{
title: 'ELMKUSOMA Private Schools',
description:
'Explore private schools available through the ELMKUSOMA platform.',
icon: '⭐',
count: counts.private,
to: '/schools/elmkusoma-private',
},
];

return ( <main className="min-h-screen bg-gray-50"> <section className="border-b border-gray-200 bg-white"> <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"> <div className="max-w-3xl"> <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
ELMKUSOMA Schools </p>

```
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Explore Educational Institutions
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Choose an institution category to discover schools,
          colleges and universities, then explore detailed
          information about each institution.
        </p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    {loading ? (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />
        <p className="mt-4 text-sm font-medium text-gray-600">
          Loading schools...
        </p>
      </div>
    ) : (
      <>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Choose a Category
          </h2>

          <p className="mt-2 text-gray-600">
            Browse institutions according to their education
            category.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <SchoolCategoryCard
              key={category.to}
              {...category}
            />
          ))}
        </div>
      </>
    )}
  </section>
</main>


);
}
