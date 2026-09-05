import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Download, Link2, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getFriendlyError } from '../../services/api.js';
import SocialPlatformIcon from '../../components/SocialPlatformIcon.jsx';
import {
  MAX_SOCIAL_LINKS,
  detectSocialPlatform,
  normalizeSocialUrl,
} from '../../utils/socialLinks.js';

function emptyLink() {
  return { title: '', url: '', platform: 'link', _key: `${Date.now()}-${Math.random()}` };
}

export default function StudioProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const downloadToggleId = useId();
  const [name, setName] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [allowVideoDownload, setAllowVideoDownload] = useState(true);
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setAllowVideoDownload(user.allowVideoDownload !== false);
    setSocialLinks(
      (user.socialLinks || []).map((l, i) => ({
        title: l.title || '',
        url: l.url || '',
        platform: l.platform || detectSocialPlatform(l.url),
        _key: `saved-${i}-${l.url}`,
      }))
    );
  }, [user]);

  const providers = user?.providers || [];

  const updateLink = (index, patch) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => {
        if (i !== index) return link;
        const next = { ...link, ...patch };
        if (Object.prototype.hasOwnProperty.call(patch, 'url')) {
          next.platform = detectSocialPlatform(patch.url);
        }
        return next;
      })
    );
  };

  const addLink = () => {
    if (socialLinks.length >= MAX_SOCIAL_LINKS) {
      toast.error(`You can add at most ${MAX_SOCIAL_LINKS} links.`);
      return;
    }
    setSocialLinks((prev) => [...prev, emptyLink()]);
    setActiveLinkIndex(socialLinks.length);
  };

  const removeLink = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    setActiveLinkIndex((cur) => {
      if (cur == null) return null;
      if (cur === index) return null;
      if (cur > index) return cur - 1;
      return cur;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    const cleaned = socialLinks
      .map((l) => ({
        title: String(l.title || '').trim(),
        url: normalizeSocialUrl(l.url),
      }))
      .filter((l) => l.url);

    for (const link of cleaned) {
      try {
        new URL(link.url);
      } catch {
        toast.error('Please enter a valid link URL.');
        return;
      }
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        socialLinks: cleaned,
        allowVideoDownload,
      });
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="app-title">Profile</h1>
        <p className="app-subtitle mt-2">Manage your creator account, social links, and app settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
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
            <p className="text-xs font-semibold uppercase tracking-wide app-muted mb-2">
              Sign-in methods
            </p>
            <div className="flex flex-wrap gap-2">
              {providers.includes('email') && <span className="app-badge">Email &amp; password</span>}
              {providers.includes('google') && <span className="app-badge">Google</span>}
              {!providers.length && <span className="text-xs app-muted">No providers listed</span>}
            </div>
          </div>

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
        </div>

        <div className="app-card-padded space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="font-semibold text-lg">Social Links</h2>
                <span className="app-badge app-badge-green tabular-nums">{socialLinks.length}</span>
              </div>
              <p className="text-sm app-muted mt-1">
                Save your social profiles. Display on public pages coming soon.
              </p>
            </div>
            <button
              type="button"
              onClick={addLink}
              disabled={socialLinks.length >= MAX_SOCIAL_LINKS}
              className="app-btn-secondary shrink-0 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-8 text-center">
              <p className="text-sm app-muted">No links yet. Add Instagram, YouTube, or any URL.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {socialLinks.map((link, index) => {
                const displayIndex = socialLinks.length - index;
                const isActive = activeLinkIndex === index;
                return (
                  <li
                    key={link._key}
                    className={`rounded-xl border bg-[var(--surface)] p-3 sm:p-4 transition-colors ${
                      isActive
                        ? 'border-[var(--border-accent)] shadow-[0_0_0_1px_var(--glow-cyan)]'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                        <SocialPlatformIcon url={link.url} platform={link.platform} />
                        <span className="text-[10px] font-semibold app-muted">#{displayIndex}</span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-3">
                        <label className="app-label !text-xs">
                          Title
                          <input
                            type="text"
                            value={link.title}
                            maxLength={80}
                            placeholder="e.g. Instagram"
                            onFocus={() => setActiveLinkIndex(index)}
                            onChange={(e) => updateLink(index, { title: e.target.value })}
                            className="app-input !mt-1 !py-2.5"
                          />
                        </label>
                        <label className="app-label !text-xs">
                          Link URL
                          <input
                            type="text"
                            value={link.url}
                            maxLength={500}
                            placeholder="instagram.com/yourhandle"
                            onFocus={() => setActiveLinkIndex(index)}
                            onChange={(e) => updateLink(index, { url: e.target.value })}
                            className="app-input !mt-1 !py-2.5"
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="self-start rounded-lg p-2 text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
                        aria-label="Remove link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="app-card-padded">
          <div className="flex items-start gap-4">
            <span className="app-stat-icon shrink-0">
              <Download className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Allow download in app</h2>
                  <p className="text-sm app-muted mt-1">
                    When enabled, viewers can download your videos in the Mast Player app. Applies
                    to all of your videos.
                  </p>
                </div>
                <button
                  type="button"
                  id={downloadToggleId}
                  role="switch"
                  aria-checked={allowVideoDownload}
                  onClick={() => setAllowVideoDownload((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                    allowVideoDownload
                      ? 'bg-[var(--gradient-brand-h)]'
                      : 'bg-[var(--border)]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      allowVideoDownload ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-xs font-medium text-[var(--primary)]">
                {allowVideoDownload ? 'Download enabled' : 'Download disabled'}
              </p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="app-btn-primary w-full sm:w-auto">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <button type="button" onClick={handleLogout} className="app-btn-ghost w-full sm:w-auto">
        Log out
      </button>
    </div>
  );
}
