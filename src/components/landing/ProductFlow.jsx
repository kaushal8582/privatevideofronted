import { Link2, Play, Share2, Upload } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const STEPS = [
  { icon: Upload, title: 'Upload', body: 'Add your video from Creator Studio.' },
  { icon: Link2, title: 'Generate Link', body: 'Get a unique mastplayer.in/v/… URL.' },
  { icon: Share2, title: 'Share', body: 'Send the link anywhere — no app required to open.' },
  { icon: Play, title: 'Watch', body: 'Viewers play in Mast Player on Android.' },
];

export default function ProductFlow() {
  return (
    <SectionShell id="product-flow" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] tracking-tight">
            One Upload. One Link. Watch Anywhere.
          </h2>
        </div>
      </Reveal>

      <div className="relative">
        <div
          className="hidden lg:block absolute top-[2.75rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[var(--border-green)] to-transparent"
          aria-hidden
        />
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80}>
              <li className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 text-center lg:text-left h-full">
                <div className="mx-auto lg:mx-0 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-green)] bg-[var(--accent-soft)] text-[var(--primary)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
