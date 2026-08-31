import { Link2, Play, Upload, Zap } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const STEPS = [
  { num: '01', icon: Upload, title: 'Upload', body: 'Select your video in Creator Studio.' },
  { num: '02', icon: Zap, title: 'Process', body: 'Prepare it for playback and sharing.' },
  { num: '03', icon: Link2, title: 'Share', body: 'Copy your unique MastPlayer URL.' },
  { num: '04', icon: Play, title: 'Watch', body: 'Open the link from another device.' },
];

export default function HowItWorks() {
  return (
    <SectionShell id="how-it-works" className="py-16 sm:py-24">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] text-center max-w-3xl mx-auto mb-14">
          From Video to Shareable Link in Seconds
        </h2>
      </Reveal>

      <div className="relative max-w-4xl mx-auto">
        <div
          className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--primary)] via-[var(--border-green)] to-transparent opacity-60 hidden sm:block"
          aria-hidden
        />
        <ol className="space-y-6">
          {STEPS.map(({ num, icon: Icon, title, body }, i) => (
            <Reveal key={num} delay={i * 80}>
              <li className="relative flex gap-4 sm:gap-6 sm:pl-4">
                <div className="hidden sm:flex absolute left-0 top-6 h-4 w-4 rounded-full app-gradient-bg ring-4 ring-[var(--background)] z-10" />
                <article className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex gap-4 hover:border-[var(--border-green)] transition-colors">
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--primary)]/40 shrink-0">
                    {num}
                  </span>
                  <div>
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-green)] bg-[var(--accent-soft)] text-[var(--primary)] mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">{title}</h3>
                    <p className="text-sm text-[var(--muted)]">{body}</p>
                  </div>
                </article>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
