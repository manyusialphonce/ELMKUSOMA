import { Link } from 'react-router-dom';

export default function SchoolCategoryCard({
icon,
title,
description,
count,
to,
}) {
return ( <Link
   to={to}
   className="group block h-full"
 > <article className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"> <div className="flex items-start justify-between gap-4"> <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
{icon} </div>

```
      {typeof count === 'number' && (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {count} {count === 1 ? 'Institution' : 'Institutions'}
        </span>
      )}
    </div>

    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-700">
        {title}
      </h2>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>

    <div className="mt-6 flex items-center text-sm font-semibold text-blue-700">
      Explore category
      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </div>
  </article>
</Link>


);
}
