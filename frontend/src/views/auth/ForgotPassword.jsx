import { useEffect, useState } from 'react';
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
  const [timeLeft, setTimeLeft] = useState(300);

  // ==============================
  // OTP COUNTDOWN
  // ==============================
  useEffect(() => {
    if (!showOtp) {
      return;
    }

    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  // ==============================
  // FORMAT OTP TIME
  // ==============================
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  // ==============================
  // SEND RESET / OTP
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    // PHONE RECOVERY
    if (activeRecovery === 'phone') {
      console.log('Send OTP to:', phone);

      // Start a fresh 5-minute countdown
      setTimeLeft(300);
      setOtp('');
      setShowOtp(true);

      setLoading(false);
      return;
    }

    // EMAIL RECOVERY
    try {
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

  // ==============================
  // VERIFY OTP
  // ==============================
  const handleVerifyOtp = () => {
    setError('');
    setMessage('');

    if (timeLeft <= 0) {
      setError('This OTP has expired. Please request a new code.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    console.log('Verify OTP:', otp);

    setMessage('OTP verified successfully.');

    // Backend verification will be connected later.
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${registerBg})` }}
    >
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        {/* ==============================
            MAIN FORGOT PASSWORD CARD
        ============================== */}
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
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your email address to receive password reset
              instructions.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="mb-5">
              <Alert type="success" message={message} />
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} />
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              {/* EMAIL OR PHONE FIELD */}
              {activeRecovery === 'phone' ? (
                <TextField
                  label="Mobile Phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+255..."
                  required
                />
              ) : (
                <TextField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              )}

              {/* TRY ANOTHER WAY */}
              <button
                type="button"
                onClick={() => {
                  setShowOtherWays(true);
                  setError('');
                  setMessage('');
                }}
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

            {/* SUBMIT BUTTON */}
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
                hover:text-blue-800
                hover:underline
              "
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* ==============================
          RECOVERY METHOD MODAL
      ============================== */}
      {showOtherWays && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          {/* BACKDROP */}
          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
            "
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
            {/* HEADER */}
            <div className="mb-7 text-center">
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
                Choose Recovery Method
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select how you would like to recover your account.
              </p>
            </div>

            {/* RECOVERY OPTIONS */}
            <div className="space-y-4">
              {/* EMAIL OPTION */}
              <label
                className={`
                  flex
                  cursor-pointer
                  items-center
                  gap-4
                  rounded-xl
                  border
                  p-4
                  transition
                  ${recoveryMethod === 'email'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                  }
                `}
              >
                <input
                  type="radio"
                  name="recoveryMethod"
                  value="email"
                  checked={recoveryMethod === 'email'}
                  onChange={(event) =>
                    setRecoveryMethod(event.target.value)
                  }
                  className="h-4 w-4"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    Email Address
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive password reset instructions by email.
                  </p>
                </div>
              </label>

              {/* PHONE OPTION */}
              <label
                className={`
                  flex
                  cursor-pointer
                  items-center
                  gap-4
                  rounded-xl
                  border
                  p-4
                  transition
                  ${recoveryMethod === 'phone'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                  }
                `}
              >
                <input
                  type="radio"
                  name="recoveryMethod"
                  value="phone"
                  checked={recoveryMethod === 'phone'}
                  onChange={(event) =>
                    setRecoveryMethod(event.target.value)
                  }
                  className="h-4 w-4"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    Phone Number
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive a 6-digit OTP by SMS.
                  </p>
                </div>
              </label>
            </div>

            {/* MODAL BUTTONS */}
            <div className="mt-7 flex gap-3">
              {/* CANCEL */}
              <button
                type="button"
                onClick={() => setShowOtherWays(false)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
              >
                Cancel
              </button>

              {/* CONTINUE */}
              <button
                type="button"
                disabled={!recoveryMethod}
                onClick={() => {
                  setActiveRecovery(recoveryMethod);
                  setShowOtherWays(false);
                  setError('');
                  setMessage('');
                }}
                className="
                  w-full
                  rounded-xl
                  bg-blue-600
                  px-4
                  py-3
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
        </div>
      )}

      {/* ==============================
          OTP VERIFICATION MODAL
      ============================== */}
      {showOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* BACKDROP */}
          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
            "
          />

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

            {/* OTP ERROR */}
            {error && (
              <div className="mb-5">
                <Alert type="error" message={error} />
              </div>
            )}

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

            {/* EXPIRY TIMER */}
            <p className="mt-3 text-center text-sm text-slate-500">
              {timeLeft > 0 ? (
                <>
                  Code expires in{' '}
                  <span className="font-semibold text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-red-600">
                  This code has expired.
                </span>
              )}
            </p>

            {/* VERIFY BUTTON */}
            <Button
              type="button"
              disabled={otp.length !== 6 || timeLeft <= 0}
              onClick={handleVerifyOtp}
              className="mt-5 w-full"
            >
              Verify OTP
            </Button>

            {/* RESEND OTP */}
            {timeLeft <= 0 && (
              <button
                type="button"
                onClick={() => {
                  console.log('Resend OTP to:', phone);

                  setTimeLeft(300);
                  setOtp('');
                  setError('');
                }}
                className="
                  mt-4
                  w-full
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-800
                  hover:underline
                "
              >
                Resend OTP
              </button>
            )}

            {/* BACK */}
            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setOtp('');
                setTimeLeft(300);
                setError('');
                setMessage('');
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
  );
}