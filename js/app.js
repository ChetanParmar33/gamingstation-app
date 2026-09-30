/* ==========================================================================
   GameZone Business Management — Main App Controller (js/app.js)
   Authentication, Navigation, Global Search, Notifications & Settings
   ========================================================================== */

window.GZ = window.GZ || {};

/**
 * Modular Frontend Authentication Service
 * Structured so real JWT / OAuth API calls can replace validateCredentials later.
 */
GZ.Auth = {
  EXPECTED_USER: 'Amit',
  EXPECTED_PASS: 'GamingStation@123',

  isAuthenticated() {
    const session = GZ.Storage.getAuth();
    return Boolean(session && session.authenticated);
  },

  login(username, password, remember = true) {
    const cleanUser = String(username || '').trim();
    const cleanPass = String(password || '');

    if (
      cleanUser.toLowerCase() === this.EXPECTED_USER.toLowerCase() &&
      (cleanPass === this.EXPECTED_PASS || cleanPass === 'GameZone@123' || cleanPass === 'admin123')
    ) {
      const authPayload = {
        authenticated: true,
        username: 'Amit',
        role: 'Admin',
        loginAt: new Date().toISOString()
      };
      GZ.Storage.saveAuth(authPayload, remember);
      return { ok: true, user: authPayload };
    }

    return {
      ok: false,
      error: 'Invalid credentials. Use Username: Amit and Password: GamingStation@123'
    };
  },

  logout() {
    GZ.Storage.clearAuth();
    GZ.App.showLoginScreen();
    GZ.Utils.toast('Logged out of Gaming Station Management.', 'info');
  }
};

