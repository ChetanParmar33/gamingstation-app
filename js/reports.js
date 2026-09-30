/* ==========================================================================
   GameZone Business Management — Business Reports Module (js/reports.js)
   Investment, Expense, Asset, Payment & Partner Reports + CSV / Print / PDF
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Reports = {
  state: {
    activeTab: 'investment',
    dateFrom: '',
    dateTo: '',
    category: '',
    partner: ''
  },

  switchTab(tab) {
    this.state.activeTab = tab;
    document.querySelectorAll('.report-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    this.render();
  },

  populateFilters() {
    const prtSel = document.getElementById('repFilterPartner');
    const catSel = document.getElementById('repFilterCategory');

    if (prtSel) {
      const partners = GZ.Calc.getPartnersSummary().partners.map(p => p.name);
      prtSel.innerHTML = `<option value="">All Partners</option>` +
        partners.map(p => `<option value="${GZ.Utils.escapeHtml(p)}">${GZ.Utils.escapeHtml(p)}</option>`).join('');
      prtSel.value = this.state.partner;
    }

    if (catSel) {
      const cats = Array.from(new Set([...GZ.Data.INVESTMENT_CATEGORIES, ...GZ.Data.EXPENSE_CATEGORIES, ...GZ.Data.EQUIPMENT_CATEGORIES]));
      catSel.innerHTML = `<option value="">All Categories</option>` +
        cats.map(c => `<option value="${GZ.Utils.escapeHtml(c)}">${GZ.Utils.escapeHtml(c)}</option>`).join('');
      catSel.value = this.state.category;
    }
  },

  applyFilters() {
    this.state.dateFrom = (document.getElementById('repFilterFrom')?.value || '').trim();
    this.state.dateTo = (document.getElementById('repFilterTo')?.value || '').trim();
    this.state.category = (document.getElementById('repFilterCategory')?.value || '').trim();
    this.state.partner = (document.getElementById('repFilterPartner')?.value || '').trim();
    this.render();
  },

  resetFilters() {
    this.state.dateFrom = '';
    this.state.dateTo = '';
    this.state.category = '';
    this.state.partner = '';
    ['repFilterFrom', 'repFilterTo', 'repFilterCategory', 'repFilterPartner'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this.render();
  },

  getFilteredCollections() {
    const s = this.state;
    const invs = GZ.State.get('investments').filter(r => {
      if (s.dateFrom && r.date < s.dateFrom) return false;
      if (s.dateTo && r.date > s.dateTo) return false;
      if (s.category && r.category !== s.category) return false;
      if (s.partner && r.investor !== s.partner) return false;
      return true;
    });

    const exps = GZ.State.get('expenses').filter(r => {
      if (s.dateFrom && r.date < s.dateFrom) return false;
      if (s.dateTo && r.date > s.dateTo) return false;
      if (s.category && r.category !== s.category) return false;
      return true;
    });

    const eqps = GZ.State.get('equipment').filter(r => {
      if (s.dateFrom && r.purchaseDate < s.dateFrom) return false;
      if (s.dateTo && r.purchaseDate > s.dateTo) return false;
      if (s.category && r.category !== s.category) return false;
      if (s.partner && r.owner !== s.partner) return false;
      return true;
    });

    const pays = GZ.State.get('payments').filter(r => {
      if (s.dateFrom && r.date < s.dateFrom) return false;
      if (s.dateTo && r.date > s.dateTo) return false;
      if (s.partner && !String(r.personVendor).toLowerCase().includes(s.partner.toLowerCase())) return false;
      return true;
    });

    return { invs, exps, eqps, pays };
  },

  render() {
    this.populateFilters();
    const container = document.getElementById('reportContentContainer');
    if (!container) return;

    const { invs, exps, eqps, pays } = this.getFilteredCollections();
    const tab = this.state.activeTab;

    if (tab === 'investment') {
      container.innerHTML = this.buildInvestmentReport(invs);
    } else if (tab === 'expense') {
      container.innerHTML = this.buildExpenseReport(exps);
    } else if (tab === 'asset') {
      container.innerHTML = this.buildAssetReport(eqps);
    } else if (tab === 'payment') {
      container.innerHTML = this.buildPaymentReport(invs, exps, pays);
    } else if (tab === 'partner') {
      container.innerHTML = this.buildPartnerReport(invs, exps);
    }
  },

  buildInvestmentReport(invs) {
    const byPerson = {};
    const byCategory = {};
    let total = 0;
    let paid = 0;
    let pending = 0;

    invs.forEach(r => {
      const res = GZ.Calc.resolveAmounts(r);
      total += res.amount;
      paid += res.paid;
      pending += res.pending;

      byPerson[r.investor] = byPerson[r.investor] || { amount: 0, paid: 0, pending: 0, count: 0 };
      byPerson[r.investor].amount += res.amount;
      byPerson[r.investor].paid += res.paid;
      byPerson[r.investor].pending += res.pending;
      byPerson[r.investor].count += 1;

      byCategory[r.category] = byCategory[r.category] || { amount: 0, count: 0 };
      byCategory[r.category].amount += res.amount;
      byCategory[r.category].count += 1;
    });

    return `
      <div class="kpi-grid-4">
        <div class="kpi-card"><div class="kpi-title">Total Investment</div><div class="kpi-value">${GZ.Utils.formatINR(total)}</div><div class="kpi-sub">${invs.length} records</div></div>
        <div class="kpi-card kpi-success"><div class="kpi-title">Amount Paid</div><div class="kpi-value">${GZ.Utils.formatINR(paid)}</div><div class="kpi-sub">Settled capital</div></div>
        <div class="kpi-card kpi-danger"><div class="kpi-title">Amount Pending</div><div class="kpi-value">${GZ.Utils.formatINR(pending)}</div><div class="kpi-sub">Balance to clear</div></div>
        <div class="kpi-card kpi-info"><div class="kpi-title">Categories Covered</div><div class="kpi-value">${Object.keys(byCategory).length}</div><div class="kpi-sub">Hardware & setup areas</div></div>
      </div>

      <div class="dashboard-lists-grid" style="margin-bottom:1.25rem;">
        <div class="table-card">
          <div class="card-header"><h3><i class="fa-solid fa-user-tie"></i> Investment by Partner</h3></div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Investor</th><th>Entries</th><th>Total</th><th>Paid</th><th>Pending</th></tr></thead>
              <tbody>
                ${Object.entries(byPerson).map(([name, d]) => `
                  <tr>
                    <td><strong>${GZ.Utils.escapeHtml(name)}</strong></td>
                    <td>${d.count}</td>
                    <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(d.amount)}</td>
                    <td class="mono" style="color:var(--success);">${GZ.Utils.formatINR(d.paid)}</td>
                    <td class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(d.pending)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="5">No data</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <div class="card-header"><h3><i class="fa-solid fa-layer-group"></i> Investment by Category</h3></div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Category</th><th>Items</th><th>Total Invested</th><th>Share %</th></tr></thead>
              <tbody>
                ${Object.entries(byCategory).sort((a, b) => b[1].amount - a[1].amount).map(([cat, d]) => `
                  <tr>
                    <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(cat)}</span></td>
                    <td>${d.count}</td>
                    <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(d.amount)}</td>
                    <td>${total ? ((d.amount / total) * 100).toFixed(1) : 0}%</td>
                  </tr>
                `).join('') || '<tr><td colspan="4">No data</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  buildExpenseReport(exps) {
    const byMonth = {};
    const byCategory = {};
    const byVendor = {};
    let total = 0;

    exps.forEach(r => {
      const amt = Number(r.amount) || 0;
      total += amt;

      const m = GZ.Utils.getMonthKey(r.date);
      byMonth[m] = (byMonth[m] || 0) + amt;
      byCategory[r.category] = (byCategory[r.category] || 0) + amt;
      byVendor[r.vendor] = (byVendor[r.vendor] || 0) + amt;
    });

    return `
      <div class="dashboard-lists-grid report-grid-3">
        <div class="table-card">
          <div class="card-header"><h3><i class="fa-solid fa-calendar"></i> Expenses by Month</h3></div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Month</th><th>Total Expense</th></tr></thead>
              <tbody>
                ${Object.entries(byMonth).sort().map(([m, amt]) => `
                  <tr><td><strong>${GZ.Utils.formatMonthLabel(m)}</strong></td><td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(amt)}</td></tr>
                `).join('') || '<tr><td colspan="2">No data</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <div class="card-header"><h3><i class="fa-solid fa-tags"></i> Expenses by Category</h3></div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Category</th><th>Amount</th><th>%</th></tr></thead>
              <tbody>
                ${Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([c, amt]) => `
                  <tr><td><span class="badge badge-purple">${GZ.Utils.escapeHtml(c)}</span></td><td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(amt)}</td><td>${total ? ((amt / total) * 100).toFixed(1) : 0}%</td></tr>
                `).join('') || '<tr><td colspan="3">No data</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <div class="card-header"><h3><i class="fa-solid fa-store"></i> Expenses by Vendor</h3></div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Vendor</th><th>Total Billed</th></tr></thead>
              <tbody>
                ${Object.entries(byVendor).sort((a, b) => b[1] - a[1]).map(([v, amt]) => `
                  <tr><td><strong>${GZ.Utils.escapeHtml(v)}</strong></td><td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(amt)}</td></tr>
                `).join('') || '<tr><td colspan="2">No data</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  buildAssetReport(eqps) {
    let totalVal = 0;
    let totalUnits = 0;

    const rows = eqps.map(e => {
      const val = (Number(e.quantity) || 0) * (Number(e.purchasePrice) || 0);
      totalVal += val;
      totalUnits += Number(e.quantity) || 0;
      return { ...e, totalVal: val };
    });

    return `
      <div class="table-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-gamepad"></i> Gaming Station Hardware & Asset Valuation Report</h3>
          <span class="badge badge-paid">Total Asset Value: ${GZ.Utils.formatINR(totalVal)} (${totalUnits} Units)</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Asset Name</th><th>Category</th><th>Owner</th><th>Qty</th><th>Unit Price</th><th>Total Value</th><th>Condition</th></tr></thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  <td><strong>${GZ.Utils.escapeHtml(r.name)}</strong></td>
                  <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(r.category)}</span></td>
                  <td>${GZ.Utils.escapeHtml(r.owner)}</td>
                  <td class="mono">${r.quantity}</td>
                  <td class="mono">${GZ.Utils.formatINR(r.purchasePrice)}</td>
                  <td class="mono" style="font-weight:700;color:var(--primary);">${GZ.Utils.formatINR(r.totalVal)}</td>
                  <td>${GZ.Utils.badge(r.condition)}</td>
                </tr>
              `).join('') || '<tr><td colspan="7">No assets found</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  buildPaymentReport(invs, exps, pays) {
    let invPaid = 0, invPend = 0;
    invs.forEach(r => {
      const res = GZ.Calc.resolveAmounts(r);
      invPaid += res.paid;
      invPend += res.pending;
    });

    let expPaid = 0, expPend = 0;
    exps.forEach(r => {
      const res = GZ.Calc.resolveAmounts(r);
      expPaid += res.paid;
      expPend += res.pending;
    });

    let payPaid = 0, payPend = 0;
    pays.forEach(p => {
      payPaid += Number(p.paid) || 0;
      payPend += Number(p.pending) || 0;
    });

    return `
      <div class="table-card">
        <div class="card-header"><h3><i class="fa-solid fa-scale-balanced"></i> Paid vs Pending Financial Obligations Report</h3></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Financial Ledger Stream</th><th>Total Committed</th><th>Amount Paid (Cleared)</th><th>Amount Pending (Due)</th><th>Clearance Ratio</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Capital Investments Ledger</strong></td>
                <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(invPaid + invPend)}</td>
                <td class="mono" style="color:var(--success);font-weight:700;">${GZ.Utils.formatINR(invPaid)}</td>
                <td class="mono" style="color:var(--danger);font-weight:700;">${GZ.Utils.formatINR(invPend)}</td>
                <td>${invPaid + invPend ? Math.round((invPaid / (invPaid + invPend)) * 100) : 100}%</td>
              </tr>
              <tr>
                <td><strong>Operational Expenses Ledger</strong></td>
                <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(expPaid + expPend)}</td>
                <td class="mono" style="color:var(--success);font-weight:700;">${GZ.Utils.formatINR(expPaid)}</td>
                <td class="mono" style="color:var(--danger);font-weight:700;">${GZ.Utils.formatINR(expPend)}</td>
                <td>${expPaid + expPend ? Math.round((expPaid / (expPaid + expPend)) * 100) : 100}%</td>
              </tr>
              <tr>
                <td><strong>Vendor Payment Tracker</strong></td>
                <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(payPaid + payPend)}</td>
                <td class="mono" style="color:var(--success);font-weight:700;">${GZ.Utils.formatINR(payPaid)}</td>
                <td class="mono" style="color:var(--danger);font-weight:700;">${GZ.Utils.formatINR(payPend)}</td>
                <td>${payPaid + payPend ? Math.round((payPaid / (payPaid + payPend)) * 100) : 100}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  buildPartnerReport() {
    const snap = GZ.Calc.getDashboardSnapshot();
    const partners = snap.prt.partners;
    const totalPool = snap.prt.totalPartnerInvested || 1;

    return `
      <div class="table-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-handshake"></i> Partner-wise Financial Summary & Profit/Loss Preparation</h3>
          <span class="badge badge-purple">Net Capital Deployed: ${GZ.Utils.formatINR(snap.inv.total)}</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Total Invested</th>
                <th>Paid Capital</th>
                <th>Pending Capital</th>
                <th>Actual Capital %</th>
                <th>Agreed Profit Share %</th>
                <th>Expense Allocation (By Share)</th>
              </tr>
            </thead>
            <tbody>
              ${partners.map(p => {
                const capPct = ((p.invested / totalPool) * 100).toFixed(1);
                const expShare = Math.round((snap.exp.total * (Number(p.profitShare) || 0)) / 100);
                return `
                  <tr>
                    <td><strong>${GZ.Utils.escapeHtml(p.name)}</strong><div style="font-size:0.74rem;color:var(--text-muted);">${GZ.Utils.escapeHtml(p.role || '')}</div></td>
                    <td class="mono" style="font-weight:700;color:var(--primary);">${GZ.Utils.formatINR(p.invested)}</td>
                    <td class="mono" style="color:var(--success);">${GZ.Utils.formatINR(p.paid)}</td>
                    <td class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(p.pending)}</td>
                    <td>${capPct}%</td>
                    <td><span class="badge badge-purple">${p.profitShare}%</span></td>
                    <td class="mono">${GZ.Utils.formatINR(expShare)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  exportCurrentReportCSV() {
    const { invs, exps, eqps, pays } = this.getFilteredCollections();
    const tab = this.state.activeTab;

    if (tab === 'investment') {
      GZ.Utils.exportCSV('gamezone_investment_report.csv', invs, [
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Date' },
        { key: 'investor', label: 'Investor' },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' }
      ]);
    } else if (tab === 'expense') {
      GZ.Utils.exportCSV('gamezone_expense_report.csv', exps, [
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Date' },
        { key: 'category', label: 'Category' },
        { key: 'vendor', label: 'Vendor' },
        { key: 'description', label: 'Description' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' }
      ]);
    } else if (tab === 'asset') {
      GZ.Utils.exportCSV('gamezone_asset_report.csv', eqps, [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'AssetName' },
        { key: 'category', label: 'Category' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'purchasePrice', label: 'UnitPrice' },
        { key: 'condition', label: 'Condition' },
        { key: 'owner', label: 'Owner' }
      ]);
    } else if (tab === 'payment') {
      GZ.Utils.exportCSV('gamezone_payment_report.csv', pays, [
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Date' },
        { key: 'personVendor', label: 'PersonVendor' },
        { key: 'amount', label: 'Amount' },
        { key: 'paid', label: 'Paid' },
        { key: 'pending', label: 'Pending' },
        { key: 'status', label: 'Status' }
      ]);
    } else {
      GZ.Partners.exportCSV();
    }
  },

  printReport() {
    window.print();
  }
};
