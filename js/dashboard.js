/* ==========================================================================
   GameZone Business Management — Dashboard View (js/dashboard.js)
   Renders dynamic KPI cards, Financial Summary strip, Charts, and Recent Lists
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Dashboard = {
  render() {
    const snap = GZ.Calc.getDashboardSnapshot();
    this.renderKPIs(snap);
    this.renderFinancialSummary(snap);
    this.renderBottomPanels(snap);
  },

  renderKPIs(snap) {
    const el = document.getElementById('dashboardKpiGrid');
    if (!el) return;

    const amitPartner = snap.prt.partners.find(p => p.name.toLowerCase() === 'amit');
    const amitPaid = amitPartner ? amitPartner.invested : 0;

    el.innerHTML = `
      <!-- CARD 1: Total Investment -->
      <div class="kpi-card" onclick="GZ.App.navigateTo('investments')" style="cursor:pointer;">
        <div class="kpi-top">
          <span class="kpi-title">Total Invested</span>
          <div class="kpi-icon"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>
        <div class="kpi-value">${GZ.Utils.formatINR(snap.inv.total)}</div>
        <div class="kpi-sub">
          <span>Click to see all investments</span>
        </div>
      </div>

      <!-- CARD 2: Total Expenses -->
      <div class="kpi-card kpi-warning" onclick="GZ.App.navigateTo('expenses')" style="cursor:pointer;">
        <div class="kpi-top">
          <span class="kpi-title">Total Expenses</span>
          <div class="kpi-icon warning"><i class="fa-solid fa-receipt"></i></div>
        </div>
        <div class="kpi-value">${GZ.Utils.formatINR(snap.exp.total)}</div>
        <div class="kpi-sub">
          <span>This month: ${GZ.Utils.formatINR(snap.exp.thisMonth)}</span>
        </div>
      </div>

      <!-- CARD 3: Pending Payments -->
      <div class="kpi-card kpi-danger" onclick="GZ.App.navigateTo('payments')" style="cursor:pointer;">
        <div class="kpi-top">
          <span class="kpi-title">Pending Bills</span>
          <div class="kpi-icon danger"><i class="fa-solid fa-wallet"></i></div>
        </div>
        <div class="kpi-value">${GZ.Utils.formatINR(snap.combinedPending)}</div>
        <div class="kpi-sub">
          <span class="trend-danger">Click to check pending bills</span>
        </div>
      </div>

      <!-- CARD 4: Shop Items -->
      <div class="kpi-card kpi-success" onclick="GZ.App.navigateTo('equipment')" style="cursor:pointer;">
        <div class="kpi-top">
          <span class="kpi-title">Shop Items Value</span>
          <div class="kpi-icon success"><i class="fa-solid fa-gamepad"></i></div>
        </div>
        <div class="kpi-value">${GZ.Utils.formatINR(snap.eqp.totalValue)}</div>
        <div class="kpi-sub">
          <span>Total ${snap.eqp.totalUnits} items in shop</span>
        </div>
      </div>

      <!-- CARD 5: Partners -->
      <div class="kpi-card" onclick="GZ.App.navigateTo('partners')" style="cursor:pointer;">
        <div class="kpi-top">
          <span class="kpi-title">Partners</span>
          <div class="kpi-icon"><i class="fa-solid fa-user-group"></i></div>
        </div>
        <div class="kpi-value">${GZ.Utils.formatINR(snap.prt.totalPartnerInvested)}</div>
        <div class="kpi-sub">
          <span>Amit: ${GZ.Utils.formatINR(amitPaid)} (${snap.prt.partners.length} partners)</span>
        </div>
      </div>

      <!-- CARD 6: Future Costs -->
      <div class="kpi-card kpi-info" onclick="GZ.App.navigateTo('upcoming')" style="cursor:pointer;">
        <div class="kpi-top">
          <span class="kpi-title">Future Costs</span>
          <div class="kpi-icon info"><i class="fa-solid fa-calendar-check"></i></div>
        </div>
        <div class="kpi-value">${GZ.Utils.formatINR(snap.upc.totalActive)}</div>
        <div class="kpi-sub">
          <span>Planned upcoming work/items</span>
        </div>
      </div>
    `;
  },

  renderFinancialSummary(snap) {
    const el = document.getElementById('dashboardFinSummary');
    if (!el) return;

    el.innerHTML = `
      <div class="fin-summary-label">
        <i class="fa-solid fa-calculator"></i>
        <div>
          <h4>Quick Balance</h4>
          <p>Total money put in minus total expenses</p>
        </div>
      </div>
      <div class="fin-summary-metrics">
        <div class="fin-metric-item">
          <span>Money Put In</span>
          <strong>${GZ.Utils.formatINR(snap.inv.total)}</strong>
        </div>
        <div class="fin-metric-item">
          <span>Total Spent</span>
          <strong>${GZ.Utils.formatINR(snap.exp.total)}</strong>
        </div>
        <div class="fin-metric-item">
          <span>Pending to Pay</span>
          <strong style="color:var(--danger);">${GZ.Utils.formatINR(snap.combinedPending)}</strong>
        </div>
        <div class="fin-metric-item">
          <span>Balance Left</span>
          <strong style="color:var(--success);">${GZ.Utils.formatINR(snap.netAvailable)}</strong>
        </div>
      </div>
    `;
  },

  renderBottomPanels() {
    // 1. Recent Investments
    const recentInvEl = document.getElementById('dashRecentInvestments');
    if (recentInvEl) {
      const invs = GZ.Utils.sortData(GZ.State.get('investments'), 'date', 'desc').slice(0, 5);
      recentInvEl.innerHTML = invs.length
        ? invs
            .map(
              r => `
            <div class="mini-list-item">
              <div class="mini-list-info">
                <h5>${GZ.Utils.escapeHtml(r.description)}</h5>
                <p>${GZ.Utils.escapeHtml(r.investor)} • ${GZ.Utils.escapeHtml(r.category)} • ${GZ.Utils.formatDate(r.date)}</p>
              </div>
              <div class="mini-list-right">
                <span class="mini-list-amount">${GZ.Utils.formatINR(r.amount)}</span>
                ${GZ.Utils.badge(r.status)}
              </div>
            </div>
          `
            )
            .join('')
        : `<div class="empty-state"><p>No investments recorded yet.</p></div>`;
    }

    // 2. Recent Expenses
    const recentExpEl = document.getElementById('dashRecentExpenses');
    if (recentExpEl) {
      const exps = GZ.Utils.sortData(GZ.State.get('expenses'), 'date', 'desc').slice(0, 5);
      recentExpEl.innerHTML = exps.length
        ? exps
            .map(
              r => `
            <div class="mini-list-item">
              <div class="mini-list-info">
                <h5>${GZ.Utils.escapeHtml(r.description)}</h5>
                <p>${GZ.Utils.escapeHtml(r.vendor)} • ${GZ.Utils.escapeHtml(r.category)} • ${GZ.Utils.formatDate(r.date)}</p>
              </div>
              <div class="mini-list-right">
                <span class="mini-list-amount">${GZ.Utils.formatINR(r.amount)}</span>
                ${GZ.Utils.badge(r.status)}
              </div>
            </div>
          `
            )
            .join('')
        : `<div class="empty-state"><p>No expenses recorded yet.</p></div>`;
    }

    // 3. Upcoming / Pending Payments
    const upPayEl = document.getElementById('dashUpcomingPayments');
    if (upPayEl) {
      const pays = GZ.State.get('payments')
        .filter(p => p.status !== 'Paid')
        .slice(0, 5);
      upPayEl.innerHTML = pays.length
        ? pays
            .map(
              p => `
            <div class="mini-list-item">
              <div class="mini-list-info">
                <h5>${GZ.Utils.escapeHtml(p.description)}</h5>
                <p>${GZ.Utils.escapeHtml(p.personVendor)} • ${GZ.Utils.formatDate(p.date)}</p>
              </div>
              <div class="mini-list-right">
                <span class="mini-list-amount" style="color:var(--danger);">Pending: ${GZ.Utils.formatINR(p.pending)}</span>
                ${GZ.Utils.badge(p.status)}
              </div>
            </div>
          `
            )
            .join('')
        : `<div class="empty-state"><p>All recorded payments are settled!</p></div>`;
    }

    // 4. Upcoming Costs
    const upCostEl = document.getElementById('dashUpcomingCosts');
    if (upCostEl) {
      const upcs = GZ.Utils.sortData(
        GZ.State.get('upcoming').filter(u => u.status !== 'Paid' && u.status !== 'Cancelled'),
        'expectedDate',
        'asc'
      ).slice(0, 5);
      upCostEl.innerHTML = upcs.length
        ? upcs
            .map(
              u => `
            <div class="mini-list-item">
              <div class="mini-list-info">
                <h5>${GZ.Utils.escapeHtml(u.name)}</h5>
                <p>${GZ.Utils.escapeHtml(u.category)} • Due ${GZ.Utils.formatDate(u.expectedDate)}</p>
              </div>
              <div class="mini-list-right">
                <span class="mini-list-amount">${GZ.Utils.formatINR(u.estimatedAmount)}</span>
                ${GZ.Utils.badge(u.priority)}
              </div>
            </div>
          `
            )
            .join('')
        : `<div class="empty-state"><p>No upcoming costs scheduled.</p></div>`;
    }
  }
};
