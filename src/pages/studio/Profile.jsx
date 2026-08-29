import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { getFriendlyError } from '../../services/api.js';

export default function StudioProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

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

  if (!user) {
    return <p className="text-[#64748b]">Loading profile…</p>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-tight">
          Profile
        </h1>
        <p className="mt-2 text-[#64748b]">Manage your creator account.</p>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border border-[#e2e8f0]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-2xl font-semibold">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-sm text-[#64748b] truncate">{user.email}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-2">
            Sign-in methods
          </p>
          <div className="flex flex-wrap gap-2">
            {providers.includes('email') && (
              <span className="rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 text-xs font-medium">
                Email &amp; password
              </span>
            )}
            {providers.includes('google') && (
              <span className="rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 text-xs font-medium">
                Google
              </span>
            )}
            {!providers.length && (
              <span className="text-xs text-[#64748b]">No providers listed</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Display name</span>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
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
          className="w-full rounded-xl border border-[#e2e8f0] px-5 py-3 text-sm font-medium hover:bg-[#f8fafc]"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
