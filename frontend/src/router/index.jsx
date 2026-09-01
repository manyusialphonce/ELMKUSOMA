
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import AdminLayout from '../layouts/AdminLayout';
import ParentLayout from '../layouts/ParentLayout';
import ProtectedRoute from './ProtectedRoute';

// ================================
// PUBLIC PAGES
// ================================

const Home = lazy(() =>
  import('../views/public/Home')
);

const NotesLibrary = lazy(() =>
  import('../views/public/NotesLibrary')
);

const CertificateVerify = lazy(() =>
  import('../views/public/CertificateVerify')
);

const EdAdvertising = lazy(() =>
  import('../views/public/EdAdvertising')
);

const SearchResults = lazy(() =>
  import('../views/public/SearchResults')
);

const SchoolsList = lazy(() =>
  import('../views/public/SchoolsList')
);

const SchoolDetail = lazy(() =>
  import('../views/public/SchoolDetail')
);

// ================================
// SCHOOL DIRECTORY PAGES
// ================================

const PrimarySchools = lazy(() =>
  import('../views/public/PrimarySchools')
);

const PrimarySchoolDetails = lazy(() =>
  import('../views/public/PrimarySchoolDetails')
);

// ================================
// AUTH PAGES
// ================================

const Login = lazy(() =>
  import('../views/auth/Login')
);

const Register = lazy(() =>
  import('../views/auth/Register')
);

// ================================
// STUDENT PAGES
// ================================

const StudentDashboard = lazy(() =>
  import('../views/student/StudentDashboard')
);

const StudentLiveClasses = lazy(() =>
  import('../views/student/StudentLiveClasses')
);

const StudentRecordings = lazy(() =>
  import('../views/student/StudentRecordings')
);

const StudentSubscription = lazy(() =>
  import('../views/student/StudentSubscription')
);

const StudentCertificates = lazy(() =>
  import('../views/student/StudentCertificates')
);

const NurseryGames = lazy(() =>
  import('../views/student/NurseryGames')
);

// ================================
// TEACHER PAGES
// ================================

const TeacherDashboard = lazy(() =>
  import('../views/teacher/TeacherDashboard')
);

const TeacherLiveClasses = lazy(() =>
  import('../views/teacher/TeacherLiveClasses')
);

const TeacherQuizzes = lazy(() =>
  import('../views/teacher/TeacherQuizzes')
);

const TeacherAssignments = lazy(() =>
  import('../views/teacher/TeacherAssignments')
);

// ================================
// ADMIN PAGES
// ================================

const AdminDashboard = lazy(() =>
  import('../views/admin/AdminDashboard')
);

const AdminTeacherVerifications = lazy(() =>
  import('../views/admin/AdminTeacherVerifications')
);

const AdminAuditLogs = lazy(() =>
  import('../views/admin/AdminAuditLogs')
);

const AdminAdvertisements = lazy(() =>
  import('../views/admin/AdminAdvertisements')
);

const SchoolSetupWizard = lazy(() =>
  import('../views/admin/SchoolSetupWizard')
);

// ================================
// PARENT PAGES
// ================================

const ParentDashboard = lazy(() =>
  import('../views/parent/ParentDashboard')
);

// ================================
// LOADING FALLBACK
// ================================

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-24">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
          aria-hidden="true"
        />

        <p className="text-sm font-medium text-gray-500">
          Loading...
        </p>
      </div>
    </div>
  );
}

// ================================
// SUSPENSE HELPER
// ================================

function page(element) {
  return (
    <Suspense fallback={<PageFallback />}>
      {element}
    </Suspense>
  );
}

// ================================
// 404 PAGE
// ================================

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-blue-600">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-2 text-slate-500">
          The page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}

// ================================
// ROUTER
// ================================

