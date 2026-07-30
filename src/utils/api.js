const API_BASE = 'https://ca-audit-file-tracker-be.onrender.com';

export const fetchAuditFiles = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  const res = await fetch(`${API_BASE}/audit-files?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch records');
  return res.json();
};

export const fetchAuditFileById = async (id) => {
  const res = await fetch(`${API_BASE}/audit-files/${id}`);
  if (!res.ok) throw new Error('Failed to fetch record');
  return res.json();
};

export const createAuditFile = async (data) => {
  const res = await fetch(`${API_BASE}/audit-files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create record');
  }
  return res.json();
};

export const updateAuditFile = async (id, data) => {
  const res = await fetch(`${API_BASE}/audit-files/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update record');
  }
  return res.json();
};

export const returnAuditFiles = async (id, returnData) => {
  const res = await fetch(`${API_BASE}/audit-files/${id}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(returnData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to record return');
  }
  return res.json();
};

export const deleteAuditFile = async (id) => {
  const res = await fetch(`${API_BASE}/audit-files/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete record');
  return res.json();
};

export const clearAllAuditFiles = async () => {
  const res = await fetch(`${API_BASE}/audit-files`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear records');
  return res.json();
};

export const fetchSummaryStats = async () => {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const seedAuditRecords = async () => {
  const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed records');
  return res.json();
};
