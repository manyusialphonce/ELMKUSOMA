import { useState } from 'react';
import { Link } from 'react-router-dom';

import registerBg from '../../assets/register-bg.jpg';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtherWays, setShowOtherWays] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState('');
  const [activeRecovery, setActiveRecovery] = useState('');
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    if (activeRecovery === 'phone') {
      console.log('Send OTP to:', phone);

      setShowOtp(true);
      setLoading(false);

      return;
    }

    try {
      // Kwa sasa ni sample UI.
      // Tutaiunganisha na backend baadaye.
      console.log('Forgot password email:', email);

      setMessage(
        'If an account with this email exists, password reset instructions will be sent.'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${registerBg})`,
      }}
    >
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white/93
            p-6
            shadow-lg
            sm:p-8
          "
        >
          {/* HEADER */}

          <div className="mb-8 text-center">
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
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your email address and we will help you reset
              your password.
            </p>
          </div>




          {/* SUCCESS MESSAGE */}

          {message && (
            <div className="mb-5">
              <Alert type="success">
                {message}
              </Alert>
            </div>
          )}

          {/* ERROR MESSAGE */}

          {error && (
            <div className="mb-5">
              <Alert type="error">
                {error}
              </Alert>
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="relative">

              {activeRecovery === 'phone' ? (
                <TextField
                  label="Mobile Phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+255..."
                  required
                />
              ) : (
                <TextField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                />
              )}
              <button
                type="button"
                onClick={() => setShowOtherWays(!showOtherWays)}
                className="
      absolute
      right-0
      top-0
      text-sm
      font-semibold
      text-blue-600
      hover:text-red-700
      hover:underline
    "
              >
                Try another way
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading
                ? 'Sending...'
                : activeRecovery === 'phone'
                  ? 'Send OTP'
                  : 'Send Reset Instructions'}
            </Button>
          </form>

          {/* BACK TO LOGIN */}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="
                text-sm
                font-semibold
                text-blue-600
                transition
                hover:text-blue-800
                hover:underline
              "
            >
              ← Back to login
            </Link>
          </div>
          {/* OTHER RECOVERY METHODS MODAL */}

          {showOtherWays && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

              {/* BACKDROP */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowOtherWays(false)}
              />

              {/* MODAL CARD */}
              <div
                className="
                relative
                z-10
                w-full
                max-w-sm
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-2xl
                sm:p-8
              "
              >
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Recover your account
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Choose another recovery method.
                  </p>
                </div>

                {/* EMAIL */}
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('email')}
                  className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  text-left
                  transition
                  hover:border-blue-400
                  hover:bg-slate-50
                "
                >
                  <input
                    type="radio"
                    name="recoveryMethod"
                    checked={recoveryMethod === 'email'}
                    onChange={() => setRecoveryMethod('email')}
                  />

                  <div>
                    <p className="font-semibold text-slate-800">
                      Email
                    </p>

                    <p className="text-sm text-slate-500">
                      Recover using your email address
                    </p>
                  </div>
                </button>

                {/* PHONE */}
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('phone')}
                  className="
                  mt-3
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  text-left
                  transition
                  hover:border-blue-400
                  hover:bg-slate-50
                "
                >
                  <input
                    type="radio"
                    name="recoveryMethod"
                    checked={recoveryMethod === 'phone'}
                    onChange={() => setRecoveryMethod('phone')}
                  />

                  <div>
                    <p className="font-semibold text-slate-800">
                      Phone Number
                    </p>

                    <p className="text-sm text-slate-500">
                      Recover using an OTP sent to your phone
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!recoveryMethod}
                  onClick={() => {
                    setActiveRecovery(recoveryMethod);
                    setShowOtherWays(false);
                  }}
                  className="
    mt-4
    w-full
    rounded-xl
    bg-blue-600
    px-4
    py-2.5
    text-sm
    font-semibold
    text-white
    transition
    hover:bg-blue-700
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                >
                  Continue
                </button>


              </div>
            </div>
          )}

          {showOtp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

              {/* BACKDROP */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

              {/* OTP CARD */}
              <div
                className="
        relative
        z-10
        w-full
        max-w-sm
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-2xl
        sm:p-8
      "
              >

                {/* HEADER */}

                <div className="mb-8 text-center">

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

                  <h2 className="text-2xl font-bold text-slate-900">
                    Verify your phone number
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter the 6-digit verification code sent to
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {phone}
                  </p>

                </div>


                {/* OTP INPUT */}

                <TextField
                  label="Verification Code"
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(event) => {
                    const value = event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6);

                    setOtp(value);
                  }}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  required
                />


                {/* EXPIRY */}

                <p className="mt-3 text-center text-sm text-slate-500">
                  Code expires in <span className="font-semibold text-red-600">05:00</span>
                </p>


                {/* VERIFY */}

                <Button
                  type="button"
                  disabled={otp.length !== 6}
                  className="mt-5 w-full"
                >
                  Verify OTP
                </Button>


                {/* BACK */}

                <button
                  type="button"
                  onClick={() => {
                    setShowOtp(false);
                    setOtp('');
                  }}
                  className="
          mt-5
          w-full
          text-sm
          font-semibold
          text-blue-600
          hover:text-blue-800
          hover:underline
        "
                >
                  ← Back
                </button>

              </div>
            </div>
          )}


        </div>
      </div>

    </div>

  );
}