import { useState } from 'react';

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import useAuthStore from '../../stores/authStore';

import registerBg from '../../assets/register-bg.jpg';

import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

import {
  TANZANIA_REGIONS,
  getDistrictsByRegion,
} from '../../data/tanzaniaLocations';


// =====================================================
// AVAILABLE PUBLIC REGISTRATION ROLES
// =====================================================

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

const ROLE_VALUES =
  ROLES.map(
    (role) => role.value
  );


// =====================================================
// GET DASHBOARD BY ROLE
// =====================================================

function getHomeByRole(user) {

  const roles =
    Array.isArray(user?.roles)
      ? user.roles
      : user?.role
        ? [user.role]
        : [];


  const normalizedRoles =
    roles.map(
      (role) =>
        String(role).toLowerCase()
    );


  // ADMIN

  if (
    normalizedRoles.some(
      (role) =>
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


  // TEACHER

  if (
    normalizedRoles.includes('teacher')
  ) {
    return '/teacher';
  }


  // PARENT

  if (
    normalizedRoles.includes('parent')
  ) {
    return '/parent';
  }


  // STUDENT

  if (
    normalizedRoles.includes('student')
  ) {
    return '/dashboard';
  }


  // DEFAULT

  return '/dashboard';

}


// =====================================================
// GET ERROR MESSAGE
// =====================================================

function getErrorMessage(err) {

  const backendData =
    err?.response?.data;


  console.error(
    'BACKEND ERROR RESPONSE:',
    backendData
  );


  if (
    backendData?.errors
  ) {

    if (
      Array.isArray(
        backendData.errors
      )
    ) {

      return backendData.errors
        .map(
          (item) =>
            item.msg ||
            item.message ||
            item.error ||
            String(item)
        )
        .join(' ');

    }


    if (
      typeof backendData.errors ===
      'object'
    ) {

      return Object.values(
        backendData.errors
      )
        .flat()
        .map(
          (item) =>
            item?.msg ||
            item?.message ||
            String(item)
        )
        .join(' ');

    }

  }


  if (
    Array.isArray(
      backendData?.message
    )
  ) {

    return backendData.message
      .join(' ');

  }


  if (
    backendData?.message
  ) {

    return backendData.message;

  }


  if (
    err?.message
  ) {

    return err.message;

  }


  return (
    'Registration failed. Please try again.'
  );

}


// =====================================================
// REGISTER COMPONENT
// =====================================================

export default function Register() {


  const navigate =
    useNavigate();


  const register =
    useAuthStore(
      (state) => state.register
    );


  const [searchParams] =
    useSearchParams();


  // =====================================================
  // ROLE FROM URL
  // Example:
  // /register?role=teacher
  // =====================================================

  const requestedRole =
    searchParams.get('role');


  const initialRole =
    requestedRole &&
    ROLE_VALUES.includes(
      requestedRole.toLowerCase()
    )
      ? requestedRole.toLowerCase()
      : 'student';


  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] =
    useState({

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


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setForm(
        (previous) => {


          // COUNTRY CHANGE

          if (
            name === 'country'
          ) {

            return {

              ...previous,

              country: value,

              region: '',

              district: '',

            };

          }


          // REGION CHANGE

          if (
            name === 'region'
          ) {

            return {

              ...previous,

              region: value,

              district: '',

            };

          }


          // ROLE CHANGE

          if (
            name === 'role'
          ) {

            return {

              ...previous,

              role: value,

              country: '',

              region: '',

              district: '',

            };

          }


          return {

            ...previous,

            [name]: value,

          };

        }
      );

    };


  // =====================================================
  // VALIDATE PASSWORD
  // =====================================================

  const validatePassword =
    (password) => {


      if (
        password.length < 8
      ) {

        return (
          'Password must be at least 8 characters.'
        );

      }


      if (
        !/[A-Z]/.test(
          password
        )
      ) {

        return (
          'Password must contain an uppercase letter.'
        );

      }


      if (
        !/[a-z]/.test(
          password
        )
      ) {

        return (
          'Password must contain a lowercase letter.'
        );

      }


      if (
        !/[0-9]/.test(
          password
        )
      ) {

        return (
          'Password must contain a number.'
        );

      }


      return '';

    };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit =
    async (event) => {


      event.preventDefault();


      setError('');


      // =================================================
      // BASIC VALIDATION
      // =================================================

      if (
        !form.fullName.trim()
      ) {

        setError(
          'Full name is required.'
        );

        return;

      }


      if (
        !form.email.trim()
      ) {

        setError(
          'Email address is required.'
        );

        return;

      }


      // =================================================
      // DATE OF BIRTH
      // =================================================

      if (
        !form.dateOfBirth
      ) {

        setError(
          'Date of Birth is required.'
        );

        return;

      }


      const dateOfBirth =
        new Date(
          form.dateOfBirth
        );


      const today =
        new Date();


      if (
        Number.isNaN(
          dateOfBirth.getTime()
        )
      ) {

        setError(
          'Please enter a valid Date of Birth.'
        );

        return;

      }


      if (
        dateOfBirth > today
      ) {

        setError(
          'Date of Birth cannot be in the future.'
        );

        return;

      }


      // =================================================
      // PASSWORD CONFIRMATION
      // =================================================

      if (
        form.password !==
        form.passwordConfirmation
      ) {

        setError(
          'Passwords do not match.'
        );

        return;

      }


      // =================================================
      // PASSWORD VALIDATION
      // =================================================

      const passwordError =
        validatePassword(
          form.password
        );


      if (
        passwordError
      ) {

        setError(
          passwordError
        );

        return;

      }


      // =================================================
      // LOCATION VALIDATION
      // =================================================

      if (
        form.role === 'teacher' ||
        form.role === 'parent'
      ) {


        if (
          !form.country.trim()
        ) {

          setError(
            'Country is required.'
          );

          return;

        }


        if (
          form.country ===
          'Tanzania'
        ) {


          if (
            !form.region
          ) {

            setError(
              'Please select a region.'
            );

            return;

          }


          if (
            !form.district
          ) {

            setError(
              'Please select a district.'
            );

            return;

          }

        } else {


          if (
            !form.region.trim()
          ) {

            setError(
              'Region is required.'
            );

            return;

          }


          if (
            !form.district.trim()
          ) {

            setError(
              'District is required.'
            );

            return;

          }

        }

      }


      // =================================================
      // START LOADING
      // =================================================

      setLoading(
        true
      );


      try {


        // ===============================================
        // CREATE BACKEND PAYLOAD
        // ===============================================

        const payload = {

          fullName:
            form.fullName.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),

          password:
            form.password,

          // BACKEND EXPECTS UPPERCASE
          role:
            form.role.toUpperCase(),

          dateOfBirth:
            form.dateOfBirth,

        };


        // ===============================================
        // OPTIONAL PHONE NUMBER
        // ===============================================

        if (
          form.phoneNumber.trim()
        ) {

          payload.phoneNumber =
            form.phoneNumber.trim();

        }


        // ===============================================
        // IMPORTANT NOTE ABOUT LOCATION
        // ===============================================
        //
        // Current backend validator expects:
        //
        // regionId
        // districtId
        //
        // NOT:
        //
        // region
        // district
        //
        // Therefore location names are not sent until
        // backend location IDs are connected.
        //


        console.log(
          'REGISTRATION PAYLOAD:',
          payload
        );


        // ===============================================
        // REGISTER USER
        // ===============================================

        const user =
          await register(
            payload
          );


        console.log(
          'REGISTER SUCCESS:',
          user
        );


        // ===============================================
        // REDIRECT USER
        // ===============================================

        const redirectTo =
          getHomeByRole(
            user
          );


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
          getErrorMessage(
            err
          );


        setError(
          message
        );


      } finally {


        setLoading(
          false
        );

      }

    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      className="
        min-h-screen
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage:
          `url(${registerBg})`,
      }}
    >


      <div className="
        mx-auto
        w-full
        max-w-2xl
        px-4
        py-12
      ">


        <div className="
          rounded-2xl
          border
          border-slate-200
          bg-white/95
          p-6
          shadow-xl
          backdrop-blur
          sm:p-8
        ">


          {/* ============================================
              HEADER
          ============================================= */}

          <div className="
            mb-8
            text-center
          ">


            <div className="
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
            ">

              E

            </div>


            <h1 className="
              text-2xl
              font-bold
              text-slate-900
            ">

              Create your account

            </h1>


            <p className="
              mt-2
              text-sm
              text-slate-500
            ">

              Join ELMKUSOMA and start your
              digital learning journey.

            </p>

          </div>


          {/* ============================================
              ERROR
          ============================================= */}

          {error && (

            <div className="
              mb-5
            ">

              <Alert
                type="error"
              >

                {error}

              </Alert>

            </div>

          )}


          {/* ============================================
              FORM
          ============================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              space-y-4
            "
          >


            {/* ROLE */}

            <label className="
              block
            ">

              <span className="
                mb-1
                block
                text-sm
                font-medium
                text-slate-700
              ">

                I am registering as

              </span>


              <select
                name="role"
                value={
                  form.role
                }
                onChange={
                  handleChange
                }
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

                {ROLES.map(
                  (role) => (

                    <option
                      key={
                        role.value
                      }
                      value={
                        role.value
                      }
                    >

                      {role.label}

                    </option>

                  )
                )}

              </select>

            </label>


            {/* FULL NAME */}

            <TextField
              label="Full name"
              name="fullName"
              value={
                form.fullName
              }
              onChange={
                handleChange
              }
              placeholder="
                Enter your full name
              "
              required
            />


            {/* EMAIL */}

            <TextField
              label="Email address"
              type="email"
              name="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              placeholder="
                you@example.com
              "
              required
            />


            {/* PHONE */}

            <TextField
              label="Mobile phone"
              type="tel"
              name="phoneNumber"
              value={
                form.phoneNumber
              }
              onChange={
                handleChange
              }
              placeholder="
                +255...
              "
            />


            {/* DATE OF BIRTH */}

            <TextField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={
                form.dateOfBirth
              }
              onChange={
                handleChange
              }
              required
            />


            {/* ============================================
                TEACHER / PARENT LOCATION
            ============================================= */}

            {(
              form.role ===
                'teacher' ||
              form.role ===
                'parent'
            ) && (

              <>


                {/* COUNTRY */}

                <label className="
                  block
                ">

                  <span className="
                    mb-1
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  ">

                    Country

                  </span>


                  <select
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
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
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >

                    <option value="">
                      Select country
                    </option>

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


                {/* REGION */}

                {form.country ===
                  'Tanzania' ? (

                  <label className="
                    block
                  ">

                    <span className="
                      mb-1
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    ">

                      Region

                    </span>


                    <select
                      name="region"
                      value={
                        form.region
                      }
                      onChange={
                        handleChange
                      }
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
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    >

                      <option value="">
                        Select region
                      </option>

                      {TANZANIA_REGIONS.map(
                        (
                          region
                        ) => (

                          <option
                            key={
                              region
                            }
                            value={
                              region
                            }
                          >

                            {region}

                          </option>

                        )
                      )}

                    </select>

                  </label>

                ) : (

                  <TextField
                    label="Region"
                    name="region"
                    value={
                      form.region
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="
                      Enter your region
                    "
                    required
                  />

                )}


                {/* DISTRICT */}

                {form.country ===
                  'Tanzania' ? (

                  <label className="
                    block
                  ">

                    <span className="
                      mb-1
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    ">

                      District

                    </span>


                    <select
                      name="district"
                      value={
                        form.district
                      }
                      onChange={
                        handleChange
                      }
                      required
                      disabled={
                        !form.region
                      }
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


                      {getDistrictsByRegion(
                        form.region
                      ).map(
                        (
                          district
                        ) => (

                          <option
                            key={
                              district
                            }
                            value={
                              district
                            }
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
                    value={
                      form.district
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="
                      Enter your district
                    "
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
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="
                Create a password
              "
              required
            />


            {/* CONFIRM PASSWORD */}

            <TextField
              label="Confirm password"
              type="password"
              name="passwordConfirmation"
              value={
                form.passwordConfirmation
              }
              onChange={
                handleChange
              }
              placeholder="
                Confirm your password
              "
              required
            />


            {/* SUBMIT */}

            <Button
              type="submit"
              loading={
                loading
              }
              className="
                w-full
              "
            >

              {loading
                ? 'Creating account...'
                : 'Create account'}

            </Button>


          </form>


          {/* ============================================
              LOGIN
          ============================================= */}

          <div className="
            mt-6
            text-center
          ">

            <p className="
              text-sm
              text-slate-600
            ">

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

          <div className="
            mt-5
            text-center
          ">

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