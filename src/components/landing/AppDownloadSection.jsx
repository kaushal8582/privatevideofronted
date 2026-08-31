import { ExternalLink } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import PhoneMockup from './PhoneMockup.jsx';
import { PLAY_STORE_URL } from '../../constants/landing.js';

export default function AppDownloadSection() {
  return (
    <SectionShell id="app" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Take MastPlayer With You
            </h2>
            <p className="text-[var(--muted)] leading-relaxed mb-8 max-w-lg">
              Viewers watch shared videos in the Mast Player Android app. Full playback, deep links
              from every share URL, and app views that count toward creator stats.
            </p>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl app-gradient-bg text-white px-6 py-3.5 text-sm font-bold hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              Get it on Google Play
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <PhoneMockup />
        </Reveal>
      </div>
    </SectionShell>
  );
}
