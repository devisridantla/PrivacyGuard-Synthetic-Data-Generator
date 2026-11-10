/**
 * PrivacyGuard API Client Service.
 * Connects frontend to the FastAPI backend running on http://localhost:8000.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Backend health check failed:', err);
    return { status: 'offline', error: err.message };
  }
}

export async function generateDataset(payload) {
  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to generate dataset (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function generateWithAI(prompt) {
  const res = await fetch(`${API_BASE_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `AI Generation failed (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function generateCustomColumn(payload) {
  const res = await fetch(`${API_BASE_URL}/api/custom-columns/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Custom column generation failed`);
  }
  return await res.json();
}

export async function validatePrivacy(records) {
  const res = await fetch(`${API_BASE_URL}/api/validate-privacy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records })
  });
  if (!res.ok) throw new Error('Privacy validation failed');
  return await res.json();
}

export async function getQualityReport(records, datasetName) {
  const res = await fetch(`${API_BASE_URL}/api/quality-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records, dataset_name: datasetName })
  });
  if (!res.ok) throw new Error('Quality report evaluation failed');
  return await res.json();
}

export async function validateDataset(records, datasetName) {
  const res = await fetch(`${API_BASE_URL}/api/validate-dataset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records, dataset_name: datasetName })
  });
  if (!res.ok) throw new Error('Dataset validation failed');
  return await res.json();
}

export async function checkDuplicates(records) {
  const res = await fetch(`${API_BASE_URL}/api/check-duplicates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records })
  });
  if (!res.ok) throw new Error('Duplicate check failed');
  return await res.json();
}

export async function downloadExcel(datasetName, records, category = 'Indian Students', datasetId = null) {
  const res = await fetch(`${API_BASE_URL}/api/export/excel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataset_name: datasetName,
      category,
      records,
      dataset_id: datasetId
    })
  });
  if (!res.ok) throw new Error('Excel download failed');
  const blob = await res.blob();
  triggerFileDownload(blob, `${datasetName.replace(/\s+/g, '_')}.xlsx`);
}

export async function downloadCSV(datasetName, records, category = 'Indian Students', datasetId = null) {
  const res = await fetch(`${API_BASE_URL}/api/export/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataset_name: datasetName,
      category,
      records,
      dataset_id: datasetId
    })
  });
  if (!res.ok) throw new Error('CSV download failed');
  const blob = await res.blob();
  triggerFileDownload(blob, `${datasetName.replace(/\s+/g, '_')}.csv`);
}

export async function downloadJSON(datasetName, records, category = 'Indian Students', datasetId = null) {
  const res = await fetch(`${API_BASE_URL}/api/export/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataset_name: datasetName,
      category,
      records,
      dataset_id: datasetId
    })
  });
  if (!res.ok) throw new Error('JSON download failed');
  const blob = await res.blob();
  triggerFileDownload(blob, `${datasetName.replace(/\s+/g, '_')}.json`);
}

export async function getHistory() {
  const res = await fetch(`${API_BASE_URL}/api/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function testSupabaseConnection(supabaseUrl, supabaseKey) {
  const res = await fetch(`${API_BASE_URL}/api/supabase/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supabase_url: supabaseUrl,
      supabase_key: supabaseKey
    })
  });
  return await res.json();
}

function triggerFileDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

