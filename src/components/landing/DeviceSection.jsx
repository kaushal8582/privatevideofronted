import { Globe, Monitor, Smartphone } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import DashboardMockup from './DashboardMockup.jsx';
import PhoneMockup from './PhoneMockup.jsx';

export default function DeviceSection() {
  return (
    <SectionShell id="devices" className="py-12 sm:py-16 lg:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <Reveal>
          <div className="min-w-0">
            <h2 className="landing-heading mb-3 sm:mb-4">
              Web Studio. Mobile Playback.
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-6 sm:mb-8">
              Creators upload and manage on the web. Viewers watch shared videos in the Mast Player
              Android app — with deep links from every share URL.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { icon: Monitor, label: 'Creator Studio on desktop & tablet' },
                { icon: Globe, label: 'Share pages open in any browser' },
                { icon: Smartphone, label: 'Full playback in the Android app' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-green)] text-[var(--primary)] shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-6 items-center sm:items-end min-w-0">
            <div className="w-full min-w-0">
              <DashboardMockup />
            </div>
            <div className="w-[min(100%,220px)] sm:w-[min(100%,200px)] shrink-0">
              <PhoneMockup />
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
