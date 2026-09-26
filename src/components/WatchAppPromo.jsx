import { Smartphone } from 'lucide-react';
import { APP_STORE_URL, PLAY_STORE_URL, WATCH_TUTORIAL_YOUTUBE_URL } from '../constants/landing.js';

/**
 * Accepts watch / share / embed YouTube URLs → embeddable /embed/ID URL.
 */
export function toYoutubeEmbedUrl(raw) {
  const input = String(raw || '').trim();
  if (!input) return '';

  try {
    const u = new URL(input);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (u.pathname.startsWith('/embed/')) {
        const id = u.pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }
  } catch {
    /* fall through */
  }

  // Bare video id
  if (/^[\w-]{11}$/.test(input)) {
    return `https://www.youtube.com/embed/${input}`;
  }

  return '';
}

function GooglePlayBadge({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black px-3.5 py-2.5 hover:border-white/40 transition-colors"
      aria-label="Get it on Google Play"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" aria-hidden>
        <path fill="#EA4335" d="M3.6 2.2c-.4.2-.6.6-.6 1v17.6c0 .4.2.8.6 1l9.7-9.8L3.6 2.2z" />
        <path fill="#FBBC04" d="M16.1 14.5 13.3 11.8 3.6 21.8c.2.1.4.2.6.2.3 0 .6-.1.9-.3l11-7.2z" />
        <path fill="#4285F4" d="M20.5 10.7 16.1 7.9 13.3 10.7l2.8 2.8 4.4-2.8c.7-.4.7-1.4 0-1.8z" />
        <path fill="#34A853" d="M3.6 2.2 13.3 12l2.8-2.8L5.1 2.3C4.8 2.1 4.5 2 4.2 2c-.2 0-.4.1-.6.2z" />
      </svg>
      <span className="text-left leading-tight text-white">
        <span className="block text-[9px] uppercase tracking-wide text-white/70">Get it on</span>
        <span className="block text-sm font-semibold">Google Play</span>
      </span>
    </a>
  );
}

function AppStoreBadge({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black px-3.5 py-2.5 hover:border-white/40 transition-colors"
      aria-label="Download on the App Store"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 fill-white" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="text-left leading-tight text-white">
        <span className="block text-[9px] uppercase tracking-wide text-white/70">Download on the</span>
        <span className="block text-sm font-semibold">App Store</span>
      </span>
    </a>
  );
}

/**
 * Watch-page promo: open in app + optional tutorial (above footer).
 */
export default function WatchAppPromo() {
  const playStoreUrl = PLAY_STORE_URL;
  const appStoreUrl = APP_STORE_URL;
  const tutorialRaw = WATCH_TUTORIAL_YOUTUBE_URL;
  const tutorialEmbed = toYoutubeEmbedUrl(tutorialRaw);

  const platforms = [playStoreUrl && 'Android', appStoreUrl && 'iOS'].filter(Boolean);
  const badgeLabel =
    platforms.length === 2
      ? 'Free on Android & iOS'
      : platforms.length === 1
        ? `Free on ${platforms[0]}`
        : 'Free app';

  const showStores = Boolean(playStoreUrl || appStoreUrl);
  if (!showStores && !tutorialEmbed) return null;

  return (
    <section className="w-full border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
          <div className="px-5 sm:px-8 py-8 sm:py-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-3 py-1 text-xs font-semibold mb-4">
              <Smartphone className="w-3.5 h-3.5" />
              {badgeLabel}
            </span>

            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
              Open in MastPlayer App
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)] max-w-md mx-auto mb-6 leading-relaxed">
              Download the app to watch this video and all MastPlayer content with full playback and
              counted views.
            </p>

            {showStores ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {playStoreUrl ? <GooglePlayBadge href={playStoreUrl} /> : null}
                {appStoreUrl ? <AppStoreBadge href={appStoreUrl} /> : null}
              </div>
            ) : null}
          </div>

          {tutorialEmbed ? (
            <>
              <div className="border-t border-[var(--border)]" />
              <div className="px-5 sm:px-8 py-8 sm:py-10 text-center">
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
                  How to Open Video in App
                </h3>
                <p className="text-sm text-[var(--muted)] max-w-lg mx-auto mb-6 leading-relaxed">
                  Click any MastPlayer link and it opens directly in the app. Watch the tutorial
                  below for a quick walkthrough.
                </p>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-black max-w-2xl mx-auto">
                  <iframe
                    title="How to open MastPlayer videos in the app"
                    src={tutorialEmbed}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
