import { BarChart3, Cloud, DollarSign, Link2, MonitorPlay, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import ShareLinkDemo from './ShareLinkDemo.jsx';
import DashboardMockup from './DashboardMockup.jsx';
import PhoneMockup from './PhoneMockup.jsx';

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
    body: 'Turn qualified app views into estimated creator earnings. Built for creators who grow an audience over time.',
    visual: 'monetization',
    cta: { label: 'Learn about monetization', hash: '#monetization' },
  },
];

function FeatureVisual({ type }) {
  if (type === 'dashboard') return <DashboardMockup />;
  if (type === 'share') return <ShareLinkDemo />;
  if (type === 'phone') return <PhoneMockup />;
  if (type === 'analytics') {
    return (
      <div className="grid grid-cols-2 gap-3" aria-hidden>
        {['Total Views', 'Payable Views', 'Watch Time', 'Completion'].map((label, i) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--foreground)] tabular-nums">
              {['2.4k', '186', '48h', '62%'][i]}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-[var(--border-green)] bg-[var(--surface-elevated)] p-6">
      <Cloud className="w-8 h-8 text-[var(--primary)] mb-3" />
      <p className="text-sm text-[var(--muted)] leading-relaxed">
        Estimated earnings update as qualified app views accrue. Availability may vary by region and demand.
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <SectionShell id="features" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          Everything You Need to Manage Your Videos
        </h2>
      </Reveal>

      <div className="space-y-16 sm:space-y-24">
        {FEATURES.map((feature, i) => {
          const Icon = feature.badge;
          const reverse = feature.reverse;
          return (
            <Reveal key={feature.title} delay={i * 40}>
              <div
                className={[
                  'grid lg:grid-cols-2 gap-10 lg:gap-16 items-center',
                  reverse ? 'lg:[direction:rtl] lg:*:[direction:ltr]' : '',
                ].join(' ')}
              >
                <div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-green)] bg-[var(--accent-soft)] text-[var(--primary)] mb-4">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed mb-6">{feature.body}</p>
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
                <FeatureVisual type={feature.visual} />
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