const router = createBrowserRouter([
  // ==================================
  // PUBLIC AREA
  // ==================================

  {
    element: <PublicLayout />,

    children: [
      // Home
      {
        path: '/',
        element: page(<Home />),
      },

      // Notes
      {
        path: '/notes-library',
        element: page(<NotesLibrary />),
      },

      // Certificate verification
      {
        path: '/certificates/verify',
        element: page(<CertificateVerify />),
      },

      // Advertising
      {
        path: '/advertising',
        element: page(<EdAdvertising />),
      },

      // Search
      {
        path: '/search',
        element: page(<SearchResults />),
      },

      // ==================================
      // SCHOOLS
      // ==================================

      // Main schools directory
      {
        path: '/schools',
        element: page(<SchoolsList />),
      },

      // Primary schools directory
      {
        path: '/schools/primary',
        element: page(<PrimarySchools />),
      },

      // Individual primary school
      {
        path: '/schools/primary/:slug',
        element: page(<PrimarySchoolDetails />),
      },

      // Existing generic school details
      {
        path: '/schools/:slug',
        element: page(<SchoolDetail />),
      },
    ],
  },

  // ==================================
  // AUTH AREA
  // ==================================

  {
    element: <AuthLayout />,

    children: [
      {
        path: '/login',
        element: page(<Login />),
      },

      {
        path: '/register',
        element: page(<Register />),
      },
    ],
  },

  // ==================================
  // STUDENT AREA
  // ==================================

  {
    element: (
      <ProtectedRoute roles={['student']} />
    ),

    children: [
      {
        path: '/dashboard',
        element: <StudentLayout />,

        children: [
          {
            index: true,
            element: page(<StudentDashboard />),
          },

          {
            path: 'live-classes',
            element: page(<StudentLiveClasses />),
          },

          {
            path: 'recorded-lessons',
            element: page(<StudentRecordings />),
          },

          {
            path: 'subscription',
            element: page(<StudentSubscription />),
          },

          {
            path: 'certificates',
            element: page(<StudentCertificates />),
          },

          {
            path: 'nursery-games',
            element: page(<NurseryGames />),
          },
        ],
      },
    ],
  },

  // ==================================
  // TEACHER AREA
  // ==================================

  {
    element: (
      <ProtectedRoute roles={['teacher']} />
    ),

    children: [
      {
        path: '/teacher',
        element: <TeacherLayout />,

        children: [
          {
            index: true,
            element: page(<TeacherDashboard />),
          },

          {
            path: 'live-classes',
            element: page(<TeacherLiveClasses />),
          },

          {
            path: 'quizzes',
            element: page(<TeacherQuizzes />),
          },

          {
            path: 'assignments',
            element: page(<TeacherAssignments />),
          },
        ],
      },
    ],
  },

  // ==================================
  // PARENT AREA
  // ==================================

  {
    element: (
      <ProtectedRoute roles={['parent']} />
    ),

    children: [
      {
        path: '/parent',
        element: <ParentLayout />,

        children: [
          {
            index: true,
            element: page(<ParentDashboard />),
          },
        ],
      },
    ],
  },

  // ==================================
  // ADMIN AREA
  // ==================================

  {
    element: (
      <ProtectedRoute
        roles={[
          'admin',
          'super_admin',
          'school_admin',
        ]}
      />
    ),

    children: [
      {
        path: '/admin',
        element: <AdminLayout />,

        children: [
          {
            index: true,
            element: page(<AdminDashboard />),
          },

          {
            path: 'verifications',
            element: page(
              <AdminTeacherVerifications />
            ),
          },

          {
            path: 'audit-logs',
            element: page(<AdminAuditLogs />),
          },

          {
            path: 'advertising',
            element: page(<AdminAdvertisements />),
          },

          {
            path: 'setup-school',
            element: page(<SchoolSetupWizard />),
          },
        ],
      },
    ],
  },

  // ==================================
  // NOT FOUND
  // ==================================

  {
    path: '*',
    element: <NotFound />,
  },
]);

// ================================
// APP ROUTER
// ================================

export default function AppRouter() {
  return (
    <RouterProvider router={router} />
  );
}