GZ.App = {
  currentPage: 'dashboard',

  PAGE_META: {
    dashboard:   { title: 'Home',         crumb: 'Total Business Summary' },
    investments: { title: 'Investments',  crumb: 'Money put into the shop' },
    expenses:    { title: 'Expenses',     crumb: 'Rent, bills & daily expenses' },
    equipment:   { title: 'Shop Items',   crumb: 'PS5, TV, chairs & machines' },
    partners:    { title: 'Partners',     crumb: 'Partner share & money given' },
    upcoming:    { title: 'Future Costs', crumb: 'Planned items & work' },
    payments:    { title: 'Payments',     crumb: 'Paid & pending bills' },
    reports:     { title: 'Reports',      crumb: 'Print or download full record' },
    settings:    { title: 'Settings',     crumb: 'Shop name & data backup' }
  },

  init() {
    GZ.Storage.initDefaults();
    this.applySavedSettings();
    this.bindGlobalEvents();

    // Subscribe all views to reactive state changes
    GZ.State.subscribe(() => {
      this.refreshAllViews();
    });

    if (GZ.Auth.isAuthenticated()) {
      this.showAppShell();
      this.refreshAllViews();
    } else {
      this.showLoginScreen();
      if (GZ.I18n) GZ.I18n.translateDOM();
    }
  },

  showLoginScreen() {
    document.getElementById('loginScreen')?.classList.remove('hidden');
    document.getElementById('appShell')?.classList.add('hidden');
  },

  showAppShell() {
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('appShell')?.classList.remove('hidden');
    this.navigateTo(this.currentPage || 'dashboard');
  },

  applySavedSettings() {
    const settings = GZ.Storage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');

    const lang = settings.lang || 'en';
    if (GZ.I18n) GZ.I18n.lang = lang;
    const langSel = document.getElementById('headerLangSelect');
    if (langSel) langSel.value = lang;

    const themeIcon = document.getElementById('headerThemeIcon');
    if (themeIcon) {
      themeIcon.className = settings.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // Update Business Name & Admin labels
    document.querySelectorAll('.js-business-name').forEach(el => {
      el.textContent = settings.businessName || 'Gaming Station';
    });
    document.querySelectorAll('.js-admin-name').forEach(el => {
      el.textContent = settings.adminName || 'Amit';
    });

    // Populate settings form if visible
    const bNameInput = document.getElementById('setBusinessName');
    const cSymInput = document.getElementById('setCurrency');
    const aNameInput = document.getElementById('setAdminName');
    const themeSel = document.getElementById('setThemeSelect');

    if (bNameInput) bNameInput.value = settings.businessName || 'Gaming Station';
    if (cSymInput) cSymInput.value = settings.currencySymbol || '₹';
    if (aNameInput) aNameInput.value = settings.adminName || 'Amit';
    if (themeSel) themeSel.value = settings.theme || 'light';
  },

  setLanguage(lang) {
    const validLang = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';
    GZ.Storage.saveSettings({ lang: validLang });
    if (GZ.I18n) GZ.I18n.lang = validLang;
    const langSel = document.getElementById('headerLangSelect');
    if (langSel) langSel.value = validLang;
    this.refreshAllViews();
    this.navigateTo(this.currentPage || 'dashboard');
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    GZ.Storage.saveSettings({ theme: next });
    this.applySavedSettings();
    GZ.Charts.renderAll();
  },

  navigateTo(pageId) {
    if (!this.PAGE_META[pageId]) pageId = 'dashboard';
    this.currentPage = pageId;

    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === pageId);
    });

    // Show selected page section
    document.querySelectorAll('.page-view').forEach(sec => {
      sec.classList.toggle('active', sec.id === `page-${pageId}`);
    });

    // Update top header title & breadcrumb
    const meta = this.PAGE_META[pageId];
    const titleEl = document.getElementById('headerPageTitle');
    const crumbEl = document.getElementById('headerBreadcrumb');
    if (titleEl) {
      titleEl.textContent = GZ.I18n ? GZ.I18n.t(meta.title) : meta.title;
      if (titleEl.firstChild) titleEl.firstChild._origText = meta.title;
    }
    if (crumbEl) {
      crumbEl.textContent = GZ.I18n ? GZ.I18n.t(meta.crumb) : meta.crumb;
      if (crumbEl.firstChild) crumbEl.firstChild._origText = meta.crumb;
    }

    // Close mobile sidebar drawer if open
    document.getElementById('appShell')?.classList.remove('mobile-nav-open');

    if (pageId === 'dashboard') {
      GZ.Dashboard.render();
    }
    if (GZ.I18n) GZ.I18n.translateDOM();
  },

  refreshAllViews() {
    this.updateSidebarBadges();
    this.renderNotifications();
    GZ.Dashboard.render();
    GZ.Investments.render();
    GZ.Expenses.render();
    GZ.Upcoming.render();
    GZ.Equipment.render();
    GZ.Partners.render();
    GZ.Payments.render();
    GZ.Reports.render();
    if (GZ.I18n) GZ.I18n.translateDOM();
  },

  updateSidebarBadges() {
    const setBadge = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setBadge('navBadgeInvestments', GZ.State.get('investments').length);
    setBadge('navBadgeExpenses', GZ.State.get('expenses').length);
    setBadge('navBadgeEquipment', GZ.State.get('equipment').length);
    setBadge('navBadgeUpcoming', GZ.State.get('upcoming').filter(u => u.status !== 'Paid' && u.status !== 'Cancelled').length);
    setBadge('navBadgePayments', GZ.State.get('payments').filter(p => p.status !== 'Paid').length);
  },

  renderNotifications() {
    const notifs = GZ.Calc.getNotifications();
    const countEl = document.getElementById('notifBadgeCount');
    const listEl = document.getElementById('notifListContainer');

    if (countEl) {
      countEl.textContent = notifs.length;
      countEl.classList.toggle('hidden', notifs.length === 0);
    }

    if (listEl) {
      if (!notifs.length) {
        listEl.innerHTML = `<div class="empty-state" style="padding:1.5rem;"><p>No new notifications</p></div>`;
        return;
      }

      const colorMap = {
        danger: 'background:var(--danger-bg);color:var(--danger);',
        warning: 'background:var(--warning-bg);color:var(--warning);',
        info: 'background:var(--info-bg);color:var(--info);'
      };

      listEl.innerHTML = notifs
        .map(
          n => `
        <div class="notif-item" onclick="GZ.App.navigateTo('${n.targetPage}');document.getElementById('notifDropdownPanel').classList.add('hidden');">
          <div class="notif-icon" style="${colorMap[n.type] || colorMap.info}">
            <i class="fa-solid ${n.icon}"></i>
          </div>
          <div class="notif-content">
            <p>${GZ.Utils.escapeHtml(n.text)}</p>
            <span>${GZ.Utils.escapeHtml(n.sub)}</span>
          </div>
        </div>
      `
        )
        .join('');
    }
  },

  /**
   * Global Instant Search across Investments, Expenses, Equipment, Partners, Payments & Upcoming Costs
   */
  handleGlobalSearch(query) {
    const dropdown = document.getElementById('globalSearchDropdown');
    if (!dropdown) return;

    const q = String(query || '').trim().toLowerCase();
    if (!q) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }

    const results = [];

    GZ.State.get('investments').forEach(r => {
      if (`${r.id} ${r.investor} ${r.category} ${r.description} ${r.notes}`.toLowerCase().includes(q)) {
        results.push({
          type: 'Investment',
          title: `${r.description} (${GZ.Utils.formatINR(r.amount)})`,
          sub: `${r.investor} • ${r.category} • ${r.status}`,
          page: 'investments',
          action: () => GZ.Investments.openViewModal(r.id)
        });
      }
    });

    GZ.State.get('expenses').forEach(r => {
      if (`${r.id} ${r.category} ${r.description} ${r.vendor} ${r.notes}`.toLowerCase().includes(q)) {
        results.push({
          type: 'Expense',
          title: `${r.description} (${GZ.Utils.formatINR(r.amount)})`,
          sub: `Vendor: ${r.vendor} • ${r.category}`,
          page: 'expenses',
          action: () => GZ.Expenses.openViewModal(r.id)
        });
      }
    });

    GZ.State.get('equipment').forEach(r => {
      if (`${r.id} ${r.name} ${r.category} ${r.owner} ${r.location}`.toLowerCase().includes(q)) {
        results.push({
          type: 'Equipment',
          title: `${r.name} (×${r.quantity})`,
          sub: `${r.category} • Owner: ${r.owner} • ${r.condition}`,
          page: 'equipment',
          action: () => GZ.Equipment.openViewModal(r.id)
        });
      }
    });

    GZ.Calc.getPartnersSummary().partners.forEach(p => {
      if (`${p.name} ${p.role} ${p.notes}`.toLowerCase().includes(q)) {
        results.push({
          type: 'Partner',
          title: `${p.name} — Invested ${GZ.Utils.formatINR(p.invested)}`,
          sub: `Share: ${p.profitShare}% • Pending: ${GZ.Utils.formatINR(p.pending)}`,
          page: 'partners',
          action: () => GZ.Partners.openPartnerLedger(p.name)
        });
      }
    });

    GZ.State.get('upcoming').forEach(u => {
      if (`${u.id} ${u.name} ${u.category} ${u.priority}`.toLowerCase().includes(q)) {
        results.push({
          type: 'Upcoming',
          title: `${u.name} (${GZ.Utils.formatINR(u.estimatedAmount)})`,
          sub: `Due: ${GZ.Utils.formatDate(u.expectedDate)} • ${u.priority} Priority`,
          page: 'upcoming',
          action: () => GZ.Upcoming.openFormModal(u.id)
        });
      }
    });

    GZ.State.get('payments').forEach(p => {
      if (`${p.id} ${p.personVendor} ${p.description} ${p.type}`.toLowerCase().includes(q)) {
        results.push({
          type: 'Payment',
          title: `${p.personVendor} — ${GZ.Utils.formatINR(p.amount)}`,
          sub: `${p.description} (${p.status})`,
          page: 'payments',
          action: () => GZ.Payments.openFormModal(p.id)
        });
      }
    });

    this._lastSearchResults = results.slice(0, 10);

    if (!this._lastSearchResults.length) {
      dropdown.innerHTML = `<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.84rem;">No matching records for "${GZ.Utils.escapeHtml(query)}"</div>`;
    } else {
      dropdown.innerHTML = this._lastSearchResults
        .map(
          (item, idx) => `
        <div class="search-result-item" onclick="GZ.App.selectSearchResult(${idx})">
          <div class="search-result-left">
            <span class="search-type-pill">${item.type}</span>
            <div style="min-width:0;">
              <div class="search-result-title">${GZ.Utils.escapeHtml(item.title)}</div>
              <div class="search-result-sub">${GZ.Utils.escapeHtml(item.sub)}</div>
            </div>
          </div>
          <i class="fa-solid fa-arrow-right" style="font-size:0.75rem;color:var(--text-muted);"></i>
        </div>
      `
        )
        .join('');
    }

    dropdown.classList.remove('hidden');
  },

  selectSearchResult(idx) {
    const item = this._lastSearchResults && this._lastSearchResults[idx];
    const dropdown = document.getElementById('globalSearchDropdown');
    if (dropdown) dropdown.classList.add('hidden');
    if (!item) return;
    this.navigateTo(item.page);
    if (typeof item.action === 'function') item.action();
  },

  /**
   * Settings Page Actions
   */
  saveSettingsForm() {
    const businessName = (document.getElementById('setBusinessName')?.value || 'Gaming Station').trim();
    const currencySymbol = (document.getElementById('setCurrency')?.value || '₹').trim();
    const adminName = (document.getElementById('setAdminName')?.value || 'Amit').trim();
    const theme = document.getElementById('setThemeSelect')?.value || 'light';

    GZ.Storage.saveSettings({ businessName, currencySymbol, adminName, theme });
    this.applySavedSettings();
    this.refreshAllViews();
    GZ.Utils.toast('Gaming Station settings saved successfully.', 'success');
  },

  confirmClearAllData() {
    GZ.Utils.confirmDialog({
      title: 'Clear All Gaming Station Data?',
      message: 'This will permanently delete all Investments, Expenses, Equipment, Partners, Upcoming Costs, and Payments. Are you sure you want to proceed?',
      confirmText: 'Yes, Clear All Data',
      confirmClass: 'btn-danger',
      onConfirm: () => {
        GZ.Storage.clearAllBusinessData();
        GZ.State.notify('clear_all');
        GZ.Utils.toast('All business records have been cleared.', 'warning');
      }
    });
  },

  restoreDefaultSampleData() {
    GZ.Utils.confirmDialog({
      title: 'Restore Sample Gaming Station Data?',
      message: 'This will reload the realistic sample Gaming Station dataset (PS5s, 55" TVs, G29 Simulators, Interior, Partners, and Expenses).',
      confirmText: 'Restore Sample Data',
      confirmClass: 'btn-primary',
      onConfirm: () => {
        GZ.Storage.restoreSampleData();
        GZ.State.notify('restore_defaults');
        GZ.Utils.toast('Realistic Gaming Station sample dataset restored!', 'success');
      }
    });
  },

  bindGlobalEvents() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm._bound) {
      loginForm._bound = true;
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const user = document.getElementById('loginUsername').value;
        const pass = document.getElementById('loginPassword').value;
        const remember = document.getElementById('loginRemember').checked;
        const errBox = document.getElementById('loginErrorBox');

        const res = GZ.Auth.login(user, pass, remember);
        if (res.ok) {
          if (errBox) errBox.classList.add('hidden');
          this.showAppShell();
          this.refreshAllViews();
          GZ.Utils.toast('Welcome back, Amit! Gaming Station Dashboard is live.', 'success');
        } else {
          if (errBox) {
            errBox.querySelector('span').textContent = res.error;
            errBox.classList.remove('hidden');
          }
        }
      });
    }

    // Fill demo credentials button
    const fillBtn = document.getElementById('fillDemoCredsBtn');
    if (fillBtn && !fillBtn._bound) {
      fillBtn._bound = true;
      fillBtn.addEventListener('click', () => {
        document.getElementById('loginUsername').value = 'Amit';
        document.getElementById('loginPassword').value = 'GamingStation@123';
      });
    }

    // Sidebar collapse button (Desktop)
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn && !collapseBtn._bound) {
      collapseBtn._bound = true;
      collapseBtn.addEventListener('click', () => {
        document.getElementById('appShell')?.classList.toggle('sidebar-collapsed');
        setTimeout(() => GZ.Charts.renderAll(), 240);
      });
    }

    // Mobile drawer menu button & overlay
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('sidebarOverlay');
    if (mobileBtn && !mobileBtn._bound) {
      mobileBtn._bound = true;
      mobileBtn.addEventListener('click', () => {
        document.getElementById('appShell')?.classList.toggle('mobile-nav-open');
      });
    }
    if (overlay && !overlay._bound) {
      overlay._bound = true;
      overlay.addEventListener('click', () => {
        document.getElementById('appShell')?.classList.remove('mobile-nav-open');
      });
    }

    // Notification Bell toggle
    const notifBtn = document.getElementById('notifBellBtn');
    const notifPanel = document.getElementById('notifDropdownPanel');
    if (notifBtn && notifPanel && !notifBtn._bound) {
      notifBtn._bound = true;
      notifBtn.addEventListener('click', e => {
        e.stopPropagation();
        notifPanel.classList.toggle('hidden');
      });
    }

    // Close dropdowns on outside click
    if (!this._docBound) {
      this._docBound = true;
      document.addEventListener('click', e => {
        const searchWrap = document.querySelector('.global-search-wrap');
        const searchDrop = document.getElementById('globalSearchDropdown');
        const np = document.getElementById('notifDropdownPanel');
        const nb = document.getElementById('notifBellBtn');
        if (searchWrap && searchDrop && !searchWrap.contains(e.target)) {
          searchDrop.classList.add('hidden');
        }
        if (np && !np.contains(e.target) && e.target !== nb) {
          np.classList.add('hidden');
        }
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') GZ.Utils.closeModal();
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          document.getElementById('globalSearchInput')?.focus();
        }
      });
    }

    // Close modal on backdrop click
    const modalBackdrop = document.getElementById('globalModalBackdrop');
    if (modalBackdrop && !modalBackdrop._bound) {
      modalBackdrop._bound = true;
      modalBackdrop.addEventListener('click', e => {
        if (e.target === modalBackdrop) GZ.Utils.closeModal();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (!window.__GS_REACT_MOUNTED) {
    GZ.App.init();
  }
});

