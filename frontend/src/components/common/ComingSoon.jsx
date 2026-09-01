export default function ComingSoon({ title, note }) {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">{title}</h1>
      <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center mt-4">
        <p className="text-gray-500 text-sm">{note || 'This section is being built next.'}</p>
      </div>
    </div>
  );
}
