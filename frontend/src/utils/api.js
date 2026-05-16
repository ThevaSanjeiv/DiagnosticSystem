const BACKEND_BASE = 'http://localhost:8000';

async function apiFetch(path, { method = 'GET', body = null, formData = false } = {}) {
  const url = `${BACKEND_BASE}${path}`;
  const headers = {};
  const options = {
    method,
    credentials: 'include',
    headers,
  };

  if (body && !formData) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  if (body && formData) {
    options.body = body;
  }

  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend did not return JSON. Check backend session or URL.');
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Backend request failed');
  }
  return data;
}

function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export async function fetchProfileData() {
  const data = await apiFetch('/api/profile/', { method: 'GET' });
  const profile = data.profile || {};
  const created = profile.created_at || profile.created_at?.toString() || profile.created || 'Unknown';
  const name = profile.first_name || profile.name || 'HealthSense Clinician';
  const avatar = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return {
    name,
    email: profile.email || 'unknown@healthsense.ai',
    created: typeof created === 'string' ? created : formatDate(created),
    summary: profile.summary || 'Clinical user connected to HealthSense AI backend.',
    savedReports: profile.saved_reports || profile.report_count || 0,
    avatar: avatar || 'HS',
  };
}

export async function fetchHistoryReports() {
  const data = await apiFetch('/api/reports/', { method: 'GET' });
  const reports = data.reports || [];
  return reports.map((report) => {
    const date = report.timestamp || report.created_at || report.date || '';
    const fileName = report.input_data?.filename || report.file || `${report.disease_type || report.disease || 'Report'} data`;
    const confidence = report.confidence || report.prediction_confidence || report.confidence_percentage || '';
    const result = report.result || report.prediction || report.prediction_result || 'Review details';

    return {
      id: report._id || `RPT-${Math.floor(Math.random() * 9000) + 1000}`,
      disease: report.disease_type || report.disease || 'Unknown',
      result,
      confidence: confidence || (report.prediction ? 'N/A' : 'N/A'),
      date: formatDate(date),
      file: fileName,
      status: 'Completed',
    };
  });
}

export async function fetchDashboardData() {
  const [profile, reports] = await Promise.all([fetchProfileData(), fetchHistoryReports()]);
  const lastReport = reports[0] || {};
  const recentActivity = reports.slice(0, 3).map((report) => ({
    title: `${report.disease} report completed`,
    detail: report.result,
    time: report.date,
  }));

  return {
    welcome: {
      name: profile.name,
      subtitle: 'AI-driven diagnostics and patient insights for modern care teams.',
    },
    stats: {
      totalReports: reports.length,
      completedAnalyses: reports.length,
      lastDiagnosis: lastReport.result || 'No diagnosis yet',
    },
    recentActivity: recentActivity.length
      ? recentActivity
      : [
          { title: 'No reports yet', detail: 'Run an analysis to populate history.', time: 'Just now' },
        ],
  };
}

export async function runAnalysis(type, payload) {
  let endpoint = '';
  let body = null;
  let formData = false;

  if (type === 'Diabetes Prediction') {
    endpoint = '/core_api/predict/diabetes/';
    body = payload;
  } else if (type === 'CKD Diagnosis') {
    endpoint = '/core_api/predict/ckd/';
    body = payload;
  } else if (type === 'X-ray Analysis') {
    endpoint = '/core_api/predict/pneumonia/';
    formData = true;
    const form = new FormData();
    if (payload.file) form.append('file', payload.file);
    if (payload.user_email) form.append('user_email', payload.user_email);
    body = form;
  } else {
    throw new Error('Unknown analysis type');
  }

  const data = await apiFetch(endpoint, {
    method: 'POST',
    body,
    formData,
  });

  return data;
}

export async function fetchPlaceholderUpdates() {
  return true;
}
