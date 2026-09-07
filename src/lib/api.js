/**
 * Central API client for the portfolio backend.
 * Base URL reads from VITE_API_URL env var, falls back to localhost:4000.
 */

const BASE = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? '/api' : 'http://localhost:4000/api');

// Stored in sessionStorage so the admin doesn't have to re-enter password on every page
const getToken = () => sessionStorage.getItem('admin_token') || '';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.auth ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }

  return res.json();
}

// ── Public reads ───────────────────────────────────────────
export const api = {
  projects:    () => apiFetch('/projects'),
  project:     (slug) => apiFetch(`/projects/${slug}`),
  skills:      () => apiFetch('/skills'),
  experience:  () => apiFetch('/journey/experience'),
  services:    () => apiFetch('/journey/services'),
  about:       () => apiFetch('/about'),
  socialLinks: () => apiFetch('/social-links'),

  // ── Admin writes ─────────────────────────────────────────
  admin: {
    // Projects
    createProject:  (data) => apiFetch('/projects',      { method: 'POST', body: JSON.stringify(data), auth: true }),
    updateProject:  (id, data) => apiFetch(`/projects/${id}`, { method: 'PUT',  body: JSON.stringify(data), auth: true }),
    deleteProject:  (id) => apiFetch(`/projects/${id}`,  { method: 'DELETE', auth: true }),

    // Skills
    createSkillCat: (data) => apiFetch('/skills',        { method: 'POST', body: JSON.stringify(data), auth: true }),
    updateSkillCat: (id, data) => apiFetch(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
    deleteSkillCat: (id) => apiFetch(`/skills/${id}`,    { method: 'DELETE', auth: true }),

    // Experience
    createExp:  (data) => apiFetch('/journey/experience', { method: 'POST', body: JSON.stringify(data), auth: true }),
    updateExp:  (id, d) => apiFetch(`/journey/experience/${id}`, { method: 'PUT', body: JSON.stringify(d), auth: true }),
    deleteExp:  (id) => apiFetch(`/journey/experience/${id}`, { method: 'DELETE', auth: true }),

    // Services
    createService: (data) => apiFetch('/journey/services', { method: 'POST', body: JSON.stringify(data), auth: true }),
    updateService: (id, d) => apiFetch(`/journey/services/${id}`, { method: 'PUT', body: JSON.stringify(d), auth: true }),
    deleteService: (id) => apiFetch(`/journey/services/${id}`, { method: 'DELETE', auth: true }),

    // About
    updateAbout: (data) => apiFetch('/about', { method: 'PUT', body: JSON.stringify(data), auth: true }),

    // Social links
    createLink: (data) => apiFetch('/social-links', { method: 'POST', body: JSON.stringify(data), auth: true }),
    updateLink: (id, d) => apiFetch(`/social-links/${id}`, { method: 'PUT', body: JSON.stringify(d), auth: true }),
    deleteLink: (id) => apiFetch(`/social-links/${id}`, { method: 'DELETE', auth: true }),

    // Upload
    uploadImage: async (file) => {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(`${BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json(); // { url, public_id }
    },

    deleteImage: (publicId) => apiFetch(`/upload/${encodeURIComponent(publicId)}`, { method: 'DELETE', auth: true }),
  },
};
