export default function Button({ children, loading, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors';
  const variants = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading ? 'Please wait...' : children}
    </button>
  );
}
