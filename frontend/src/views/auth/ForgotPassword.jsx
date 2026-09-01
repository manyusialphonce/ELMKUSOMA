import { useState } from 'react';
import { Link } from 'react-router-dom';

import registerBg from '../../assets/register-bg.jpg';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showOtherWays, setShowOtherWays] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState('email');
  const [activeRecovery, setActiveRecovery] = useState('email');

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (activeRecovery === 'phone') {
        if (!phone.trim()) {
          setError('Please enter your phone number.');
          return;
        }

        console.log('Send OTP to:', phone);

        setShowOtp(true);
        return;
      }

      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }

      console.log('Forgot password email:', email);

      setMessage(
        'If an account with this email exists, password reset instructions will be sent.'
      );
    } catch (err) {
      console.error('FORGOT PASSWORD ERROR:', err);

      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);

      console.log('Verify OTP:', {
        phone,
        otp,
      });

      setShowOtp(false);
      setOtp('');

      setMessage(
        'Phone number verified successfully. You can now continue with password reset.'
      );
    } catch (err) {
      console.error('OTP VERIFY ERROR:', err);

      setError(
        err.response?.data?.message ||
          'Invalid verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryMethod = () => {
    setActiveRecovery(recoveryMethod);
    setShowOtherWays(false);

    setError('');
    setMessage('');
    setOtp('');
    setShowOtp(false);
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
            bg-white/95
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
              {activeRecovery === 'phone'
                ? 'Enter your phone number and we will send you a verification code.'
                : 'Enter your email address and we will help you reset your password.'}
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="mb-5">
              <Alert type="success">{message}</Alert>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5">
              <Alert type="error">{error}</Alert>
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
                onClick={() => setShowOtherWays(true)}
                className="
                  absolute
                  right-0
                  top-0
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
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
              {loading ? (
                'Sending...'
              ) : activeRecovery === 'phone' ? (
                'Send OTP'
              ) : (
                'Send Reset Instructions'
              )}
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

          {/* RECOVERY METHOD MODAL */}
          {showOtherWays && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowOtherWays(false)}
              />

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
                    Choose your preferred recovery method.
                  </p>
                </div>

                {/* EMAIL OPTION */}
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('email')}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                    recoveryMethod === 'email'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }`}
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
                      Recover using your email address.
                    </p>
                  </div>
                </button>

                {/* PHONE OPTION */}
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('phone')}
                  className={`mt-3 flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                    recoveryMethod === 'phone'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }`}
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
                      Recover using an OTP sent to your phone.
                    </p>
                  </div>
                </button>

                <Button
                  type="button"
                  onClick={handleRecoveryMethod}
                  className="mt-5 w-full"
                >
                  Continue
                </Button>

                <button
                  type="button"
                  onClick={() => setShowOtherWays(false)}
                  className="
                    mt-4
                    w-full
                    text-sm
                    font-semibold
                    text-slate-500
                    hover:text-slate-700
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* OTP MODAL */}
          {showOtp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

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

                <p className="mt-3 text-center text-sm text-slate-500">
                  Code expires in{' '}
                  <span className="font-semibold text-red-600">
                    05:00
                  </span>
                </p>

                <Button
                  type="button"
                  loading={loading}
                  disabled={otp.length !== 6}
                  onClick={handleVerifyOtp}
                  className="mt-5 w-full"
                >
                  Verify OTP
                </Button>

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