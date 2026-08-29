import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getFriendlyError } from '../services/api.js';

export default function Profile() {
  const { user, loading, isAuthenticated, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/profile' }} />;
  }

  const providers = user?.providers || [];

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not update profile.'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center text-[#5b657a]">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#0c1222] mb-2">
          Profile
        </h1>
        <p className="text-[#5b657a]">Manage your Mast Player account.</p>
      </header>

      <div className="rounded-2xl border border-[#e6e1d8] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border border-[#e6e1d8]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-2xl font-semibold">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-[#0c1222] truncate">{user.name}</p>
            <p className="text-sm text-[#5b657a] truncate">{user.email}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5b657a] mb-2">
            Sign-in methods
          </p>
          <div className="flex flex-wrap gap-2">
            {providers.includes('email') && (
              <span className="rounded-full bg-[#f7f5f1] border border-[#e6e1d8] px-3 py-1 text-xs font-medium">
                Email &amp; password
              </span>
            )}
            {providers.includes('google') && (
              <span className="rounded-full bg-[#f7f5f1] border border-[#e6e1d8] px-3 py-1 text-xs font-medium">
                Google
              </span>
            )}
            {!providers.length && (
              <span className="text-xs text-[#5b657a]">No providers listed</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#0c1222]">Display name</span>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#e6e1d8] bg-[#f7f5f1]/60 px-4 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-teal-800 text-white px-5 py-3 text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-[#e6e1d8] px-5 py-3 text-sm font-medium hover:bg-[#f7f5f1]"
        >
          Log out
        </button>
      </div>

      <p className="text-sm text-[#5b657a]">
        <Link to="/videos" className="text-teal-800 font-medium hover:underline">
          ← Back to My Videos
        </Link>
      </p>
    </div>
  );
}
