
import { Link } from 'react-router-dom';

export default function InstitutionCard({ school }) {
  if (!school) return null;

  const schoolSlug =
    school.slug ||
    school.name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

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

  return (
    <Link
      to={`/schools/primary/${schoolSlug}`}
      className="group block h-full"
      aria-label={`View details for ${school.name}`}
    >
      <article
        className="
          relative flex h-full flex-col overflow-hidden
          rounded-2xl border border-gray-200 bg-white
          shadow-sm transition-all duration-300
          hover:-translate-y-1 hover:border-blue-200
          hover:shadow-xl focus-within:ring-2
          focus-within:ring-blue-600 focus-within:ring-offset-2
        "
      >
        {/* Card Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-6">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl text-white ring-1 ring-white/20 backdrop-blur-sm">
              🏫
            </div>

            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/20">
              Primary
            </span>
          </div>

          <h2 className="relative mt-5 line-clamp-2 text-xl font-bold leading-tight text-white">
            {school.name}
          </h2>

          {location && (
            <p className="relative mt-2 flex items-center gap-2 text-sm text-blue-100">
              <span>📍</span>
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap gap-2">
            {school.schoolType && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {school.schoolType}
              </span>
            )}

            {school.academicLevel && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {school.academicLevel}
              </span>
            )}
          </div>

          {school.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
              {school.description}
            </p>
          )}

          {/* Card Action */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm font-semibold text-blue-700 transition-colors group-hover:text-blue-800">
                View school details
              </span>

              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-blue-50 text-blue-700
                  transition-all duration-300
                  group-hover:translate-x-1
                  group-hover:bg-blue-700
                  group-hover:text-white
                "
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

