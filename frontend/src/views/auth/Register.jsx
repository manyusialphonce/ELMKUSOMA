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
import {
  TANZANIA_REGIONS,
  getDistrictsByRegion,
} from '../../data/tanzaniaLocations';


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
    dateOfBirth: '',
    country: '',
    region: '',
    district: '',
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
    const { name, value } = event.target;

    setForm((previous) => {
      // When country changes, clear region and district
      if (name === 'country') {
        return {
          ...previous,
          country: value,
          region: '',
          district: '',
        };
      }

      // When region changes, clear district
      if (name === 'region') {
        return {
          ...previous,
          region: value,
          district: '',
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };


  // ======================================
  // REGISTER
  // ======================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError('');

    // ======================================
    // DATE OF BIRTH VALIDATION
    // ======================================

    if (!form.dateOfBirth) {
      setError('Date of Birth is required.');
      return;
    }

    const dateOfBirth = new Date(form.dateOfBirth);
    const today = new Date();

    if (Number.isNaN(dateOfBirth.getTime())) {
      setError('Please enter a valid Date of Birth.');
      return;
    }

    if (dateOfBirth > today) {
      setError('Date of Birth cannot be in the future.');
      return;
    }


    // ======================================
    // LOCATION VALIDATION
    // ======================================

    if (
      form.role === 'teacher' ||
      form.role === 'parent'
    ) {
      // Country is required
      if (!form.country.trim()) {
        setError('Country is required.');
        return;
      }

      // Tanzania uses dropdowns
      if (form.country === 'Tanzania') {
        if (!form.region) {
          setError('Please select a region.');
          return;
        }

        if (!form.district) {
          setError('Please select a district.');
          return;
        }
      }

      // Other countries use text fields
      else {
        if (!form.region.trim()) {
          setError('Region is required.');
          return;
        }

        if (!form.district.trim()) {
          setError('District is required.');
          return;
        }
      }
    }

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
        dateOfBirth: form.dateOfBirth,
      };

      // Phone number
      if (form.phoneNumber.trim()) {
        payload.phoneNumber = form.phoneNumber.trim();
      }
      console.log('REGISTRATION PAYLOAD:', payload);


      // Location information
      // Only Teacher and Parent should send location data.
      if (
        form.role === 'teacher' ||
        form.role === 'parent'
      ) {
        payload.country = form.country.trim();
        payload.region = form.region.trim();
        payload.district = form.district.trim();
      }

      console.log('REGISTRATION PAYLOAD:', payload);


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

    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-blue-100 to-slate-200">
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


            {/* TEACHER INFORMATION */}

            {/* DATE OF BIRTH */}

            <TextField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
            />

            {/* TEACHER / PARENT LOCATION */}

            {(form.role === 'teacher' || form.role === 'parent') && (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Country
                  </span>

                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
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
                    <option value="">Select country</option>

                    <option value="Tanzania">
                      Tanzania
                    </option>

                    <option value="Kenya">
                      Kenya
                    </option>

                    <option value="Uganda">
                      Uganda
                    </option>

                    <option value="Rwanda">
                      Rwanda
                    </option>

                    <option value="Burundi">
                      Burundi
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </label>

                {form.country === 'Tanzania' ? (
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Region
                    </span>

                    <select
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      required
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
                      <option value="">Select region</option>

                      {TANZANIA_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <TextField
                    label="Region"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    placeholder="Enter your region"
                    required
                  />
                )}

                {form.country === 'Tanzania' ? (
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      District
                    </span>

                    <select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      required
                      disabled={!form.region}
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
        disabled:cursor-not-allowed
        disabled:bg-slate-100
      "
                    >
                      <option value="">
                        {form.region
                          ? 'Select district'
                          : 'Select region first'}
                      </option>

                      {getDistrictsByRegion(form.region).map(
                        (district) => (
                          <option
                            key={district}
                            value={district}
                          >
                            {district}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                ) : (
                  <TextField
                    label="District"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Enter your district"
                    required
                  />
                )}
              </>
            )}


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
    </div>

  );

}