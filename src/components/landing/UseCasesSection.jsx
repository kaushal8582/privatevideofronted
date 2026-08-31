import { Film, Megaphone, Users } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const CASES = [
  {
    icon: Film,
    title: 'Course & tutorial creators',
    body: 'Share lesson links instead of heavy downloads. Track which videos get watched in the app.',
  },
  {
    icon: Megaphone,
    title: 'Product launches',
    body: 'Send a single link for demos, teasers, and walkthroughs to customers and partners.',
  },
  {
    icon: Users,
    title: 'Community updates',
    body: 'Keep members in the loop with private share URLs you can revoke by deleting the video.',
  },
];

export default function UseCasesSection() {
  return (
    <SectionShell id="use-cases" className="py-16 sm:py-24">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-12">
          Real Ways Creators Use MastPlayer
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {CASES.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 70}>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 h-full">
              <Icon className="w-7 h-7 text-[var(--primary)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
