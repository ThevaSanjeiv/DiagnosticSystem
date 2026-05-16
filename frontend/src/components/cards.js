export function renderHeroCard({ name, subtitle }) {
  return `
    <section class="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
      <div class="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div class="space-y-4">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Welcome back</p>
          <h2 class="text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">${name}, your AI care cockpit is ready.</h2>
          <p class="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">${subtitle} Review recent diagnoses, start new analyses, and keep a proactive care workflow in one polished space.</p>
          <div class="flex flex-wrap gap-3 pt-3">
            <a href="#/history" class="btn-primary inline-flex items-center justify-center rounded-3xl px-5 py-3 font-semibold text-white shadow-btn">Review reports</a>
            <a href="#/profile" class="inline-flex items-center justify-center rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">View profile</a>
          </div>
        </div>
        <div class="rounded-[2rem] bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-8 shadow-glow backdrop-blur-xl dark:from-primary/20 dark:via-slate-900 dark:to-secondary/20">
          <div class="flex items-center justify-between rounded-[1.75rem] bg-white/80 p-5 shadow-soft dark:bg-slate-900/90">
            <div>
              <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Health AI</p>
              <h3 class="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Patient insights</h3>
            </div>
            <div class="rounded-3xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
              <span class="text-2xl">💡</span>
            </div>
          </div>
          <div class="mt-6 space-y-4">
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/80">
              <p class="text-sm text-slate-500 dark:text-slate-400">Average confidence</p>
              <p class="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">91.6%</p>
            </div>
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/80">
              <p class="text-sm text-slate-500 dark:text-slate-400">Pending analyses</p>
              <p class="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">8</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderFeatureCards() {
  const cards = [
    {
      title: 'Diabetes Prediction',
      description: 'Assess blood markers and risk with high confidence AI insights.',
      path: '#/diabetes',
      icon: '❤️',
    },
    {
      title: 'CKD Diagnosis',
      description: 'Evaluate kidney health and receive actionable diagnosis guidance.',
      path: '#/ckd',
      icon: '🩺',
    },
    {
      title: 'X-ray Analysis',
      description: 'Scan imagery with intelligent detection for faster review.',
      path: '#/xray',
      icon: '🩻',
    },
  ];

  return `
    <section class="mx-auto mt-8 max-w-7xl space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Quick actions</p>
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Start a new diagnostic workflow</h2>
        </div>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        ${cards
          .map(
            (card) => `
            <a href="${card.path}" class="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-glow dark:border-slate-700 dark:bg-slate-950/80">
              <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-secondary/15 text-2xl shadow-sm text-primary transition group-hover:scale-105">
                ${card.icon}
              </div>
              <h3 class="mt-6 text-xl font-semibold text-slate-900 dark:text-white">${card.title}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">${card.description}</p>
              <div class="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-primary transition group-hover:bg-primary/10 dark:bg-slate-800 dark:text-primary">
                Start Analysis
                <span>→</span>
              </div>
            </a>
          `
          )
          .join('')}
      </div>
    </section>
  `;
}

export function renderStatsSection(stats) {
  const cards = [
    { label: 'Total reports', value: stats.totalReports },
    { label: 'Analyses completed', value: stats.completedAnalyses },
    { label: 'Last diagnosis', value: stats.lastDiagnosis },
  ];
  return `
    <section class="mx-auto mt-10 max-w-7xl space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Performance</p>
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Clinical overview</h2>
        </div>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        ${cards
          .map(
            (item) => `
            <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow dark:border-slate-700 dark:bg-slate-950/80">
              <p class="text-sm text-slate-500 dark:text-slate-400">${item.label}</p>
              <p class="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">${item.value}</p>
            </div>
          `
          )
          .join('')}
      </div>
    </section>
  `;
}

export function renderActivitySection(recentActivity) {
  return `
    <section class="mx-auto mt-10 max-w-7xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Recent activity</p>
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Latest clinical actions</h2>
        </div>
        <div class="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          Auto-synced from health records
        </div>
      </div>
      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        ${recentActivity
          .map(
            (item) => `
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/80">
              <p class="text-base font-semibold text-slate-900 dark:text-white">${item.title}</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">${item.detail}</p>
              <p class="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">${item.time}</p>
            </div>
          `
          )
          .join('')}
      </div>
    </section>
  `;
}

export function renderQuickActions() {
  const actions = [
    { label: 'Upload new report', description: 'Add imaging or lab files to begin analysis.', icon: '📤' },
    { label: 'Review flagged cases', description: 'Inspect urgent pathology and follow-up actions.', icon: '🚨' },
    { label: 'Team notes', description: 'Share insights with care coordinators and specialists.', icon: '🧠' },
  ];

  return `
    <section class="mx-auto mt-10 max-w-7xl space-y-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Quick actions</p>
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Take the next step</h2>
        </div>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        ${actions
          .map(
            (action) => `
            <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow dark:border-slate-700 dark:bg-slate-950/80">
              <div class="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-2xl text-primary">${action.icon}</div>
              <h3 class="mt-5 text-lg font-semibold text-slate-900 dark:text-white">${action.label}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">${action.description}</p>
            </div>
          `
          )
          .join('')}
      </div>
    </section>
  `;
}
