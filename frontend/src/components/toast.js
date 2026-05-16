const toastRoot = document.getElementById('toast-root');
let toastCounter = 0;

export function showToast(message, type = 'default') {
  if (!toastRoot) return;
  const toastId = `toast-${toastCounter++}`;
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `pointer-events-auto max-w-sm rounded-3xl border px-4 py-3 shadow-soft transition duration-300 ${type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : type === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' : type === 'info' ? 'border-sky-200 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`;
  toast.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <div class="text-sm font-medium">${message}</div>
      <button class="text-slate-500 transition hover:text-slate-700 dark:text-slate-300" aria-label="Dismiss">×</button>
    </div>
  `;

  toastRoot.appendChild(toast);
  toast.querySelector('button')?.addEventListener('click', () => toast.remove());
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}
