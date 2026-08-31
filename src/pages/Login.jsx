import { useCallback, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getFriendlyError } from '../services/api.js';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';

export default function Login() {
  const { login, loginWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/studio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="app-title mb-3">Log in</h1>
        <p className="app-subtitle">Access your uploads and create new share links.</p>
      </header>

      <div className="app-card-padded space-y-5">
        <GoogleSignInButton onCredential={handleGoogle} disabled={submitting} text="signin_with" />

        <div className="app-divider">or email</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="app-label">
            Email
            <input
              type="email"
              required
              autoComplete="email"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="app-input"
            />
          </label>

          <button type="submit" disabled={submitting} className="app-btn-primary app-btn-primary-lg w-full">
            {submitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm app-muted">
        New here?{' '}
        <Link to="/register" className="app-link">
          Create an account
        </Link>
      </p>
    </div>
  );
}
