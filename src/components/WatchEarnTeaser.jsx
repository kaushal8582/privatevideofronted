import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { USD_PER_1000_VIEWS } from '../constants/landing.js';
import { toYoutubeEmbedUrl } from './WatchAppPromo.jsx';

const EARN_YOUTUBE_URL = String(import.meta.env.VITE_WATCH_EARN_YOUTUBE_URL || '').trim();

const SNAPSHOTS = [
  { views: '1K', earn: USD_PER_1000_VIEWS },
  { views: '10K', earn: USD_PER_1000_VIEWS * 10 },
  { views: '100K', earn: USD_PER_1000_VIEWS * 100 },
];

function formatUsd(n) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

/**
 * Compact earn teaser for watch pages — not the full landing monetization block.
 */
export default function WatchEarnTeaser() {
  const embed = toYoutubeEmbedUrl(EARN_YOUTUBE_URL);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pb-2 sm:pb-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border-green)] bg-[var(--surface)]">
          <div
            className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[var(--primary)]/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-36 w-36 rounded-full bg-[var(--blue)]/10 blur-3xl"
            aria-hidden
          />

          <div
            className={`relative grid gap-0 ${embed ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}
          >
            <div className="p-5 sm:p-6 flex flex-col justify-center min-w-0">
              <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--border)] bg-[var(--background)]/80 px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)] mb-3">
                <Sparkles className="w-3 h-3" />
                Creator tip
              </div>

              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                You can earn from shares
              </p>

              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0 mb-2">
                <span className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold leading-none app-gradient-text">
                  ${USD_PER_1000_VIEWS}
                </span>
                <span className="text-sm sm:text-base font-medium text-[var(--muted)]">
                  / 1,000 app views
                </span>
              </div>

              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 max-w-sm">
                Share this link. When people watch in the MastPlayer app, creators can earn an
                estimated {formatUsd(USD_PER_1000_VIEWS)} per 1,000 qualified views.
              </p>

              <ul className="flex flex-wrap gap-2 mb-4" aria-label="Example earnings">
                {SNAPSHOTS.map(({ views, earn }) => (
                  <li
                    key={views}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/60 px-2.5 py-1.5 text-xs"
                  >
                    <span className="tabular-nums text-[var(--muted)]">{views}</span>
                    <span className="text-[var(--border)]" aria-hidden>
                      →
                    </span>
                    <span className="font-bold tabular-nums text-[var(--foreground)]">
                      {formatUsd(earn)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="app-btn-primary self-start !text-sm !py-2.5 !px-4"
              >
                Start earning free
              </Link>
            </div>

            {embed ? (
              <div className="border-t lg:border-t-0 lg:border-l border-[var(--border)] p-4 sm:p-5 bg-[var(--background)]/40">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2.5">
                  How creators earn
                </p>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-black">
                  <iframe
                    title="How creators earn on MastPlayer"
                    src={embed}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
