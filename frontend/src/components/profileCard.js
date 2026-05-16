export function renderProfileOverview(profile) {
  return `
    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.2fr]">
      <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
        <div class="flex items-center gap-4">
          <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white">${profile.avatar}</div>
          <div>
            <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Lead clinician</p>
            <h2 class="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">${profile.name}</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">HealthSense AI account</p>
          </div>
        </div>

        <div class="mt-8 space-y-4 rounded-[1.75rem] bg-slate-50 p-6 dark:bg-slate-900/80">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p class="mt-2 text-base font-medium text-slate-900 dark:text-white">${profile.email}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Member since</p>
              <p class="mt-2 text-base font-medium text-slate-900 dark:text-white">${profile.created}</p>
            </div>
          </div>
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Medical history summary</p>
            <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">${profile.summary}</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900/80">
              <p class="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Saved reports</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">${profile.savedReports}</p>
            </div>
            <div class="rounded-3xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900/80">
              <p class="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Active workflow</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">4</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Account actions</p>
            <h3 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Secure your account</h3>
          </div>
        </div>
        <div class="mt-8 grid gap-4">
          <button id="editProfileBtn" class="rounded-3xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-left text-sm font-semibold text-white shadow-btn transition hover:opacity-95">Edit profile settings</button>
          <button id="changePasswordBtn" class="rounded-3xl border border-slate-200 px-5 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Change password</button>
          <button id="profileLogoutBtn" class="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">Logout</button>
        </div>
      </div>
    </section>
  `;
}
