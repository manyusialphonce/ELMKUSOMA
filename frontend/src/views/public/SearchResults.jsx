import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchApi } from '../../api/advertisements';

const SECTIONS = [
  { key: 'lessons', label: 'Lessons' },
  { key: 'recordings', label: 'Recorded Lessons' },
  { key: 'resources', label: 'Notes Library' },
  { key: 'schools', label: 'Schools' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'subjects', label: 'Subjects' },
];

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!q) return;
    searchApi.search(q).then(({ data }) => setResults(data.data)).catch(() => {});
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Search results for "{q}"</h1>

      {!results && <p className="text-gray-500 text-sm">Searching...</p>}

      {results && SECTIONS.map(({ key, label }) => {
        const items = results[key] || [];
        if (items.length === 0) return null;

        return (
          <div key={key} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">{label}</h2>
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className="text-sm border border-gray-100 rounded-md px-3 py-2">
                  {item.title || item.name || item.fullName}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {results && SECTIONS.every(({ key }) => (results[key] || []).length === 0) && (
        <p className="text-gray-500 text-sm">No results found.</p>
      )}
    </div>
  );
}
