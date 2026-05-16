import { showToast } from './toast.js';

const navLinks = [
  { label: 'Dashboard', path: '#/dashboard' },
  { label: 'History', path: '#/history' },
  { label: 'Profile', path: '#/profile' },
];

export function renderNavbar(currentPath) {
  const activeClasses = (path) =>
    currentPath === path
      ? 'text-primary font-semibold'
      : 'text-slate-600 hover:text-primary transition';

  return `
    <header class="sticky top-0 z-40 border-b border-white/70 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div class="flex items-center gap-3">
          <div class="rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 shadow-soft">
            <div class="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-primary">HS</div>
          </div>
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">HealthSense AI</p>
            <h1 class="text-xl font-semibold text-slate-900 dark:text-white">Clinical intelligence platform</h1>
          </div>
        </div>

        <nav class="hidden items-center justify-center gap-8 md:flex">
          ${navLinks
            .map(
              (link) => `
            <a href="${link.path}" class="text-sm ${activeClasses(link.path)}">${link.label}</a>
          `
            )
            .join('')}
        </nav>

        <div class="flex items-center gap-3">
          <button id="darkToggleBtn" class="relative inline-flex h-10 w-16 items-center rounded-full bg-slate-200 p-1 text-slate-600 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200">
            <span class="absolute left-1 top-1 h-8 w-8 rounded-full bg-white shadow-sm transition toggle-thumb dark:bg-slate-900"></span>
            <span class="sr-only">Toggle theme</span>
          </button>
          <div class="relative">
            <button id="profileMenuBtn" class="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-700 shadow-sm transition hover:scale-[1.03] dark:bg-slate-800 dark:text-slate-100">
              MH
            </button>
            <div id="profileMenu" class="absolute right-0 z-20 mt-3 hidden w-48 rounded-3xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <a href="#/profile" class="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Profile</a>
              <button id="settingsBtn" class="w-full rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Settings</button>
              <button id="logoutBtn" class="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Logout</button>
            </div>
          </div>
          <button id="mobileToggleBtn" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <span class="text-xl">☰</span>
          </button>
        </div>
      </div>

      <div id="mobileNav" class="hidden border-t border-slate-200 bg-white/90 px-4 py-4 dark:border-slate-700 dark:bg-slate-950/90 md:hidden">
        <div class="flex flex-col gap-3">
          ${navLinks
            .map(
              (link) => `
            <a href="${link.path}" class="block rounded-3xl px-4 py-3 text-sm ${activeClasses(link.path)}">${link.label}</a>
          `
            )
            .join('')}
        </div>
      </div>
    </header>
  `;
}

export function setupNavbarListeners() {
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const mobileNav = document.getElementById('mobileNav');
  const profileMenu = document.getElementById('profileMenu');
  const profileButton = document.getElementById('profileMenuBtn');
  const darkToggle = document.getElementById('darkToggleBtn');
  const logoutButton = document.getElementById('logoutBtn');
  const settingsButton = document.getElementById('settingsBtn');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  if (!window.__healthsenseNavbarClickHandler) {
    window.__healthsenseNavbarClickHandler = (event) => {
      const target = event.target;
      if (profileMenu && profileButton && !profileMenu.contains(target) && !profileButton.contains(target)) {
        profileMenu.classList.add('hidden');
      }
    };
    document.addEventListener('click', window.__healthsenseNavbarClickHandler);
  }

  if (profileButton && profileMenu) {
    profileButton.addEventListener('click', () => {
      profileMenu.classList.toggle('hidden');
    });
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      showToast(document.documentElement.classList.contains('dark') ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      showToast('Logout feature is a placeholder in this demo.', 'warning');
    });
  }

  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      showToast('Settings is coming soon.', 'info');
    });
  }
}
