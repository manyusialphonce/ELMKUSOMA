export default function SchoolFilters({
search,
setSearch,
region,
setRegion,
regions = [],
level,
setLevel,
levelOptions = [],
showLevel = false,
}) {
const clearFilters = () => {
setSearch('');
setRegion('');
if (setLevel) {
setLevel('');
}
};

const hasFilters =
search ||
region ||
(showLevel && level);

return ( <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"> <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> <div className="lg:col-span-2"> <label className="mb-2 block text-sm font-semibold text-gray-700">
Search </label>

```
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by institution name or location..."
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        Region
      </label>

      <select
        value={region}
        onChange={(event) => setRegion(event.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Regions</option>

        {regions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    {showLevel && (
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Education Level
        </label>

        <select
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Secondary Schools</option>

          {levelOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>

  {hasFilters && (
    <div className="mt-4 flex justify-end">
      <button
        type="button"
        onClick={clearFilters}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
      >
        Clear filters
      </button>
    </div>
  )}
</div>

);
}
