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
    <section id="top" className="landing-section pt-6 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 lg:pb-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 landing-hero-glow"
        aria-hidden
      />
      <div className="landing-container px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="min-w-0">
            <Reveal>
              <p className="inline-flex items-center rounded-full border border-[var(--border-green)] bg-[var(--accent-soft)] px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.14em] text-[var(--primary)] uppercase mb-4 sm:mb-6">
                All-in-one video platform
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,6.5vw,3.75rem)] font-extrabold tracking-tight text-[var(--foreground)] leading-[1.08] mb-4 sm:mb-6">
                Upload. Share. Monetize.{' '}
                <span className="app-gradient-text">Your Videos.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-xl leading-relaxed mb-6 sm:mb-8">
                Upload videos, generate a shareable link, manage your content and understand how
                your videos perform — all from one simple platform.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
                <Link
                  to={uploadTo}
                  className="app-btn-primary app-btn-primary-lg w-full sm:w-auto justify-center"
                >
                  <Upload className="w-5 h-5 shrink-0" />
                  <span className="truncate">Upload Your First Video</span>
                </Link>
                <button
                  type="button"
                  onClick={scrollToFeatures}
                  className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-base font-semibold text-[var(--foreground)] hover:border-[var(--border-green)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                >
                  See How It Works
                </button>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <ul className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6">
                {TRUST.map(({ icon: Icon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-green)] bg-[var(--accent-soft)] text-[var(--primary)] shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative min-w-0 w-full">
            <div className="relative w-full max-w-full">
              <div className="w-full overflow-hidden rounded-2xl">
                <DashboardMockup />
              </div>
              {/* Phone overlay — tablet+ only, clipped so it never causes page scroll */}
              <div className="hidden md:block absolute -bottom-4 -right-2 lg:-bottom-6 lg:-right-4 xl:-right-6 w-[38%] max-w-[180px] lg:max-w-[200px] z-10">
                <PhoneMockup />
              </div>
              {/* Phone below mockup on small screens */}
              <div className="md:hidden mt-6 flex justify-center">
                <div className="w-[min(100%,220px)]">
                  <PhoneMockup />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
