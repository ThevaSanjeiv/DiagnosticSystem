export function renderLoader(label = 'Loading...') {
  return `
    <section class="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
      <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.28em] text-slate-400">Loading</p>
            <h2 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">${label}</h2>
          </div>
          <div class="h-12 w-12 rounded-3xl bg-primary/10 p-3 text-primary shadow-soft animate-pulse"></div>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          ${Array.from({ length: 3 }).map(() => `
            <div class="h-40 rounded-3xl bg-slate-100/80 p-5 dark:bg-slate-800"></div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
