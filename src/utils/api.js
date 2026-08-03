const API_BASE = 'http://localhost:5000/api' || 'https://ca-audit-file-tracker-be.onrender.com/api';

const getToken = () => localStorage.getItem('authToken') || '';

const buildHeaders = (shouldUseJson = true) => {
  const headers = {};
  if (shouldUseJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
};

const authFetch = async (path, options = {}) => {
  const opts = {
    ...options,
    headers: {
      ...buildHeaders(options.body !== undefined),
      ...(options.headers || {})
    }
  };
  return handleResponse(await fetch(`${API_BASE}${path}`, opts));
};

export const loginUser = async (credentials) => {
  return handleResponse(
    await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(credentials)
    })
  );
};

export const registerUser = async (data) => {
  return handleResponse(
    await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(data)
    })
  );
};

export const getMe = async () => authFetch('/auth/me', { method: 'GET' });

export const fetchAuditFiles = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  return authFetch(`/audit-files?${query.toString()}`, {
    method: 'GET'
  });
};

export const fetchAuditFileById = async (id) => {
  return authFetch(`/audit-files/${id}`, {
    method: 'GET'
  });
};

export const createAuditFile = async (data) => {
  return authFetch('/audit-files', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateAuditFile = async (id, data) => {
  return authFetch(`/audit-files/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const returnAuditFiles = async (id, returnData) => {
  return authFetch(`/audit-files/${id}/return`, {
    method: 'POST',
    body: JSON.stringify(returnData)
  });
};

export const deleteAuditFile = async (id) => {
  return authFetch(`/audit-files/${id}`, {
    method: 'DELETE'
  });
};

export const clearAllAuditFiles = async () => {
  return authFetch('/audit-files', {
    method: 'DELETE'
  });
};

export const fetchSummaryStats = async () => {
  return authFetch('/stats', {
    method: 'GET'
  });
};

export const seedAuditRecords = async () => {
  return authFetch('/seed', {
    method: 'POST'
  });
};
