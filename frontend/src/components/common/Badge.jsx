const STYLES = {
  LIVE: 'bg-red-100 text-red-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  ENDED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-gray-100 text-gray-400 line-through',
  PENDING: 'bg-amber-100 text-amber-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  UNVERIFIED: 'bg-gray-100 text-gray-600',
};

export default function Badge({ status, children }) {
  const style = STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {children || status}
    </span>
  );
}
