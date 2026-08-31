import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/roles', label: 'Roles & Permissions' },
  { to: '/admin/schools', label: 'Schools' },
  { to: '/admin/setup-school', label: 'Set Up a School' },
  { to: '/admin/regions', label: 'Regions' },
  { to: '/admin/education-levels', label: 'Education Levels' },
  { to: '/admin/classes', label: 'Classes' },
  { to: '/admin/subjects', label: 'Subjects' },
  { to: '/admin/live-classes', label: 'Live Classes' },
  { to: '/admin/recordings', label: 'Recordings' },
  { to: '/admin/resources', label: 'Resources' },
  { to: '/admin/quizzes', label: 'Quizzes' },
  { to: '/admin/assignments', label: 'Assignments' },
  { to: '/admin/subscriptions', label: 'Subscriptions' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/advertising', label: 'ED Advertising' },
  { to: '/admin/notifications', label: 'Notifications' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/verifications', label: 'Teacher Verifications' },
  { to: '/admin/audit-logs', label: 'Audit Logs' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 text-lg font-bold text-blue-900 border-b border-gray-200">
          ELMKUSOMA Admin
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
