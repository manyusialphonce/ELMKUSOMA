import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/live-classes', label: 'Live Classes' },
  { to: '/dashboard/recorded-lessons', label: 'Recorded Lessons' },
  { to: '/dashboard/notes-library', label: 'Notes Library' },
  { to: '/dashboard/nursery-games', label: 'Nursery Games' },
  { to: '/dashboard/quizzes', label: 'My Quizzes' },
  { to: '/dashboard/assignments', label: 'My Assignments' },
  { to: '/dashboard/results', label: 'My Results' },
  { to: '/dashboard/subscription', label: 'Subscription' },
  { to: '/dashboard/certificates', label: 'Certificates' },
  { to: '/dashboard/notifications', label: 'Notifications' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function StudentLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 text-lg font-bold text-blue-900 border-b border-gray-200">
          ELMKUSOMA
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-800' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200 text-sm">
          <p className="font-medium text-gray-800">{user?.fullName}</p>
          <button onClick={logout} className="text-red-600 mt-1">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
