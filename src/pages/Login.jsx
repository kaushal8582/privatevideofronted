import { useCallback, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getFriendlyError } from '../services/api.js';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import { validateEmail, validatePassword } from '../utils/validation.js';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-[var(--danger)]">{message}</p>;
}

export default function Login() {
  const { login, loginWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/studio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getFriendlyError(err, 'Login failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = useCallback(
    async (idToken) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await loginWithGoogle(idToken);
        toast.success('Welcome!');
        navigate(from, { replace: true });
      } catch (err) {
        toast.error(getFriendlyError(err, 'Google sign-in failed.'));
      } finally {
        setSubmitting(false);
      }
    },
    [from, loginWithGoogle, navigate, submitting]
  );

  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col">
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <div className="w-full max-w-md min-w-0">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight text-[var(--foreground)] mb-2 sm:mb-3">
              Log in
            </h1>
            <p className="text-sm sm:text-base app-muted leading-relaxed px-1">
              Access your uploads and create new share links.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-8 space-y-5 shadow-[0_24px_60px_-40px_var(--glow-cyan)]">
            <GoogleSignInButton onCredential={handleGoogle} disabled={submitting} text="signin_with" />

            <div className="app-divider">or email</div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="app-label">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  className={`app-input ${errors.email ? '!border-[var(--danger)]' : ''}`}
                  aria-invalid={Boolean(errors.email)}
                />
                <FieldError message={errors.email} />
              </label>

              <label className="app-label">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError('password');
                  }}
                  className={`app-input ${errors.password ? '!border-[var(--danger)]' : ''}`}
                  aria-invalid={Boolean(errors.password)}
                />
                <FieldError message={errors.password} />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="app-btn-primary app-btn-primary-lg w-full"
              >
                {submitting ? 'Signing in…' : 'Log in'}
              </button>
            </form>
          </div>

          <p className="mt-5 sm:mt-6 text-center text-sm app-muted">
            New here?{' '}
            <Link to="/register" className="app-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
