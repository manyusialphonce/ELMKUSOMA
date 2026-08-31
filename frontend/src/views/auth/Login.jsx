import { useState } from 'react';

import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import useAuthStore from '../../stores/authStore';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';


// ======================================
// GET DASHBOARD BASED ON USER ROLE
// ======================================

function getHomeByRole(user) {

  // Support both:
  // user.roles = ['student']
  // user.role = 'student'

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : [];


  // Normalize roles to lowercase
  const normalizedRoles = roles.map((role) =>
    String(role).toLowerCase()
  );


  // ======================================
  // ADMIN ROLES
  // ======================================

  if (
    normalizedRoles.some((role) =>
      [
        'admin',
        'administrator',
        'super_admin',
        'super_administrator',
        'school_admin',
        'school_administrator',
      ].includes(role)
    )
  ) {
    return '/admin';
  }


  // ======================================
  // TEACHER
  // ======================================

  if (
    normalizedRoles.includes('teacher')
  ) {
    return '/teacher';
  }


  // ======================================
  // PARENT
  // ======================================

  if (
    normalizedRoles.includes('parent')
  ) {
    return '/parent';
  }


  // ======================================
  // STUDENT
  // ======================================

  if (
    normalizedRoles.includes('student')
  ) {
    return '/dashboard';
  }


  // ======================================
  // DEFAULT
  // ======================================

  return '/';
}


// ======================================
// LOGIN COMPONENT
// ======================================

export default function Login() {

  const navigate = useNavigate();

  const location = useLocation();


  // ======================================
  // AUTH STORE
  // ======================================

  const login = useAuthStore(
    (state) => state.login
  );


  // ======================================
  // FORM STATE
  // ======================================

  const [form, setForm] = useState({
    email: '',
    password: '',
  });


  const [error, setError] = useState('');


  const [loading, setLoading] =
    useState(false);


  // ======================================
  // HANDLE INPUT CHANGE
  // ======================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ======================================
  // HANDLE LOGIN
  // ======================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // Clear previous error
    setError('');


    // Start loading
    setLoading(true);


    try {

      // Login user
      const user = await login(form);


      // If user was trying to access
      // a protected page before login,
      // return them there.
      const redirectFrom =
        location.state?.from?.pathname;


      // Otherwise send them to the
      // correct dashboard based on role.
      const redirectTo =
        redirectFrom ||
        getHomeByRole(user);


      navigate(
        redirectTo,
        {
          replace: true,
        }
      );

    } catch (err) {

      console.error(
        'LOGIN ERROR:',
        err
      );


      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );

    } finally {

      // Stop loading
      setLoading(false);

    }

  };


  // ======================================
  // UI
  // ======================================

  return (

    <div className="mx-auto mt-16 mb-16 w-full max-w-md px-4">


      {/* ==================================
          LOGIN CARD
      =================================== */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-lg
          sm:p-8
        "
      >


        {/* ================================
            HEADER
        ================================= */}

        <div className="mb-8 text-center">


          {/* LOGO PLACEHOLDER */}

          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
              text-xl
              font-bold
              text-white
              shadow-md
            "
          >
            E
          </div>


          <h1 className="text-2xl font-bold text-slate-900">

            Welcome back

          </h1>


          <p className="mt-2 text-sm text-slate-500">

            Log in to continue learning with ELMKUSOMA.

          </p>

        </div>


        {/* ================================
            ERROR MESSAGE
        ================================= */}

        {error && (

          <div className="mb-5">

            <Alert type="error">

              {error}

            </Alert>

          </div>

        )}


        {/* ================================
            LOGIN FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          {/* EMAIL */}

          <TextField
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />


          {/* PASSWORD */}

          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />


          {/* LOGIN BUTTON */}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >

            {loading
              ? 'Logging in...'
              : 'Log in'
            }

          </Button>


        </form>


        {/* ================================
            REGISTER LINK
        ================================= */}

        <div className="mt-6 text-center">


          <p className="text-sm text-slate-600">

            Don't have an account?{' '}


            <Link
              to="/register"
              className="
                font-semibold
                text-blue-600
                transition
                hover:text-blue-700
              "
            >

              Create an account

            </Link>


          </p>


        </div>


        {/* ================================
            BACK HOME
        ================================= */}

        <div className="mt-5 text-center">


          <Link
            to="/"
            className="
              text-xs
              text-slate-500
              transition
              hover:text-blue-600
            "
          >

            ← Back to home

          </Link>


        </div>


      </div>


    </div>

  );

}