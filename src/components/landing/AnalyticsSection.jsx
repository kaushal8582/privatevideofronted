import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';

const CHART = [28, 42, 35, 58, 48, 72, 65, 80, 74, 92, 86, 100];

const DEVICES = [
  { label: 'Mobile', pct: 68 },
  { label: 'Desktop', pct: 24 },
  { label: 'Tablet', pct: 8 },
];

const ACTIVITY = [
  { time: '2m ago', event: 'App view · Product walkthrough' },
  { time: '18m ago', event: 'Payable view · Team onboarding' },
  { time: '1h ago', event: 'App view · Launch teaser' },
];

export default function AnalyticsSection() {
  return (
    <SectionShell id="analytics" className="py-12 sm:py-16 lg:py-24">
      <Reveal>
        <h2 className="landing-heading text-center mb-3 sm:mb-4">
          Understand Your Audience
        </h2>
        <p className="text-center text-sm sm:text-base text-[var(--muted)] max-w-2xl mx-auto mb-8 sm:mb-12 px-1">
          Illustrative dashboard — your Creator Studio shows real app views and payable stats.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 sm:p-5 lg:p-6 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {[
              { label: 'Total Views', value: '2,418' },
              { label: 'Unique Views', value: '1,204' },
              { label: 'Watch Time', value: '48h 12m' },
              { label: 'Completion Rate', value: '62%' },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] truncate">{card.label}</p>
                <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-[var(--foreground)] tabular-nums">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 min-w-0">
              <p className="text-xs font-semibold text-[var(--muted)] mb-3 sm:mb-4">Views Over Time</p>
              <div className="flex items-end gap-1 sm:gap-1.5 h-28 sm:h-32" role="img" aria-label="Sample views chart">
                {CHART.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-0 rounded-t-sm bg-gradient-to-t from-[var(--primary)]/30 to-[var(--primary)]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 min-w-0">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
                <p className="text-xs font-semibold text-[var(--muted)] mb-3">Device Distribution</p>
                {DEVICES.map((d) => (
                  <div key={d.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1 gap-2">
                      <span className="text-[var(--muted)]">{d.label}</span>
                      <span className="text-[var(--foreground)] tabular-nums shrink-0">{d.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--background)] overflow-hidden">
                      <div
                        className="h-full rounded-full app-gradient-bg"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
                <p className="text-xs font-semibold text-[var(--muted)] mb-3">Recent Activity</p>
                <ul className="space-y-2">
                  {ACTIVITY.map((a) => (
                    <li key={a.time} className="text-xs break-words">
                      <span className="text-[var(--primary)] tabular-nums">{a.time}</span>
                      <span className="text-[var(--muted)] ml-2">{a.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
