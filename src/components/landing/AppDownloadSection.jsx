import { ExternalLink } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import PhoneMockup from './PhoneMockup.jsx';
import { PLAY_STORE_URL_OR_DEFAULT } from '../../constants/landing.js';

export default function AppDownloadSection() {
  const playStoreUrl = PLAY_STORE_URL_OR_DEFAULT;

  return (
    <SectionShell id="app" className="py-12 sm:py-16 lg:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <Reveal>
          <div className="min-w-0 text-center lg:text-left">
            <h2 className="landing-heading mb-3 sm:mb-4">
              Take MastPlayer With You
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
              Viewers watch shared videos in the Mast Player Android app. Full playback, deep links
              from every share URL, and app views that count toward creator stats.
            </p>
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl app-gradient-bg text-white px-6 py-3.5 text-sm font-bold hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              Get it on Google Play
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex justify-center">
            <div className="w-[min(100%,240px)]">
              <PhoneMockup />
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
