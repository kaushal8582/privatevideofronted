import { Cloud, Link2, Lock, Zap } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const ITEMS = [
  { icon: Lock, title: 'Secure HTTPS Delivery', body: 'Share links and playback are served over encrypted connections.' },
  { icon: Cloud, title: 'Reliable Cloud Storage', body: 'Videos are stored on scalable cloud infrastructure built for media.' },
  { icon: Zap, title: 'Fast Video Delivery', body: 'Optimized for streaming so viewers start watching quickly.' },
  { icon: Link2, title: 'Controlled Sharing', body: 'You choose what to share. Remove a video anytime to disable its link.' },
];

export default function SecuritySection() {
  return (
    <SectionShell id="security" className="py-12 sm:py-16 lg:py-24">
      <Reveal>
        <h2 className="landing-heading text-center mb-8 sm:mb-12">
          Built for Safe, Reliable Delivery
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ITEMS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 60}>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 h-full">
              <Icon className="w-6 h-6 text-[var(--primary)] mb-3" />
              <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm">{title}</h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
