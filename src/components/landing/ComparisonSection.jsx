import { Check, Minus } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const ROWS = [
  'Easy Video Upload',
  'Instant Share Links',
  'Browser Playback',
  'Mobile Experience',
  'Video Dashboard',
  'View Analytics',
  'Monetization Ready',
  'Simple Sharing',
];

const COLS = {
  mast: [true, true, true, true, true, true, true, true],
  files: [false, false, false, false, false, false, false, true],
  basic: [true, false, true, false, false, false, false, true],
};

function Cell({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-medium)] text-[var(--primary)]">
        <Check className="w-4 h-4" aria-label="Yes" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)]">
      <Minus className="w-4 h-4" aria-label="No" />
    </span>
  );
}

export default function ComparisonSection() {
  return (
    <SectionShell id="comparison" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-10">
          Why Choose MastPlayer?
        </h2>
      </Reveal>

      <Reveal delay={60}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Feature</th>
                <th className="py-3 px-4 font-bold text-[var(--primary)]">MastPlayer</th>
                <th className="py-3 px-4 font-medium text-[var(--muted)]">Traditional File Sharing</th>
                <th className="py-3 px-4 font-medium text-[var(--muted)]">Basic Video Hosting</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 px-4 text-[var(--foreground)] font-medium">{row}</td>
                  <td className="py-3 px-4 text-center bg-[var(--accent-faint)]">
                    <Cell value={COLS.mast[i]} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Cell value={COLS.files[i]} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Cell value={COLS.basic[i]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </SectionShell>
  );
}
