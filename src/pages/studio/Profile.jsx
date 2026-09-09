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
    return <p className="app-muted text-sm">Loading profile…</p>;
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tracking-tight">
            Profile
          </h1>
          <p className="text-xs sm:text-sm app-muted">
            Account, social links, and app settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="app-btn-ghost !py-1.5 !px-2.5 !text-xs"
          >
            Log out
          </button>
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="app-btn-primary !py-1.5 !px-3 !text-xs"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSave} className="grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-3">
          <section className="app-card p-3 sm:p-4 space-y-3">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-11 h-11 rounded-xl object-cover border border-[var(--border)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center text-lg font-semibold">
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs app-muted truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {providers.includes('email') && (
                <span className="app-badge !text-[10px]">Email</span>
              )}
              {providers.includes('google') && (
                <span className="app-badge !text-[10px]">Google</span>
              )}
              {!providers.length && (
                <span className="text-[11px] app-muted">No providers listed</span>
              )}
            </div>

            <label className="block">
              <span className="text-xs font-medium">Display name</span>
              <input
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="app-input !mt-1 !py-2 !text-sm"
              />
            </label>
          </section>

          <section className="app-card p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--primary)]">
                <Download className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold">Allow download in app</h2>
                    <p className="text-[11px] app-muted leading-snug mt-0.5">
                      Viewers can download your videos in Mast Player.
                    </p>
                  </div>
                  <button
                    type="button"
                    id={downloadToggleId}
                    role="switch"
                    aria-checked={allowVideoDownload}
                    onClick={() => setAllowVideoDownload((v) => !v)}
                    className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
                      allowVideoDownload
                        ? 'bg-[var(--gradient-brand-h)]'
                        : 'bg-[var(--border)]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        allowVideoDownload ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-1 text-[11px] font-medium text-[var(--primary)]">
                  {allowVideoDownload ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="lg:col-span-7 app-card p-3 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[var(--primary)]" />
                <h2 className="text-sm font-semibold">Social Links</h2>
                <span className="app-badge app-badge-green !text-[10px] tabular-nums">
                  {socialLinks.length}/{MAX_SOCIAL_LINKS}
                </span>
              </div>
              <p className="text-[11px] app-muted mt-0.5">
                Instagram, YouTube, or any URL — public display coming soon
              </p>
            </div>
            <button
              type="button"
              onClick={addLink}
              disabled={socialLinks.length >= MAX_SOCIAL_LINKS}
              className="app-btn-secondary !py-1.5 !px-2.5 !text-xs shrink-0 disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-3 py-5 text-center">
              <p className="text-xs app-muted">No links yet. Add one to get started.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {socialLinks.map((link, index) => {
                const displayIndex = socialLinks.length - index;
                const isActive = activeLinkIndex === index;
                return (
                  <li
                    key={link._key}
                    className={`rounded-lg border bg-[var(--surface)] p-2.5 transition-colors ${
                      isActive
                        ? 'border-[var(--border-accent)]'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0">
                        <SocialPlatformIcon url={link.url} platform={link.platform} />
                        <span className="text-[10px] font-semibold app-muted">
                          #{displayIndex}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 grid gap-2 sm:grid-cols-5">
                        <label className="block sm:col-span-2">
                          <span className="text-[10px] font-medium app-muted">Title</span>
                          <input
                            type="text"
                            value={link.title}
                            maxLength={80}
                            placeholder="e.g. Instagram"
                            onFocus={() => setActiveLinkIndex(index)}
                            onChange={(e) => updateLink(index, { title: e.target.value })}
                            className="app-input !mt-0.5 !py-1.5 !px-2.5 !text-sm"
                          />
                        </label>
                        <label className="block sm:col-span-3">
                          <span className="text-[10px] font-medium app-muted">URL</span>
                          <input
                            type="text"
                            value={link.url}
                            maxLength={500}
                            placeholder="instagram.com/yourhandle"
                            onFocus={() => setActiveLinkIndex(index)}
                            onChange={(e) => updateLink(index, { url: e.target.value })}
                            className="app-input !mt-0.5 !py-1.5 !px-2.5 !text-sm"
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="self-start rounded-md p-1.5 text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
                        aria-label="Remove link"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </form>
    </div>
  );
}
