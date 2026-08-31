import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';

export default function SchoolsList() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    schoolsApi.list().then(({ data }) => setSchools(data.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Schools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schools.map((s) => (
          <Link
            key={s.id}
            to={`/schools/${s.slug}`}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold text-gray-900">{s.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {s.region?.name}{s.district && `, ${s.district.name}`}
            </p>
            {s.isVerified && (
              <span className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </Link>
        ))}
        {schools.length === 0 && (
          <p className="text-gray-500 text-sm col-span-2">No schools registered yet.</p>
        )}
      </div>
    </div>
  );
}
