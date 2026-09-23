import SocialPlatformIcon from './SocialPlatformIcon.jsx';

/**
 * Public social profiles — set via Vite env (empty = hidden).
 * Example:
 *   VITE_SOCIAL_YOUTUBE_URL=https://www.youtube.com/@mastplayerofficial
 *   VITE_SOCIAL_TELEGRAM_URL=https://t.me/mastplayer
 *   VITE_SOCIAL_INSTAGRAM_URL=
 */
function normalizeSocialUrl(raw, { telegram = false } = {}) {
  const value = String(raw || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (telegram) {
    const handle = value.replace(/^@/, '');
    return handle ? `https://t.me/${handle}` : '';
  }
  return `https://${value.replace(/^\/\//, '')}`;
}

export const FOOTER_SOCIAL_LINKS = [
  {
    key: 'youtube',
    label: 'YouTube',
    platform: 'youtube',
    url: normalizeSocialUrl(import.meta.env.VITE_SOCIAL_YOUTUBE_URL),
  },
  {
    key: 'telegram',
    label: 'Telegram',
    platform: 'telegram',
    url: normalizeSocialUrl(import.meta.env.VITE_SOCIAL_TELEGRAM_URL, { telegram: true }),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    platform: 'instagram',
    url: normalizeSocialUrl(import.meta.env.VITE_SOCIAL_INSTAGRAM_URL),
  },
].filter((item) => Boolean(item.url));

export default function FooterSocialLinks({ className = '' }) {
  if (FOOTER_SOCIAL_LINKS.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {FOOTER_SOCIAL_LINKS.map(({ key, label, platform, url }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] rounded-full"
        >
          <SocialPlatformIcon platform={platform} className="!h-9 !w-9" />
        </a>
      ))}
    </div>
  );
}
