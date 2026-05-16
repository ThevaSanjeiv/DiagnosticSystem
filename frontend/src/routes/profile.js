import { renderProfileOverview } from '../components/profileCard.js';
import { showToast } from '../components/toast.js';

export function renderProfilePage(profile) {
  return `
    <section class="mx-auto max-w-7xl space-y-8">
      <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Profile</p>
            <h1 class="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Your HealthSense account</h1>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            Secure multi-factor access enabled
          </div>
        </div>
      </div>
      ${renderProfileOverview(profile)}
    </section>
  `;
}

export function initProfileActions() {
  const editButton = document.getElementById('editProfileBtn');
  const changeButton = document.getElementById('changePasswordBtn');
  const logoutButton = document.getElementById('profileLogoutBtn');

  if (editButton) {
    editButton.addEventListener('click', () => showToast('Edit profile is a placeholder interface.', 'info'));
  }
  if (changeButton) {
    changeButton.addEventListener('click', () => showToast('Change password flow is a placeholder.', 'info'));
  }
  if (logoutButton) {
    logoutButton.addEventListener('click', () => showToast('Logout is a placeholder action.', 'warning'));
  }
}
