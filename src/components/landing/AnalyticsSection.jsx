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
    <SectionShell id="analytics" className="py-16 sm:py-24">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--foreground)] text-center mb-4">
          Understand Your Audience
        </h2>
        <p className="text-center text-[var(--muted)] max-w-2xl mx-auto mb-12">
          Illustrative dashboard — your Creator Studio shows real app views and payable stats.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6 overflow-hidden">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Views', value: '2,418' },
              { label: 'Unique Views', value: '1,204' },
              { label: 'Watch Time', value: '48h 12m' },
              { label: 'Completion Rate', value: '62%' },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{card.label}</p>
                <p className="mt-2 text-xl font-bold text-[var(--foreground)] tabular-nums">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold text-[var(--muted)] mb-4">Views Over Time</p>
              <div className="flex items-end gap-1.5 h-32" role="img" aria-label="Sample views chart">
                {CHART.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--primary)]/30 to-[var(--primary)]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)] mb-3">Device Distribution</p>
                {DEVICES.map((d) => (
                  <div key={d.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--muted)]">{d.label}</span>
                      <span className="text-[var(--foreground)] tabular-nums">{d.pct}%</span>
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

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)] mb-3">Recent Activity</p>
                <ul className="space-y-2">
                  {ACTIVITY.map((a) => (
                    <li key={a.time} className="text-xs">
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
