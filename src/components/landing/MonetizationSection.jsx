import { ArrowRight, BarChart3, Eye, TrendingUp } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import { USD_PER_1000_VIEWS } from '../../constants/landing.js';

const SCALE = [
  { views: '1,000', earn: USD_PER_1000_VIEWS },
  { views: '10,000', earn: USD_PER_1000_VIEWS * 10 },
  { views: '100,000', earn: USD_PER_1000_VIEWS * 100 },
];

const POINTS = [
  {
    icon: Eye,
    title: 'Qualified app views',
    body: 'Views counted in the Mast Player app can contribute toward estimated earnings.',
  },
  {
    icon: TrendingUp,
    title: 'Grows with your reach',
    body: 'Share more links, grow more views — the rate stays clear and predictable.',
  },
  {
    icon: BarChart3,
    title: 'Tracked in Studio',
    body: 'See payable views and estimated earnings update as your audience watches.',
  },
];

function formatUsd(n) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export default function MonetizationSection() {
  return (
    <SectionShell
      id="monetization"
      className="py-12 sm:py-16 lg:py-24 bg-[var(--surface)] border-y border-[var(--border)]"
    >
      <Reveal>
        <h2 className="landing-heading text-center max-w-3xl mx-auto mb-3 sm:mb-4">
          Turn Your Audience Into Opportunity
        </h2>
        <p className="text-center text-sm text-[var(--muted)] max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-1">
          A clear rate for creators — estimated earnings from qualified app views.
        </p>
      </Reveal>

      {/* Rate showcase — single composition, typographic focus */}
      <Reveal delay={60}>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-green)] bg-[var(--surface-elevated)] px-5 py-8 sm:px-10 sm:py-12 mb-8 sm:mb-12">
          <div className="pointer-events-none absolute inset-0 landing-rate-glow" aria-hidden />

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)] mb-4">
                Creator rate
              </p>

              <div className="flex flex-wrap items-end justify-center lg:justify-start gap-x-3 gap-y-1 mb-3">
                <span
                  className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,14vw,6.5rem)] font-extrabold leading-none tracking-tight app-gradient-text landing-rate-pulse"
                  aria-label={`${USD_PER_1000_VIEWS} dollars`}
                >
                  ${USD_PER_1000_VIEWS}
                </span>
                <span className="pb-2 sm:pb-3 text-base sm:text-xl font-semibold text-[var(--muted)]">
                  per 1,000 views
                </span>
              </div>

              <p className="text-sm sm:text-base text-[var(--muted)] max-w-md mx-auto lg:mx-0 leading-relaxed">
                Every <strong className="text-[var(--foreground)]">1,000 qualified app views</strong>{' '}
                estimates to{' '}
                <strong className="text-[var(--foreground)]">
                  {formatUsd(USD_PER_1000_VIEWS)}
                </strong>{' '}
                for creators.
              </p>
            </div>

            {/* Live equation visual */}
            <div className="flex flex-col items-stretch gap-3 sm:gap-4">
              <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-3 sm:px-5 py-3.5 sm:py-4">
                <div className="min-w-0 text-center flex-1">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] mb-1">Views</p>
                  <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)]">
                    1,000
                  </p>
                </div>
                <ArrowRight
                  className="w-5 h-5 text-[var(--primary)] shrink-0 landing-rate-arrow"
                  aria-hidden
                />
                <div className="min-w-0 text-center flex-1">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] mb-1">
                    Est. earn
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tabular-nums app-gradient-text">
                    {formatUsd(USD_PER_1000_VIEWS)}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Earnings scale examples">
                {SCALE.map(({ views, earn }) => (
                  <li
                    key={views}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 px-2 py-3 text-center"
                  >
                    <p className="text-[10px] sm:text-xs text-[var(--muted)] tabular-nums truncate">
                      {views}
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-bold tabular-nums text-[var(--foreground)]">
                      {formatUsd(earn)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {POINTS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={100 + i * 70}>
            <div className="h-full">
              <Icon className="w-6 h-6 text-[var(--primary)] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-2">
                {title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={280}>
        <p className="mt-8 sm:mt-10 text-center text-xs text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          Estimated rate. Actual earnings may vary by eligibility, traffic, region, and advertising
          demand.
        </p>
      </Reveal>
    </SectionShell>
  );
}
