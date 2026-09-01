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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

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

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading
                ? 'Sending...'
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
        </div>
      </div>
    </div>
  );
}