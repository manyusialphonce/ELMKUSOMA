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

// =========================================================
// PUBLIC PAGES
// =========================================================

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

const SchoolCategory = lazy(() =>
  import('../views/public/SchoolCategory')
);

const SchoolDetail = lazy(() =>
  import('../views/public/SchoolDetail')
);

const PrimarySchools = lazy(() =>
  import('../views/public/PrimarySchools')
);

const PrimarySchoolDetails = lazy(() =>
  import('../views/public/PrimarySchoolDetails')
);

// =========================================================
// AUTH PAGES
// =========================================================

const Login = lazy(() =>
  import('../views/auth/Login')
);

const Register = lazy(() =>
  import('../views/auth/Register')
);

const ForgotPassword = lazy(() =>
  import('../views/auth/ForgotPassword')
);

// =========================================================
// STUDENT PAGES
// =========================================================

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

const StudentQuizzes = lazy(() =>
  import('../views/student/StudentQuizzes')
);

const StudentAssignments = lazy(() =>
  import('../views/student/StudentAssignments')
);

const StudentResults = lazy(() =>
  import('../views/student/StudentResults')
);

const StudentNotifications = lazy(() =>
  import('../views/student/StudentNotifications')
);

const StudentProfile = lazy(() =>
  import('../views/student/StudentProfile')
);

// =========================================================
// TEACHER PAGES
// =========================================================

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

// =========================================================
// ADMIN PAGES
// =========================================================

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

// =========================================================
// PARENT PAGES
// =========================================================

const ParentDashboard = lazy(() =>
  import('../views/parent/ParentDashboard')
);

// =========================================================
// LOADING FALLBACK
// =========================================================

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-24">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="text-sm font-medium text-gray-500">
          Loading...
        </p>
      </div>
    </div>
  );
}

// =========================================================
// SUSPENSE HELPER
// =========================================================

function page(element) {
  return (
    <Suspense fallback={<PageFallback />}>
      {element}
    </Suspense>
  );
}

// =========================================================
// ROUTER
// =========================================================

const router = createBrowserRouter([

  // =======================================================
  // PUBLIC AREA
  // =======================================================

  {
    element: <PublicLayout />,

    children: [

      {
        path: '/',
        element: page(<Home />),
      },

      {
        path: '/certificates/verify',
        element: page(<CertificateVerify />),
      },

      {
        path: '/advertising',
        element: page(<EdAdvertising />),
      },

      {
        path: '/search',
        element: page(<SearchResults />),
      },

      // =================================================
      // SCHOOLS
      // =================================================

      {
        path: '/schools',
        element: page(<SchoolsList />),
      },

      {
        path: '/schools/category/:category',
        element: page(<SchoolCategory />),
      },

      {
        path: '/schools/primary',
        element: page(<PrimarySchools />),
      },

      {
        path: '/schools/primary/:slug',
        element: page(<PrimarySchoolDetails />),
      },

      {
        path: '/schools/:slug',
        element: page(<SchoolDetail />),
      },

    ],
  },

  // =======================================================
  // AUTH AREA
  // =======================================================

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

      {
        path: '/forgot-password',
        element: page(<ForgotPassword />),
      },

    ],
  },

  // =======================================================
  // STUDENT AREA
  // =======================================================

  {
    element: (
      <ProtectedRoute roles={['student']} />
    ),

    children: [
      {
        path: '/dashboard',
        element: <StudentLayout />,

        children: [

          // STUDENT DASHBOARD
          {
            index: true,
            element: page(<StudentDashboard />),
          },

          // LIVE CLASSES
          {
            path: 'live-classes',
            element: page(<StudentLiveClasses />),
          },

          // RECORDED LESSONS
          {
            path: 'recorded-lessons',
            element: page(<StudentRecordings />),
          },

          // NOTES LIBRARY
          {
            path: 'notes-library',
            element: page(<NotesLibrary />),
          },

          // NURSERY GAMES
          {
            path: 'nursery-games',
            element: page(<NurseryGames />),
          },

          // MY QUIZZES
          {
            path: 'quizzes',
            element: page(<StudentQuizzes />),
          },

          // MY ASSIGNMENTS
          {
            path: 'assignments',
            element: page(<StudentAssignments />),
          },

          // MY RESULTS
          {
            path: 'results',
            element: page(<StudentResults />),
          },

          // SUBSCRIPTION
          {
            path: 'subscription',
            element: page(<StudentSubscription />),
          },

          // CERTIFICATES
          {
            path: 'certificates',
            element: page(<StudentCertificates />),
          },

          // NOTIFICATIONS
          {
            path: 'notifications',
            element: page(<StudentNotifications />),
          },

          // PROFILE
          {
            path: 'profile',
            element: page(<StudentProfile />),
          },

        ],
      },
    ],
  },

  // =======================================================
  // TEACHER AREA
  // =======================================================

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
            path: 'notes-library',
            element: page(<NotesLibrary />),
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

  // =======================================================
  // PARENT AREA
  // =======================================================

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

          {
            path: 'notes-library',
            element: page(<NotesLibrary />),
          },

        ],
      },
    ],
  },

  // =======================================================
  // ADMIN AREA
  // =======================================================

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

  // =======================================================
  // NOT FOUND
  // =======================================================

  {
    path: '*',

    element: (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">

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
      </div>
    ),
  },

]);

// =========================================================
// APP ROUTER
// =========================================================

export default function AppRouter() {
  return (
    <RouterProvider router={router} />
  );
}