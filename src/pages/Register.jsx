import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getFriendlyError } from '../services/api.js';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';

const REF_STORAGE_KEY = 'mastplayer_ref';

export default function Register() {
  const { register, loginWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const referralCode = useMemo(() => {
    const fromUrl = searchParams.get('ref')?.trim();
    if (fromUrl) return fromUrl.toUpperCase();
    return sessionStorage.getItem(REF_STORAGE_KEY) || '';
  }, [searchParams]);

  useEffect(() => {
    const ref = searchParams.get('ref')?.trim();
    if (ref) sessionStorage.setItem(REF_STORAGE_KEY, ref.toUpperCase());
  }, [searchParams]);

  if (!loading && isAuthenticated) {
    return <Navigate to="/studio" replace />;
  }

  const clearReferralStorage = () => {
    sessionStorage.removeItem(REF_STORAGE_KEY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        referralCode: referralCode || undefined,
      });
      clearReferralStorage();
      toast.success('Account created!');
      navigate('/studio', { replace: true });
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not create account.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = useCallback(
    async (idToken) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await loginWithGoogle(idToken, referralCode || undefined);
        clearReferralStorage();
        toast.success('Welcome!');
        navigate('/studio', { replace: true });
      } catch (err) {
        toast.error(getFriendlyError(err, 'Google sign-in failed.'));
      } finally {
        setSubmitting(false);
      }
    },
    [loginWithGoogle, navigate, referralCode, submitting]
  );

  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col">
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <div className="w-full max-w-md min-w-0">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight text-[var(--foreground)] mb-2 sm:mb-3">
              Create account
            </h1>
            <p className="text-sm sm:text-base app-muted leading-relaxed px-1">
              Register to upload videos and manage your library.
            </p>
            {referralCode ? (
              <p className="mt-3 inline-flex max-w-full items-center rounded-full border border-[var(--border-accent)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--blue)] break-all">
                Referred by code {referralCode}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-8 space-y-5 shadow-[0_24px_60px_-40px_var(--glow-cyan)]">
            <GoogleSignInButton onCredential={handleGoogle} disabled={submitting} text="signup_with" />

            <div className="app-divider">or email</div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="app-label">
                Name
                <input
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="app-input"
                />
              </label>

              <label className="app-label">
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="app-input"
                />
              </label>

              <label className="app-label">
                Password
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="app-input"
                />
                <span className="mt-1 block text-xs app-muted">At least 6 characters</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="app-btn-primary app-btn-primary-lg w-full"
              >
                {submitting ? 'Creating…' : 'Create account'}
              </button>
            </form>
          </div>

          <p className="mt-5 sm:mt-6 text-center text-sm app-muted">
            Already have an account?{' '}
            <Link to="/login" className="app-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
