import { Briefcase, Building2, GraduationCap, Users, Palette } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const AUDIENCES = [
  { icon: Palette, title: 'Creators', body: 'Share exclusive clips, tutorials, and updates with a link you control.' },
  { icon: Building2, title: 'Businesses', body: 'Deliver product demos and internal updates without bulky attachments.' },
  { icon: GraduationCap, title: 'Educators', body: 'Share lessons and walkthroughs students can open on any device.' },
  { icon: Users, title: 'Teams', body: 'Keep async video updates in one dashboard with copy-ready links.' },
  { icon: Briefcase, title: 'Agencies', body: 'Send client previews and campaign assets through branded share URLs.' },
];

export default function AudienceSection() {
  return (
    <SectionShell id="audience" className="py-16 sm:py-24">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-12">
          Built for Every Kind of Creator
        </h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {AUDIENCES.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 60}>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 h-full hover:border-[var(--border-green)] transition-colors">
              <Icon className="w-6 h-6 text-[var(--primary)] mb-4" aria-hidden />
              <h3 className="font-semibold text-[var(--foreground)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
