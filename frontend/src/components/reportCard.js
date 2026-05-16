export function renderReportCard(report) {
  const badgeStyles = {
    Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
    Alert: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
  };

  return `
    <article class="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow dark:border-slate-700 dark:bg-slate-950/80">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="space-y-3">
          <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">${report.disease}</p>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white">${report.result}</h3>
          <div class="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Confidence ${report.confidence}</span>
            <span>•</span>
            <span>${report.date}</span>
            <span>•</span>
            <span>${report.file}</span>
          </div>
        </div>
        <span class="rounded-full px-4 py-2 text-sm font-semibold ${badgeStyles[report.status] || badgeStyles.Completed}">${report.status}</span>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <button class="btn-primary inline-flex rounded-3xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">View report</button>
        <button class="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Download PDF</button>
        <button class="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">Delete</button>
      </div>
    </article>
  `;
}
