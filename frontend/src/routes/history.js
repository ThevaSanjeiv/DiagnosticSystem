import { renderReportCard } from '../components/reportCard.js';
import { showToast } from '../components/toast.js';

export function renderHistoryPage(reports) {
  return `
    <section class="mx-auto max-w-7xl space-y-8">
      <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">History</p>
            <h1 class="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Diagnostic reports</h1>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <input id="searchInput" type="search" placeholder="Search reports" class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100" />
            <select id="filterInput" class="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
              <option value="all">All conditions</option>
              <option value="Diabetes">Diabetes</option>
              <option value="CKD">CKD</option>
              <option value="X-ray">X-ray</option>
            </select>
            <select id="sortInput" class="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
      </div>

      <div id="reportGrid" class="grid gap-5">
        ${reports.map((report) => renderReportCard(report)).join('')}
      </div>
    </section>
  `;
}

export function initHistoryActions(reports) {
  const searchInput = document.getElementById('searchInput');
  const filterInput = document.getElementById('filterInput');
  const sortInput = document.getElementById('sortInput');
  const reportGrid = document.getElementById('reportGrid');
  let reportClickHandlerInstalled = false;

  const updateGrid = () => {
    const query = searchInput.value.toLowerCase();
    const filter = filterInput.value;
    const sort = sortInput.value;

    const filtered = reports
      .filter((report) => {
        const matchesQuery = [report.disease, report.result, report.file, report.id].some((value) => value.toLowerCase().includes(query));
        const matchesFilter = filter === 'all' || report.disease === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        if (sort === 'latest') return new Date(b.date) - new Date(a.date);
        return new Date(a.date) - new Date(b.date);
      });

    if (reportGrid) {
      reportGrid.innerHTML = filtered.length
        ? filtered.map((report) => renderReportCard(report)).join('')
        : `
          <div class="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-14 text-center dark:border-slate-700 dark:bg-slate-900/80">
            <p class="text-sm uppercase tracking-[0.32em] text-slate-400">No reports found</p>
            <h3 class="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">Your report history looks clear.</h3>
            <p class="mt-3 max-w-xl mx-auto text-sm leading-7 text-slate-600 dark:text-slate-400">Try adjusting the search or filter options. New analysis results will appear here after processing.</p>
          </div>
        `;
      attachReportActions();
    }
  };

  const attachReportActions = () => {
    if (reportGrid && !reportClickHandlerInstalled) {
      reportGrid.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (button) {
          showToast('Report tools are placeholders.');
        }
      });
      reportClickHandlerInstalled = true;
    }
  };

  if (searchInput) searchInput.addEventListener('input', updateGrid);
  if (filterInput) filterInput.addEventListener('change', updateGrid);
  if (sortInput) sortInput.addEventListener('change', updateGrid);
  updateGrid();
}
