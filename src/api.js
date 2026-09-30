/* ==========================================================================
   Gaming Station — Frontend Node.js Backend API Client (src/api.js)
   Syncs React & GZ.Storage state with Node.js REST API (/api/*)
   ========================================================================== */

const API_BASE = '/api';

export const ApiService = {
  connected: false,
  listeners: [],

  onStatusChange(fn) {
    if (typeof fn === 'function') this.listeners.push(fn);
  },

  setStatus(status) {
    this.connected = status;
    this.listeners.forEach(fn => fn(status));
  },

  async bootstrap() {
    try {
      const res = await fetch(`${API_BASE}/bootstrap`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json && json.ok && json.data && window.GZ && GZ.Storage) {
        const d = json.data;
        ['investments', 'expenses', 'equipment', 'partners', 'upcoming', 'payments'].forEach(col => {
          if (Array.isArray(d[col])) {
            GZ.Storage.saveCollection(col, d[col], true);
          }
        });
        if (d.settings) {
          GZ.Storage.saveSettings(d.settings, true);
        }
        this.setStatus(true);
        if (GZ.App) {
          GZ.App.applySavedSettings();
          GZ.App.refreshAllViews();
        }
        return true;
      }
    } catch (err) {
      this.setStatus(false);
    }
    return false;
  },

  async saveCollection(name, items) {
    try {
      const res = await fetch(`${API_BASE}/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      this.setStatus(res.ok);
    } catch (err) {
      this.setStatus(false);
    }
  },

  async saveSettings(settings) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      this.setStatus(res.ok);
    } catch (err) {
      this.setStatus(false);
    }
  },

  async clearAll() {
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      this.setStatus(res.ok);
    } catch (err) {
      this.setStatus(false);
    }
  },

  async restoreSample() {
    try {
      const res = await fetch(`${API_BASE}/restore-sample`, { method: 'POST' });
      this.setStatus(res.ok);
    } catch (err) {
      this.setStatus(false);
    }
  }
};

window.GZ = window.GZ || {};
window.GZ.Api = ApiService;
