import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const CARDS = [
  {
    icon: DollarSign,
    title: 'Video Monetization',
    body: 'Qualified app views can contribute to estimated creator earnings through in-app advertising.',
  },
  {
    icon: TrendingUp,
    title: 'Audience Growth',
    body: 'Share links anywhere. Every view in Mast Player helps you understand what content travels.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    body: 'See app views and payable views per video so you know what to publish next.',
  },
];

export default function MonetizationSection() {
  return (
    <SectionShell id="monetization" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] text-center max-w-3xl mx-auto mb-4">
          Turn Your Audience Into Opportunity
        </h2>
        <p className="text-center text-sm text-[var(--muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
          Monetization availability and earnings may vary based on eligibility, traffic, region and
          advertising demand.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {CARDS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 70}>
            <article className="rounded-2xl border border-[var(--border-green)] bg-[var(--surface-elevated)] p-6 h-full">
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
