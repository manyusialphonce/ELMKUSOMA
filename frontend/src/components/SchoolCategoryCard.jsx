
import { Link } from 'react-router-dom';

export default function SchoolCategoryCard({
  title,
  description,
  icon,
  to,
  count,
}) {
  return (
    <Link
      to={to}
      className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700 transition-colors duration-300 group-hover:bg-blue-700 group-hover:text-white">
            {icon}
          </div>

          {count !== undefined && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {count} {count === 1 ? 'Institution' : 'Institutions'}
            </span>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-700">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
            Explore institutions
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

