const formDefinitions = {
  'Diabetes Prediction': {
    title: 'Diabetes Prediction',
    subtitle: 'Submit clinical glucose and biomarker values for AI scoring.',
    fields: [
      { name: 'pregnancies', label: 'Pregnancies', type: 'number', placeholder: '0' },
      { name: 'glucose', label: 'Glucose', type: 'number', placeholder: '120' },
      { name: 'bloodpressure', label: 'Blood Pressure', type: 'number', placeholder: '72' },
      { name: 'skinthickness', label: 'Skin Thickness', type: 'number', placeholder: '20' },
      { name: 'insulin', label: 'Insulin', type: 'number', placeholder: '80' },
      { name: 'bmi', label: 'BMI', type: 'number', placeholder: '28.5', step: '0.1' },
      { name: 'dpf', label: 'Diabetes Pedigree Function', type: 'number', placeholder: '0.55', step: '0.01' },
      { name: 'age', label: 'Age', type: 'number', placeholder: '34' },
    ],
  },
  'CKD Diagnosis': {
    title: 'CKD Diagnosis',
    subtitle: 'Provide renal panel values so the AI can evaluate kidney function.',
    fields: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '52' },
      { name: 'bp', label: 'Blood Pressure', type: 'number', placeholder: '85' },
      { name: 'sg', label: 'Specific Gravity', type: 'number', placeholder: '1.02', step: '0.01' },
      { name: 'al', label: 'Albumin', type: 'number', placeholder: '1' },
      { name: 'su', label: 'Sugar', type: 'number', placeholder: '0' },
      { name: 'rbc', label: 'RBC Scale', type: 'number', placeholder: '1', step: '1' },
      { name: 'pc', label: 'Pus Cell Scale', type: 'number', placeholder: '1', step: '1' },
      { name: 'pcc', label: 'Pus Cell Clumps', type: 'number', placeholder: '0', step: '1' },
      { name: 'ba', label: 'Bacteria Level', type: 'number', placeholder: '0', step: '1' },
      { name: 'bu', label: 'Blood Urea', type: 'number', placeholder: '42' },
      { name: 'sc', label: 'Serum Creatinine', type: 'number', placeholder: '1.1', step: '0.01' },
    ],
  },
  'X-ray Analysis': {
    title: 'X-ray Analysis',
    subtitle: 'Upload a chest X-ray image and receive fast pneumonia detection.',
  },
};

function buildFieldInput(field) {
  return `
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="${field.name}">${field.label}</label>
      <input
        id="${field.name}"
        name="${field.name}"
        type="${field.type}"
        step="${field.step || 'any'}"
        placeholder="${field.placeholder}"
        class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
      />
    </div>
  `;
}

export function renderAnalysisPage(type) {
  const config = formDefinitions[type] || formDefinitions['Diabetes Prediction'];
  const fieldsHtml = config.fields
    ? config.fields.map((field) => buildFieldInput(field)).join('')
    : '';

  return `
    <section class="mx-auto max-w-7xl space-y-8">
      <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/80">
        <div class="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div class="space-y-5">
            <p class="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">${config.title}</p>
            <h1 class="text-3xl font-semibold text-slate-900 dark:text-white">${config.title} workspace</h1>
            <p class="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">${config.subtitle}</p>
            <div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/80">
              <form id="analysisForm" class="space-y-6">
                ${fieldsHtml}
                ${type === 'X-ray Analysis' ? `
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="fileUpload">Upload X-ray image</label>
                    <input id="fileUpload" name="file" type="file" accept="image/*" class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100" />
                  </div>
                ` : ''}
                <div class="flex flex-wrap gap-3 pt-2">
                  <button id="startAnalysisBtn" type="submit" class="btn-primary inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold text-white shadow-btn transition hover:opacity-95">Run analysis</button>
                  <a href="#/history" class="inline-flex items-center justify-center rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">View history</a>
                </div>
              </form>
              <div id="analysisStatus" class="mt-6 rounded-3xl bg-white/90 p-5 text-slate-700 shadow-sm dark:bg-slate-950/80 dark:text-slate-200"></div>
            </div>
          </div>
          <div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900/80">
            <div class="flex items-center gap-4 rounded-3xl bg-white/90 p-5 shadow-sm dark:bg-slate-950/80">
              <div class="h-14 w-14 rounded-3xl bg-primary/15 text-2xl text-primary flex items-center justify-center">🧬</div>
              <div>
                <p class="text-sm text-slate-500 dark:text-slate-400">Backend connection</p>
                <p class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Live API submission</p>
              </div>
            </div>
            <div class="mt-6 space-y-4">
              <div class="rounded-3xl bg-white/90 p-5 text-slate-700 shadow-sm dark:bg-slate-950/80 dark:text-slate-200">
                <p class="text-sm text-slate-500 dark:text-slate-400">Responsive workflow</p>
                <p class="mt-2 text-base font-semibold">Results are submitted directly to your Django backend endpoint.</p>
              </div>
              <div class="rounded-3xl bg-white/90 p-5 text-slate-700 shadow-sm dark:bg-slate-950/80 dark:text-slate-200">
                <p class="text-sm text-slate-500 dark:text-slate-400">Session support</p>
                <p class="mt-2 text-base font-semibold">Cookie-based authentication is preserved when running on localhost.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initAnalysisActions(type, onSubmit) {
  const form = document.getElementById('analysisForm');
  const statusEl = document.getElementById('analysisStatus');
  const submitButton = document.getElementById('startAnalysisBtn');

  if (!form || !statusEl || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Running...';
    statusEl.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400">Submitting data to backend…</p>`;

    try {
      const formData = new FormData(form);
      let payload;

      if (type === 'X-ray Analysis') {
        payload = { file: formData.get('file') };
      } else {
        payload = {};
        formData.forEach((value, key) => {
          payload[key] = value;
        });
      }

      const result = await onSubmit(payload);
      statusEl.innerHTML = `
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">Analysis complete</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${result.prediction || result.result || 'Backend returned a response.'}</p>
      `;
    } catch (error) {
      statusEl.innerHTML = `
        <h3 class="text-base font-semibold text-rose-700">Submission failed</h3>
        <p class="mt-2 text-sm text-rose-600">${error.message || 'Check your backend and session settings.'}</p>
      `;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Run analysis';
    }
  });
}
