import { Globe, Monitor, Smartphone } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import DashboardMockup from './DashboardMockup.jsx';
import PhoneMockup from './PhoneMockup.jsx';

export default function DeviceSection() {
  return (
    <SectionShell id="devices" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Web Studio. Mobile Playback.
            </h2>
            <p className="text-[var(--muted)] leading-relaxed mb-8">
              Creators upload and manage on the web. Viewers watch shared videos in the Mast Player
              Android app — with deep links from every share URL.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Monitor, label: 'Creator Studio on desktop & tablet' },
                { icon: Globe, label: 'Share pages open in any browser' },
                { icon: Smartphone, label: 'Full playback in the Android app' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-green)] text-[var(--primary)]">
                    <Icon className="w-4 h-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-end">
            <DashboardMockup />
            <div className="hidden sm:block">
              <PhoneMockup />
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
