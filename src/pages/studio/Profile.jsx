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
    return <p className="app-muted">Loading profile…</p>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="app-title">Profile</h1>
        <p className="app-subtitle mt-2">Manage your creator account.</p>
      </div>

      <div className="app-card-padded space-y-6">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border border-[var(--border)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center text-2xl font-semibold">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-sm app-muted truncate">{user.email}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide app-muted mb-2">Sign-in methods</p>
          <div className="flex flex-wrap gap-2">
            {providers.includes('email') && <span className="app-badge">Email &amp; password</span>}
            {providers.includes('google') && <span className="app-badge">Google</span>}
            {!providers.length && <span className="text-xs app-muted">No providers listed</span>}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="app-label">
            Display name
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="app-input"
            />
          </label>
          <button type="submit" disabled={saving} className="app-btn-primary w-full">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <button type="button" onClick={handleLogout} className="app-btn-ghost w-full">
          Log out
        </button>
      </div>
    </div>
  );
}
