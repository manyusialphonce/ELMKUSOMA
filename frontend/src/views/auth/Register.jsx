import { useState } from 'react';

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import useAuthStore from '../../stores/authStore';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';


// ======================================
// AVAILABLE PUBLIC REGISTRATION ROLES
// ======================================

const ROLES = [
  {
    value: 'student',
    label: 'Student',
  },
  {
    value: 'teacher',
    label: 'Teacher',
  },
  {
    value: 'parent',
    label: 'Parent',
  },
];

const ROLE_VALUES = ROLES.map(
  (role) => role.value
);


// ======================================
// GET DASHBOARD BY ROLE
// ======================================

function getHomeByRole(user) {

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : [];


  // Normalize all roles
  const normalizedRoles = roles.map(
    (role) => String(role).toLowerCase()
  );


  // ======================================
  // ADMIN
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
// REGISTER COMPONENT
// ======================================

export default function Register() {

  const navigate = useNavigate();

  const register = useAuthStore(
    (state) => state.register
  );

  const [searchParams] =
    useSearchParams();


  // ======================================
  // ROLE FROM URL
  // Example:
  // /register?role=teacher
  // ======================================

  const requestedRole =
    searchParams.get('role');


  const initialRole =
    requestedRole &&
    ROLE_VALUES.includes(
      requestedRole.toLowerCase()
    )
      ? requestedRole.toLowerCase()
      : 'student';


  // ======================================
  // FORM STATE
  // ======================================

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
    role: initialRole,
  });


  const [error, setError] =
    useState('');


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
  // REGISTER
  // ======================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError('');


    // ======================================
    // PASSWORD VALIDATION
    // ======================================

    if (
      form.password !==
      form.passwordConfirmation
    ) {

      setError(
        'Passwords do not match.'
      );

      return;

    }


    // Optional basic password validation
    if (form.password.length < 6) {

      setError(
        'Password must be at least 6 characters.'
      );

      return;

    }


    setLoading(true);


    try {

      // ======================================
      // CREATE BACKEND PAYLOAD
      // ======================================

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role.toLowerCase(),
      };


      // Only add phone number if provided
      if (form.phoneNumber.trim()) {
        payload.phoneNumber =
          form.phoneNumber.trim();
      }


      // ======================================
      // REGISTER USER
      // ======================================

      const user =
        await register(payload);


      // ======================================
      // REDIRECT USER
      // ======================================

      const redirectTo =
        getHomeByRole(user);


      navigate(
        redirectTo,
        {
          replace: true,
        }
      );


    } catch (err) {

      console.error(
        'REGISTER ERROR:',
        err
      );


      const message =
        err.response?.data?.errors
          ? err.response.data.errors
              .map(
                (item) =>
                  item.msg ||
                  item.message ||
                  String(item)
              )
              .join(' ')
          : err.response?.data?.message ||
            'Registration failed. Please try again.';


      setError(message);


    } finally {

      setLoading(false);

    }

  };


  // ======================================
  // UI
  // ======================================

  return (

    <div className="mx-auto my-12 w-full max-w-md px-4">


      {/* ==================================
          REGISTER CARD
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

            Create your account

          </h1>


          <p className="mt-2 text-sm text-slate-500">

            Join ELMKUSOMA and start your
            digital learning journey.

          </p>

        </div>


        {/* ================================
            ERROR
        ================================= */}

        {error && (

          <div className="mb-5">

            <Alert type="error">

              {error}

            </Alert>

          </div>

        )}


        {/* ================================
            FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >


          {/* ROLE */}

          <label className="block">

            <span className="mb-1 block text-sm font-medium text-slate-700">

              I am registering as

            </span>


            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >

              {ROLES.map((role) => (

                <option
                  key={role.value}
                  value={role.value}
                >

                  {role.label}

                </option>

              ))}

            </select>

          </label>


          {/* FULL NAME */}

          <TextField
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />


          {/* EMAIL */}

          <TextField
            label="Email address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />


          {/* PHONE */}

          <TextField
            label="Mobile phone"
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+255..."
          />


          {/* PASSWORD */}

          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />


          {/* CONFIRM PASSWORD */}

          <TextField
            label="Confirm password"
            type="password"
            name="passwordConfirmation"
            value={form.passwordConfirmation}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />


          {/* TEACHER INFORMATION */}

          {form.role === 'teacher' && (

            <Alert type="info">

              Teacher accounts may require
              verification before accessing
              all teaching features.

            </Alert>

          )}


          {/* SUBMIT */}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >

            {loading
              ? 'Creating account...'
              : 'Create account'
            }

          </Button>


        </form>


        {/* ================================
            LOGIN LINK
        ================================= */}

        <div className="mt-6 text-center">


          <p className="text-sm text-slate-600">

            Already have an account?{' '}


            <Link
              to="/login"
              className="
                font-semibold
                text-blue-600
                transition
                hover:text-blue-700
              "
            >

              Log in

            </Link>


          </p>


        </div>


        {/* BACK HOME */}

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