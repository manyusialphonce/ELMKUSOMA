import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const NAV_ITEMS = [
  { to: '/teacher', label: 'Dashboard', end: true },
  { to: '/teacher/live-classes', label: 'My Live Classes' },
  { to: '/teacher/recordings', label: 'Recordings' },
  { to: '/teacher/students', label: 'Students' },
  { to: '/teacher/questions', label: 'Questions' },
  { to: '/teacher/quizzes', label: 'Quizzes' },
  { to: '/teacher/assignments', label: 'Assignments' },
  { to: '/teacher/resources', label: 'Resources' },
  { to: '/teacher/performance', label: 'Performance' },
  { to: '/teacher/subscription', label: 'Subscription' },
  { to: '/teacher/notifications', label: 'Notifications' },
  { to: '/teacher/profile', label: 'Profile' },
  { to: '/teacher/notes-library', label: 'Notes Library' },
];

export default function TeacherLayout() {
  const { user, logout } = useAuthStore();
  const isVerified = user?.verificationStatus === 'VERIFIED';

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 text-lg font-bold text-blue-900 border-b border-gray-200">
          ELMKUSOMA
        </div>

        {!isVerified && (
          <div className="mx-3 mt-3 p-3 text-xs bg-amber-50 text-amber-800 rounded-md">
            Your identity is not yet verified. You can browse your dashboard,
            but publishing content (live classes, recordings, resources) is
            locked until an administrator verifies your NIDA/Passport.
          </div>
        )}

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
