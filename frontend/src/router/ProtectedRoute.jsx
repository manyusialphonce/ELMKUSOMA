import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function ProtectedRoute({ roles = [] }) {
  const { user, isLoading } = useAuthStore();

  // Loading authentication state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get user roles safely
  const userRoles = Array.isArray(user.roles)
    ? user.roles
    : user.role
      ? [user.role]
      : [];

  // Normalize roles
  const normalizedUserRoles = userRoles.map((role) =>
    String(role).toUpperCase()
  );

  const normalizedAllowedRoles = roles.map((role) =>
    String(role).toUpperCase()
  );

  // Check authorization
  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedUserRoles.some((role) =>
      normalizedAllowedRoles.includes(role)
    )
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}