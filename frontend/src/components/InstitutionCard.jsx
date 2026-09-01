
import { Link } from 'react-router-dom';

export default function InstitutionCard({ school }) {
  if (!school) {
    return null;
  }

  const slug = school.slug;

  const region =
    typeof school.region === 'string'
      ? school.region
      : school.region?.name;

  const district =
    typeof school.district === 'string'
      ? school.district
      : school.district?.name;

  const location = [district, region]
    .filter(Boolean)
    .join(', ');

  const institutionType =
    school.institutionType ||
    school.type ||
    school.category ||
    'Institution';

  const detailsPath =
    institutionType.toLowerCase().includes('primary')
      ? `/schools/primary/${slug}`
      : `/schools/${slug}`;

  return (
    <Link
      to={detailsPath}
      className="group block h-full"
      aria-label={`View details for ${school.name}`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
        
        {/* Card Header */}
        <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-4xl shadow-lg backdrop-blur-sm">
            🏫
          </div>

          {school.isVerified && (
            <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-6">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
              {institutionType}
            </span>

            <h2 className="mt-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-700">
              {school.name || 'Unnamed Institution'}
            </h2>

            {location && (
              <p className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                <span aria-hidden="true">📍</span>
                <span>{location}</span>
              </p>
            )}

            {school.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                {school.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
            <span className="text-sm font-semibold text-blue-700">
              View school details
            </span>

            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-blue-700 group-hover:text-white"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

