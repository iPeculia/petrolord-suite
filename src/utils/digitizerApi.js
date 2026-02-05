const API_URL = "https://petrolord-pvt-backend-2025-58b5441b2268.herokuapp.com";

export const apiUpload = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const r = await fetch(`${API_URL}/logdigitizer/upload`, { method: 'POST', body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(j.detail || 'Upload failed');
    return j;
};

export const apiSave = async (payload) => {
    const resp = await fetch(`${API_URL}/logdigitizer/save-points`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const j = await resp.json().catch(() => ({ detail: "non-JSON response" }));
    if (!resp.ok) throw new Error(j.detail || 'Save failed');
    return j;
};

export const apiExport = async (sessionId, format) => {
    const r = await fetch(`${API_URL}/logdigitizer/export`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, format: format })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.detail || 'Export failed');
    return `${API_URL}${j.download}`;
};