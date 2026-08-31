export default function TextField({ label, error, className = '', ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  );
}
