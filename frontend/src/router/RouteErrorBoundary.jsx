import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error?.message || 'Something went wrong loading this page.';

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-2">This page isn't available yet</h1>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      <Link to="/" className="text-blue-700 font-medium">Back to Home</Link>
    </div>
  );
}
