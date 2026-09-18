import { Copy, MoreHorizontal, Upload } from 'lucide-react';

const ROWS = [
  { title: 'Product walkthrough', uploaded: 'Mar 12', size: '842 MB', views: '1.2k', status: 'Ready' },
  { title: 'Team onboarding', uploaded: 'Mar 8', size: '410 MB', views: '384', status: 'Ready' },
  { title: 'Launch teaser', uploaded: 'Mar 2', size: '128 MB', views: '96', status: 'Ready' },
];

export default function DashboardMockup() {
  return (
    <div
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden shadow-[0_32px_80px_-40px_var(--glow-cyan)] w-full max-w-full"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)] truncate">My Videos</p>
          <p className="text-xs text-[var(--muted)]">Creator Studio</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg app-gradient-bg text-white px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold shrink-0">
          <Upload className="w-3.5 h-3.5" />
          Upload
        </div>
      </div>

      {/* Mobile: stacked cards — avoids forced horizontal scroll */}
      <ul className="md:hidden divide-y divide-[var(--border)]">
        {ROWS.map((row) => (
          <li key={row.title} className="flex items-center gap-3 px-3 py-3">
            <div className="w-14 h-9 rounded-md bg-gradient-to-br from-[var(--surface)] to-[var(--surface-elevated)] border border-[var(--border-accent)] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--foreground)] truncate">{row.title}</p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">
                {row.views} views · {row.uploaded}
              </p>
            </div>
            <span className="inline-flex rounded-full border border-[var(--border-green)] bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)] shrink-0">
              {row.status}
            </span>
          </li>
        ))}
      </ul>

      {/* Tablet/desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead>
            <tr className="text-[var(--muted)] border-b border-[var(--border)]">
              <th className="px-4 py-2.5 font-medium">Thumbnail</th>
              <th className="px-3 py-2.5 font-medium">Title</th>
              <th className="px-3 py-2.5 font-medium hidden lg:table-cell">Uploaded</th>
              <th className="px-3 py-2.5 font-medium hidden xl:table-cell">Size</th>
              <th className="px-3 py-2.5 font-medium">Views</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.title} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3">
                  <div className="w-12 h-8 rounded-md bg-gradient-to-br from-[var(--surface)] to-[var(--surface-elevated)] border border-[var(--border-accent)]" />
                </td>
                <td className="px-3 py-3 font-medium text-[var(--foreground)]">{row.title}</td>
                <td className="px-3 py-3 text-[var(--muted)] hidden lg:table-cell">{row.uploaded}</td>
                <td className="px-3 py-3 text-[var(--muted)] hidden xl:table-cell">{row.size}</td>
                <td className="px-3 py-3 text-[var(--foreground)] tabular-nums">{row.views}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex rounded-full border border-[var(--border-green)] bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-[var(--muted)]">
                      <Copy className="w-3 h-3" />
                      Copy Link
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)]">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
