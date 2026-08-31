import { Link } from 'react-router-dom';
import { Upload, Link2, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardMockup from './DashboardMockup.jsx';
import PhoneMockup from './PhoneMockup.jsx';
import Reveal from './Reveal.jsx';

const TRUST = [
  { icon: Upload, label: 'Fast Uploads' },
  { icon: Link2, label: 'Instant Sharing' },
  { icon: Smartphone, label: 'Cross-Device Playback' },
];

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const uploadTo = isAuthenticated ? '/studio/upload' : '/register';

  const scrollToFeatures = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="landing-section pt-8 sm:pt-12 pb-16 sm:pb-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 landing-hero-glow"
        aria-hidden
      />
      <div className="landing-container px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <p className="inline-flex items-center rounded-full border border-[var(--border-green)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[var(--primary)] uppercase mb-6">
                All-in-one video platform
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.05] mb-6">
                Upload. Share. Monetize.{' '}
                <span className="app-gradient-text">Your Videos.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl leading-relaxed mb-8">
                Upload videos, generate a shareable link, manage your content and understand how
                your videos perform — all from one simple platform.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to={uploadTo}
                  className="app-btn-primary app-btn-primary-lg"
                >
                  <Upload className="w-5 h-5" />
                  Upload Your First Video
                </Link>
                <button
                  type="button"
                  onClick={scrollToFeatures}
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-base font-semibold text-[var(--foreground)] hover:border-[var(--border-green)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                >
                  See How It Works
                </button>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <ul className="flex flex-wrap gap-4 sm:gap-6">
                {TRUST.map(({ icon: Icon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-green)] bg-[var(--accent-soft)] text-[var(--primary)]">
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative">
            <div className="relative">
              <DashboardMockup />
              <div className="hidden sm:block absolute -bottom-6 -right-4 lg:-right-8 w-[42%] max-w-[200px] z-10">
                <PhoneMockup />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
