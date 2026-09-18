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
    <SectionShell id="comparison" className="py-12 sm:py-16 lg:py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-center text-[var(--foreground)] mb-8 sm:mb-10">
          Why Choose MastPlayer?
        </h2>
      </Reveal>

      {/* Mobile: card list focused on MastPlayer wins */}
      <Reveal delay={60}>
        <div className="md:hidden space-y-3">
          {ROWS.map((row, i) => (
            <div
              key={row}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
            >
              <p className="text-sm font-semibold text-[var(--foreground)] mb-3">{row}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-[var(--accent-faint)] border border-[var(--border-green)] p-2 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[var(--primary)]">MastPlayer</span>
                  <Cell value={COLS.mast[i]} />
                </div>
                <div className="rounded-lg border border-[var(--border)] p-2 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-[var(--muted)] leading-tight">File share</span>
                  <Cell value={COLS.files[i]} />
                </div>
                <div className="rounded-lg border border-[var(--border)] p-2 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-[var(--muted)] leading-tight">Basic host</span>
                  <Cell value={COLS.basic[i]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Tablet/desktop: table */}
      <Reveal delay={60}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-3 lg:px-4 font-medium text-[var(--muted)]">Feature</th>
                <th className="py-3 px-3 lg:px-4 font-bold text-[var(--primary)]">MastPlayer</th>
                <th className="py-3 px-3 lg:px-4 font-medium text-[var(--muted)]">Traditional File Sharing</th>
                <th className="py-3 px-3 lg:px-4 font-medium text-[var(--muted)]">Basic Video Hosting</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 px-3 lg:px-4 text-[var(--foreground)] font-medium">{row}</td>
                  <td className="py-3 px-3 lg:px-4 text-center bg-[var(--accent-faint)]">
                    <Cell value={COLS.mast[i]} />
                  </td>
                  <td className="py-3 px-3 lg:px-4 text-center">
                    <Cell value={COLS.files[i]} />
                  </td>
                  <td className="py-3 px-3 lg:px-4 text-center">
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
