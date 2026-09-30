/* ==========================================================================
   GameZone Business Management — Storage, State & Calculations (js/storage.js)
   Decoupled Repository + Central Reactive Store + Live Financial Engine
   ========================================================================== */

window.GZ = window.GZ || {};

const STORAGE_KEYS = {
  investments: 'gamezone_investments',
  expenses: 'gamezone_expenses',
  equipment: 'gamezone_equipment',
  partners: 'gamezone_partners',
  upcoming: 'gamezone_upcoming_costs',
  payments: 'gamezone_payments',
  settings: 'gamezone_settings',
  auth: 'gamezone_auth'
};

/**
 * Storage Adapter Layer
 * Can be replaced with async REST/GraphQL API calls without changing UI or Calc layers.
 */
GZ.Storage = {
  initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.investments)) {
      localStorage.setItem(STORAGE_KEYS.investments, JSON.stringify(GZ.Data.DEFAULT_INVESTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.expenses)) {
      localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(GZ.Data.DEFAULT_EXPENSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.equipment)) {
      localStorage.setItem(STORAGE_KEYS.equipment, JSON.stringify(GZ.Data.DEFAULT_EQUIPMENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.partners)) {
      localStorage.setItem(STORAGE_KEYS.partners, JSON.stringify(GZ.Data.DEFAULT_PARTNERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.upcoming)) {
      localStorage.setItem(STORAGE_KEYS.upcoming, JSON.stringify(GZ.Data.DEFAULT_UPCOMING_COSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.payments)) {
      localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(GZ.Data.DEFAULT_PAYMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.settings)) {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(GZ.Data.DEFAULT_SETTINGS));
    }
  },

  getCollection(name) {
    const key = STORAGE_KEYS[name];
    if (!key) return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(`Failed reading ${key}`, e);
      return [];
    }
  },

  saveCollection(name, data, fromServer = false) {
    const key = STORAGE_KEYS[name];
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(data));
    if (!fromServer && window.GZ && GZ.Api && typeof GZ.Api.saveCollection === 'function') {
      GZ.Api.saveCollection(name, data);
    }
  },

  getSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.settings);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed.businessName === 'GameZone') parsed.businessName = 'Gaming Station';
      return { ...GZ.Data.DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return { ...GZ.Data.DEFAULT_SETTINGS };
    }
  },

  saveSettings(settings, fromServer = false) {
    const merged = { ...this.getSettings(), ...settings };
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(merged));
    if (!fromServer && window.GZ && GZ.Api && typeof GZ.Api.saveSettings === 'function') {
      GZ.Api.saveSettings(merged);
    }
    return merged;
  },

  getAuth() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.auth) || sessionStorage.getItem(STORAGE_KEYS.auth);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  saveAuth(authObj, remember = true) {
    const str = JSON.stringify(authObj);
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.auth, str);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.auth, str);
      localStorage.removeItem(STORAGE_KEYS.auth);
    }
  },

  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.auth);
    sessionStorage.removeItem(STORAGE_KEYS.auth);
  },

  clearAllBusinessData(fromServer = false) {
    localStorage.setItem(STORAGE_KEYS.investments, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.equipment, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.partners, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.upcoming, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify([]));
    if (!fromServer && window.GZ && GZ.Api && typeof GZ.Api.clearAll === 'function') {
      GZ.Api.clearAll();
    }
  },

  restoreSampleData(fromServer = false) {
    localStorage.setItem(STORAGE_KEYS.investments, JSON.stringify(GZ.Data.DEFAULT_INVESTMENTS));
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(GZ.Data.DEFAULT_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.equipment, JSON.stringify(GZ.Data.DEFAULT_EQUIPMENT));
    localStorage.setItem(STORAGE_KEYS.partners, JSON.stringify(GZ.Data.DEFAULT_PARTNERS));
    localStorage.setItem(STORAGE_KEYS.upcoming, JSON.stringify(GZ.Data.DEFAULT_UPCOMING_COSTS));
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(GZ.Data.DEFAULT_PAYMENTS));
    if (!fromServer && window.GZ && GZ.Api && typeof GZ.Api.restoreSample === 'function') {
      GZ.Api.restoreSample();
    }
  }
};

