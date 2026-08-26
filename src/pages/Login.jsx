import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getFriendlyError } from '../services/api.js';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/upload';

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

  return (
    <div className="max-w-md mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#0c1222] mb-3">
          Log in
        </h1>
        <p className="text-[#5b657a]">
          Access your uploads and create new share links.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#e6e1d8] bg-white p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <label className="block">
          <span className="text-sm font-medium text-[#0c1222]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#e6e1d8] bg-[#f7f5f1]/60 px-4 py-3 text-[#0c1222] outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#0c1222]">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#e6e1d8] bg-[#f7f5f1]/60 px-4 py-3 text-[#0c1222] outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-teal-800 text-white px-5 py-3.5 text-base font-semibold hover:bg-teal-700 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5b657a]">
        New here?{' '}
        <Link to="/register" className="font-semibold text-teal-800 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
