import { router } from './utils/router.js';
import { fetchDashboardData, fetchHistoryReports, fetchProfileData, runAnalysis } from './utils/api.js';
import { renderNavbar, setupNavbarListeners } from './components/navbar.js';
import { renderLoader } from './components/loader.js';
import { renderDashboardPage } from './routes/dashboard.js';
import { renderHistoryPage, initHistoryActions } from './routes/history.js';
import { renderProfilePage, initProfileActions } from './routes/profile.js';
import { renderAnalysisPage, initAnalysisActions } from './routes/analysis.js';
import { showToast } from './components/toast.js';

const appRoot = document.getElementById('app');

function renderShell(contentHtml) {
  appRoot.innerHTML = `
    <div class="min-h-screen">
      ${renderNavbar(router.currentPath)}
      <main class="page-enter px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        ${contentHtml}
      </main>
    </div>
  `;
  setupNavbarListeners();
}

function renderError(message) {
  return `
    <section class="mx-auto max-w-7xl rounded-[2rem] border border-rose-200 bg-rose-50/80 p-8 text-rose-900 shadow-soft dark:border-rose-500/30 dark:bg-rose-950/80 dark:text-rose-100">
      <h2 class="text-2xl font-semibold">Backend connection issue</h2>
      <p class="mt-4 text-sm leading-7">${message}</p>
      <p class="mt-4 text-sm text-rose-700 dark:text-rose-200">Make sure your Django backend is running at http://localhost:8000 and that you are authenticated if required.</p>
    </section>
  `;
}

async function loadDashboard() {
  renderShell(renderLoader('Loading dashboard...'));
  try {
    const data = await fetchDashboardData();
    renderShell(renderDashboardPage(data));
  } catch (error) {
    showToast(error.message, 'warning');
    renderShell(renderError(error.message));
  }
}

async function loadHistory() {
  renderShell(renderLoader('Loading patient reports...'));
  try {
    const reports = await fetchHistoryReports();
    renderShell(renderHistoryPage(reports));
    initHistoryActions(reports);
  } catch (error) {
    showToast(error.message, 'warning');
    renderShell(renderError(error.message));
  }
}

async function loadProfile() {
  renderShell(renderLoader('Loading profile...'));
  try {
    const profile = await fetchProfileData();
    renderShell(renderProfilePage(profile));
    initProfileActions();
  } catch (error) {
    showToast(error.message, 'warning');
    renderShell(renderError(error.message));
  }
}

async function loadAnalysis(type) {
  renderShell(renderLoader(`Preparing ${type} workspace...`));
  renderShell(renderAnalysisPage(type));
  initAnalysisActions(type, async (payload) => {
    try {
      const response = await runAnalysis(type, payload);
      showToast(response.message || response.prediction || 'Analysis submitted successfully', 'success');
      return response;
    } catch (error) {
      showToast(error.message, 'warning');
      throw error;
    }
  });
}

async function renderHistory(reports) {
  renderShell(renderHistoryPage(reports));
  initHistoryActions(reports);
}

const routes = {
  '#/dashboard': loadDashboard,
  '#/history': loadHistory,
  '#/profile': loadProfile,
  '#/diabetes': () => loadAnalysis('Diabetes Prediction'),
  '#/ckd': () => loadAnalysis('CKD Diagnosis'),
  '#/xray': () => loadAnalysis('X-ray Analysis'),
};

router.init(routes);

window.addEventListener('load', () => {
  document.documentElement.classList.toggle('dark', false);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.documentElement.classList.remove('nav-open');
  }
});