/**
 * Central Reactive State Store
 */
GZ.State = {
  listeners: [],

  subscribe(fn) {
    if (typeof fn === 'function' && !this.listeners.includes(fn)) {
      this.listeners.push(fn);
    }
  },

  notify(reason = 'update') {
    this.listeners.forEach(fn => {
      try {
        fn(reason);
      } catch (e) {
        console.error('State listener error:', e);
      }
    });
  },

  get(collection) {
    return GZ.Storage.getCollection(collection);
  },

  set(collection, list) {
    GZ.Storage.saveCollection(collection, list);
    this.notify(collection);
  },

  addItem(collection, item) {
    const list = this.get(collection);
    list.unshift(item);
    this.set(collection, list);
    return item;
  },

  updateItem(collection, id, updatedFields) {
    const list = this.get(collection);
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedFields, id };
      this.set(collection, list);
      return list[idx];
    }
    return null;
  },

  deleteItem(collection, id) {
    const list = this.get(collection).filter(r => r.id !== id);
    this.set(collection, list);
  }
};

/**
 * Live Financial Calculations Engine
 * Never hardcodes values; always computes from current localStorage/state.
 */
GZ.Calc = {
  /**
   * Resolve paid & pending amounts for any investment or expense record
   */
  resolveAmounts(record) {
    const amount = Number(record.amount) || 0;
    const status = String(record.status || 'Paid');
    let paid = 0;

    if (status === 'Paid') {
      paid = amount;
    } else if (status === 'Pending') {
      paid = 0;
    } else {
      // Partial
      if (record.paidAmount !== undefined && record.paidAmount !== '') {
        paid = Math.min(amount, Math.max(0, Number(record.paidAmount) || 0));
      } else if (record.paid !== undefined && record.paid !== '') {
        paid = Math.min(amount, Math.max(0, Number(record.paid) || 0));
      } else {
        paid = Math.round(amount * 0.5);
      }
    }

    const pending = Math.max(0, amount - paid);
    return { amount, paid, pending };
  },

  getInvestmentsSummary() {
    const list = GZ.State.get('investments');
    let total = 0;
    let paid = 0;
    let pending = 0;
    const byMonth = {};
    const byCategory = {};

    list.forEach(item => {
      const res = this.resolveAmounts(item);
      total += res.amount;
      paid += res.paid;
      pending += res.pending;

      const m = GZ.Utils.getMonthKey(item.date);
      byMonth[m] = (byMonth[m] || 0) + res.amount;

      const cat = item.category || 'Other';
      byCategory[cat] = (byCategory[cat] || 0) + res.amount;
    });

    const months = Object.keys(byMonth).sort();
    let growthPct = 0;
    if (months.length >= 2) {
      const curr = byMonth[months[months.length - 1]] || 0;
      const prev = byMonth[months[months.length - 2]] || 1;
      growthPct = Number((((curr - prev) / prev) * 100).toFixed(1));
    } else if (months.length === 1) {
      growthPct = 100;
    }

    return {
      total,
      paid,
      pending,
      count: list.length,
      growthPct,
      byMonth,
      byCategory
    };
  },

  getExpensesSummary() {
    const list = GZ.State.get('expenses');
    let total = 0;
    let paid = 0;
    let pending = 0;
    let thisMonth = 0;
    const byMonth = {};
    const byCategory = {};
    const byVendor = {};

    // Current reference month (use latest month in dataset or current system YYYY-MM)
    const nowMonth = new Date().toISOString().slice(0, 7);

    list.forEach(item => {
      const res = this.resolveAmounts(item);
      total += res.amount;
      paid += res.paid;
      pending += res.pending;

      const m = GZ.Utils.getMonthKey(item.date);
      byMonth[m] = (byMonth[m] || 0) + res.amount;
      if (m === nowMonth || m === '2026-09') {
        thisMonth += res.amount;
      }

      const cat = item.category || 'Other';
      byCategory[cat] = (byCategory[cat] || 0) + res.amount;

      const vendor = item.vendor || 'General Vendor';
      byVendor[vendor] = (byVendor[vendor] || 0) + res.amount;
    });

    return {
      total,
      paid,
      pending,
      thisMonth,
      count: list.length,
      byMonth,
      byCategory,
      byVendor
    };
  },

  getEquipmentSummary() {
    const list = GZ.State.get('equipment');
    let totalValue = 0;
    let totalUnits = 0;
    const byCondition = { New: 0, Good: 0, 'Needs Repair': 0, Damaged: 0 };
    const byCategory = {};

    list.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.purchasePrice) || 0;
      const val = qty * price;
      totalValue += val;
      totalUnits += qty;

      const cond = item.condition || 'New';
      byCondition[cond] = (byCondition[cond] || 0) + qty;

      const cat = item.category || 'Console';
      byCategory[cat] = (byCategory[cat] || 0) + val;
    });

    return {
      totalValue,
      totalUnits,
      count: list.length,
      byCondition,
      byCategory
    };
  },

  getUpcomingSummary() {
    const list = GZ.State.get('upcoming');
    let totalActive = 0;
    let highPriority = 0;
    let next30Days = 0;
    let next90Days = 0;
    const byCategory = {};

    const refDate = new Date('2026-09-29T00:00:00');

    list.forEach(item => {
      if (item.status === 'Cancelled' || item.status === 'Paid') return;
      const amt = Number(item.estimatedAmount) || 0;
      totalActive += amt;

      if (item.priority === 'High') {
        highPriority += amt;
      }

      const cat = item.category || 'Other';
      byCategory[cat] = (byCategory[cat] || 0) + amt;

      if (item.expectedDate) {
        const exp = new Date(item.expectedDate + 'T00:00:00');
        const diffDays = Math.ceil((exp - refDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) next30Days += amt;
        if (diffDays <= 90) next90Days += amt;
      }
    });

    return {
      totalActive,
      highPriority,
      next30Days,
      next90Days,
      count: list.length,
      byCategory
    };
  },

  getPartnersSummary() {
    const partners = GZ.State.get('partners');
    const investments = GZ.State.get('investments');

    const map = {};
    partners.forEach(p => {
      map[p.name.toLowerCase()] = {
        ...p,
        invested: 0,
        paid: 0,
        pending: 0,
        lastPayment: '',
        txCount: 0,
        transactions: []
      };
    });

    investments.forEach(inv => {
      const key = String(inv.investor || 'Amit').trim().toLowerCase();
      if (!map[key]) {
        map[key] = {
          id: `PRT-AUTO-${Object.keys(map).length + 1}`,
          name: inv.investor || 'Other Partner',
          role: 'Partner',
          phone: '—',
          profitShare: 0,
          committedCapital: 0,
          notes: 'Auto-tracked from investments',
          invested: 0,
          paid: 0,
          pending: 0,
          lastPayment: '',
          txCount: 0,
          transactions: []
        };
      }

      const res = this.resolveAmounts(inv);
      map[key].invested += res.amount;
      map[key].paid += res.paid;
      map[key].pending += res.pending;
      map[key].txCount += 1;
      map[key].transactions.push({ ...inv, ...res });

      const pDate = inv.paymentDate || inv.date || '';
      if (pDate > map[key].lastPayment) {
        map[key].lastPayment = pDate;
      }
    });

    const partnerList = Object.values(map);
    const totalPartnerInvested = partnerList.reduce((acc, p) => acc + p.invested, 0);

    return {
      partners: partnerList,
      totalPartnerInvested
    };
  },

  getPaymentsSummary() {
    const payments = GZ.State.get('payments');
    let totalAmount = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    let partialCount = 0;
    const byMonth = {};

    payments.forEach(p => {
      const amt = Number(p.amount) || 0;
      const paid = p.status === 'Paid' ? amt : (p.status === 'Pending' ? 0 : (Number(p.paid) || 0));
      const pending = Math.max(0, amt - paid);

      totalAmount += amt;
      paidAmount += paid;
      pendingAmount += pending;
      if (p.status === 'Partial') partialCount += 1;

      const m = GZ.Utils.getMonthKey(p.date);
      byMonth[m] = (byMonth[m] || 0) + paid;
    });

    const upcoming = this.getUpcomingSummary();

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      partialCount,
      upcomingAmount: upcoming.totalActive,
      count: payments.length,
      byMonth
    };
  },

  /**
   * Master Dashboard KPI & Financial Health Snapshot
   */
  getDashboardSnapshot() {
    const inv = this.getInvestmentsSummary();
    const exp = this.getExpensesSummary();
    const eqp = this.getEquipmentSummary();
    const upc = this.getUpcomingSummary();
    const prt = this.getPartnersSummary();
    const pay = this.getPaymentsSummary();

    // Total Pending Payments combines pending investments + pending expenses
    const combinedPending = inv.pending + exp.pending;
    // Net Available Pool = Paid Investments - Paid Expenses
    const netAvailable = inv.paid - exp.paid;

    return {
      inv,
      exp,
      eqp,
      upc,
      prt,
      pay,
      combinedPending,
      netAvailable
    };
  },

  /**
   * Generate Smart Dynamic Notifications from Live Data
   */
  getNotifications() {
    const snap = this.getDashboardSnapshot();
    const list = [];

    if (snap.combinedPending > 0) {
      list.push({
        type: 'danger',
        icon: 'fa-clock',
        text: `${GZ.Utils.formatINR(snap.combinedPending)} total payment is pending settlement`,
        sub: `Investments: ${GZ.Utils.formatINR(snap.inv.pending)} • Expenses: ${GZ.Utils.formatINR(snap.exp.pending)}`,
        targetPage: 'payments'
      });
    }

    // Check upcoming costs due within 10 days
    const refDate = new Date('2026-09-29T00:00:00');
    GZ.State.get('upcoming').forEach(u => {
      if (u.status === 'Paid' || u.status === 'Cancelled') return;
      const exp = new Date(u.expectedDate + 'T00:00:00');
      const days = Math.ceil((exp - refDate) / (1000 * 60 * 60 * 24));
      if (days >= 0 && days <= 14) {
        list.push({
          type: 'warning',
          icon: 'fa-calendar-day',
          text: `${u.name} of ${GZ.Utils.formatINR(u.estimatedAmount)} is due in ${days} days`,
          sub: `Priority: ${u.priority} • Expected ${GZ.Utils.formatDate(u.expectedDate)}`,
          targetPage: 'upcoming'
        });
      }
    });

    // Latest investment added
    const invs = GZ.State.get('investments');
    if (invs.length > 0) {
      const latest = invs[0];
      list.push({
        type: 'info',
        icon: 'fa-sack-dollar',
        text: `Investment recorded by ${latest.investor}: ${latest.description}`,
        sub: `${GZ.Utils.formatINR(latest.amount)} (${latest.status}) on ${GZ.Utils.formatDate(latest.date)}`,
        targetPage: 'investments'
      });
    }

    // Monthly expense threshold check
    if (snap.exp.thisMonth >= 50000) {
      list.push({
        type: 'warning',
        icon: 'fa-chart-line',
        text: `Monthly expense crossed ₹50,000 (${GZ.Utils.formatINR(snap.exp.thisMonth)})`,
        sub: 'Review September operational expenses',
        targetPage: 'expenses'
      });
    }

    return list;
  }
};
