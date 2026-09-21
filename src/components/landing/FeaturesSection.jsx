import { BarChart3, DollarSign, Link2, MonitorPlay, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import ShareLinkDemo from './ShareLinkDemo.jsx';
import DashboardMockup from './DashboardMockup.jsx';
import PhoneMockup from './PhoneMockup.jsx';
import { USD_PER_1000_VIEWS } from '../../constants/landing.js';

const FEATURES = [
  {
    badge: Upload,
    title: 'Video Upload & Hosting',
    body: 'Upload large files in the background with chunked transfers. Your videos are stored securely and ready for playback.',
    visual: 'dashboard',
    cta: { label: 'Start uploading', to: '/register' },
  },
  {
    badge: Link2,
    title: 'Instant Shareable Links',
    body: 'Every upload gets a unique URL. Copy once and share anywhere — email, chat, social, or embed in docs.',
    visual: 'share',
    reverse: true,
  },
  {
    badge: MonitorPlay,
    title: 'Beautiful Video Playback',
    body: 'Shared links open a clean watch page on the web and full playback in the Mast Player Android app.',
    visual: 'phone',
  },
  {
    badge: BarChart3,
    title: 'Video Analytics',
    body: 'Track app views, payable views, and per-video performance from Creator Studio — know what resonates.',
    visual: 'analytics',
    reverse: true,
  },
  {
    badge: DollarSign,
    title: 'Monetization',
    body: `Earn an estimated $${USD_PER_1000_VIEWS} for every 1,000 qualified app views. Clear rate, tracked in Creator Studio as your audience grows.`,
    visual: 'monetization',
    cta: { label: 'See the creator rate', hash: '#monetization' },
  },
];

function FeatureVisual({ type }) {
  if (type === 'dashboard') return <DashboardMockup />;
  if (type === 'share') return <ShareLinkDemo />;
  if (type === 'phone') {
    return (
      <div className="flex justify-center">
        <div className="w-[min(100%,240px)]">
          <PhoneMockup />
        </div>
      </div>
    );
  }
  if (type === 'analytics') {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3" aria-hidden>
        {['Total Views', 'Payable Views', 'Watch Time', 'Completion'].map((label, i) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 sm:p-4 min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] truncate">{label}</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-[var(--foreground)] tabular-nums">
              {['2.4k', '186', '48h', '62%'][i]}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-green)] bg-[var(--surface-elevated)] p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 landing-rate-glow opacity-70" aria-hidden />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--primary)] mb-2">
          Creator rate
        </p>
        <p className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold tracking-tight app-gradient-text leading-none">
          ${USD_PER_1000_VIEWS}
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">per 1,000 views</p>
        <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
          Estimated earnings update as qualified app views accrue. Availability may vary by region
          and demand.
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <SectionShell id="features" className="py-12 sm:py-16 lg:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <Reveal>
        <h2 className="landing-heading text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-20">
          Everything You Need to Manage Your Videos
        </h2>
      </Reveal>

      <div className="space-y-12 sm:space-y-16 lg:space-y-24">
        {FEATURES.map((feature, i) => {
          const Icon = feature.badge;
          const reverse = feature.reverse;
          return (
            <Reveal key={feature.title} delay={i * 40}>
              <div
                className={[
                  'grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center',
                  reverse ? 'lg:[direction:rtl] lg:*:[direction:ltr]' : '',
                ].join(' ')}
              >
                <div className="min-w-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-green)] bg-[var(--accent-soft)] text-[var(--primary)] mb-4">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-5 sm:mb-6">{feature.body}</p>
                  {feature.cta ? (
                    feature.cta.hash ? (
                      <a
                        href={feature.cta.hash}
                        className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                      >
                        {feature.cta.label} →
                      </a>
                    ) : (
                      <Link
                        to={feature.cta.to}
                        className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                      >
                        {feature.cta.label} →
                      </Link>
                    )
                  ) : null}
                </div>
                <div className="min-w-0 w-full">
                  <FeatureVisual type={feature.visual} />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
