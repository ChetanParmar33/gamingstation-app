/* ==========================================================================
   GameZone Business Management — Expenses & Upcoming Costs (js/expenses.js)
   Operational Expense Tracking + Future Upcoming Cost Planner
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Expenses = {
  state: {
    search: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    status: '',
    sortKey: 'date',
    sortDir: 'desc',
    page: 1,
    perPage: 8
  },

  populateFilterOptions() {
    const catSel = document.getElementById('expFilterCategory');
    if (catSel && catSel.options.length <= 1) {
      catSel.innerHTML = `<option value="">All Categories</option>` +
        GZ.Data.EXPENSE_CATEGORIES.map(c => `<option value="${GZ.Utils.escapeHtml(c)}">${GZ.Utils.escapeHtml(c)}</option>`).join('');
    }
  },

  onSearch(val) {
    this.state.search = val.trim().toLowerCase();
    this.state.page = 1;
    this.render();
  },

  applyFilters() {
    this.state.dateFrom = (document.getElementById('expFilterFrom')?.value || '').trim();
    this.state.dateTo = (document.getElementById('expFilterTo')?.value || '').trim();
    this.state.category = (document.getElementById('expFilterCategory')?.value || '').trim();
    this.state.status = (document.getElementById('expFilterStatus')?.value || '').trim();
    this.state.page = 1;
    this.render();
  },

  resetFilters() {
    this.state.search = '';
    this.state.dateFrom = '';
    this.state.dateTo = '';
    this.state.category = '';
    this.state.status = '';
    this.state.page = 1;
    ['expSearchInput', 'expFilterFrom', 'expFilterTo', 'expFilterCategory', 'expFilterStatus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this.render();
  },

  sortBy(key) {
    if (this.state.sortKey === key) {
      this.state.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortKey = key;
      this.state.sortDir = 'asc';
    }
    this.render();
  },

  goToPage(p) {
    this.state.page = p;
    this.render();
  },

  getFilteredData() {
    const all = GZ.State.get('expenses');
    const s = this.state;
    const filtered = all.filter(item => {
      if (s.search) {
        const hay = `${item.id} ${item.category} ${item.description} ${item.vendor} ${item.paymentMethod} ${item.status} ${item.notes}`.toLowerCase();
        if (!hay.includes(s.search)) return false;
      }
      if (s.dateFrom && item.date < s.dateFrom) return false;
      if (s.dateTo && item.date > s.dateTo) return false;
      if (s.category && item.category !== s.category) return false;
      if (s.status && item.status !== s.status) return false;
      return true;
    });

    return GZ.Utils.sortData(filtered, s.sortKey, s.sortDir);
  },

  render() {
    this.populateFilterOptions();
    const expSum = GZ.Calc.getExpensesSummary();

    // Render top 4 KPI cards
    const kpiEl = document.getElementById('expensesKpiGrid');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-top"><span class="kpi-title">Total Expenses</span><div class="kpi-icon"><i class="fa-solid fa-receipt"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(expSum.total)}</div>
          <div class="kpi-sub"><span>Across ${expSum.count} expense entries</span></div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-top"><span class="kpi-title">Paid Expenses</span><div class="kpi-icon success"><i class="fa-solid fa-circle-check"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(expSum.paid)}</div>
          <div class="kpi-sub"><span class="trend-up">Cleared with vendors</span></div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-top"><span class="kpi-title">Pending Expenses</span><div class="kpi-icon danger"><i class="fa-solid fa-hourglass-half"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(expSum.pending)}</div>
          <div class="kpi-sub"><span class="trend-danger">Requires settlement</span></div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-top"><span class="kpi-title">This Month Expense</span><div class="kpi-icon warning"><i class="fa-solid fa-calendar-week"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(expSum.thisMonth)}</div>
          <div class="kpi-sub"><span>Current billing month</span></div>
        </div>
      `;
    }

    const tbody = document.getElementById('expensesTableBody');
    const summaryBar = document.getElementById('expensesBottomSummary');
    if (!tbody) return;

    const filtered = this.getFilteredData();
    const pageInfo = GZ.Utils.paginate(filtered, this.state.page, this.state.perPage);

    let fTotal = 0;
    let fPaid = 0;
    let fPending = 0;
    filtered.forEach(r => {
      const res = GZ.Calc.resolveAmounts(r);
      fTotal += res.amount;
      fPaid += res.paid;
      fPending += res.pending;
    });

    if (!pageInfo.items.length) {
      tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><i class="fa-solid fa-file-invoice-dollar"></i><p>No matching expense records found.</p></div></td></tr>`;
    } else {
      tbody.innerHTML = pageInfo.items
        .map(r => {
          const res = GZ.Calc.resolveAmounts(r);
          return `
            <tr>
              <td class="mono" style="font-weight:600;color:var(--primary);">${GZ.Utils.escapeHtml(r.id)}</td>
              <td>${GZ.Utils.formatDate(r.date)}</td>
              <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(r.category)}</span></td>
              <td><strong>${GZ.Utils.escapeHtml(r.description)}</strong></td>
              <td>${GZ.Utils.escapeHtml(r.vendor)}</td>
              <td class="mono" style="font-weight:700;">
                ${GZ.Utils.formatINR(res.amount)}
                ${r.status === 'Partial' ? `<div style="font-size:0.7rem;color:var(--text-muted);">Paid: ${GZ.Utils.formatINR(res.paid)}</div>` : ''}
              </td>
              <td>${GZ.Utils.badge(r.status)}</td>
              <td>${GZ.Utils.escapeHtml(r.paymentMethod)}</td>
              <td style="max-width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${GZ.Utils.escapeHtml(r.notes)}">${GZ.Utils.escapeHtml(r.notes || '—')}</td>
              <td>
                <div class="row-actions">
                  <button class="action-icon-btn" title="View" onclick="GZ.Expenses.openViewModal('${r.id}')"><i class="fa-solid fa-eye"></i></button>
                  <button class="action-icon-btn" title="Edit" onclick="GZ.Expenses.openFormModal('${r.id}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="action-icon-btn delete" title="Delete" onclick="GZ.Expenses.confirmDelete('${r.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('');
    }

    if (summaryBar) {
      summaryBar.innerHTML = `
        <div class="totals-pills">
          <span>Filtered Total: <strong style="color:var(--primary);">${GZ.Utils.formatINR(fTotal)}</strong></span>
          <span>Paid: <strong style="color:var(--success);">${GZ.Utils.formatINR(fPaid)}</strong></span>
          <span>Pending: <strong style="color:var(--danger);">${GZ.Utils.formatINR(fPending)}</strong></span>
        </div>
        ${GZ.Utils.renderPagination(pageInfo, 'GZ.Expenses.goToPage')}
      `;
    }
  },

  openFormModal(editId = null) {
    const existing = editId ? GZ.State.get('expenses').find(r => r.id === editId) : null;
    const isEdit = Boolean(existing);
    const today = new Date().toISOString().slice(0, 10);
    const statusVal = existing ? existing.status : 'Paid';
    const paidVal = existing ? (existing.paidAmount ?? existing.amount) : '';

    GZ.Utils.openModal({
      title: isEdit ? `Edit Expense (${existing.id})` : `+ Add Expense`,
      bodyHtml: `
        <form class="form-grid" onsubmit="return false;">
          <div class="form-group">
            <label>Date *</label>
            <input type="date" id="expFormDate" class="form-control" required value="${existing ? existing.date : today}">
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select id="expFormCategory" class="form-control">
              ${GZ.Data.EXPENSE_CATEGORIES.map(c => `<option value="${GZ.Utils.escapeHtml(c)}" ${existing && existing.category === c ? 'selected' : ''}>${GZ.Utils.escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full-width">
            <label>Description *</label>
            <input type="text" id="expFormDesc" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.description : '')}" placeholder="e.g. Monthly Shop Rent or Electricity Bill">
          </div>
          <div class="form-group">
            <label>Vendor / Payee *</label>
            <input type="text" id="expFormVendor" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.vendor : '')}" placeholder="e.g. Airtel Business">
          </div>
          <div class="form-group">
            <label>Amount (INR ₹) *</label>
            <input type="number" id="expFormAmount" class="form-control" min="1" required value="${existing ? existing.amount : ''}" placeholder="e.g. 15000">
          </div>
          <div class="form-group">
            <label>Payment Status *</label>
            <select id="expFormStatus" class="form-control">
              ${GZ.Data.PAYMENT_STATUSES.map(st => `<option value="${st}" ${statusVal === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Payment Method *</label>
            <select id="expFormMethod" class="form-control">
              ${GZ.Data.PAYMENT_METHODS.map(m => `<option value="${GZ.Utils.escapeHtml(m)}" ${existing && existing.paymentMethod === m ? 'selected' : ''}>${GZ.Utils.escapeHtml(m)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full-width ${statusVal === 'Partial' ? '' : 'hidden'}" id="expPartialPaidGroup">
            <label>Amount Paid So Far (₹)</label>
            <input type="number" id="expFormPaidAmount" class="form-control" min="0" value="${paidVal}">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea id="expFormNotes" class="form-control" placeholder="Bill reference, due date, remarks...">${GZ.Utils.escapeHtml(existing ? existing.notes : '')}</textarea>
          </div>
        </form>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="saveExpenseBtn"><i class="fa-solid fa-check"></i> Save Expense</button>
      `,
      onMount: () => {
        const statusSel = document.getElementById('expFormStatus');
        const partialGrp = document.getElementById('expPartialPaidGroup');
        statusSel.onchange = () => {
          partialGrp.classList.toggle('hidden', statusSel.value !== 'Partial');
        };

        document.getElementById('saveExpenseBtn').onclick = () => {
          const date = document.getElementById('expFormDate').value;
          const category = document.getElementById('expFormCategory').value;
          const description = document.getElementById('expFormDesc').value.trim();
          const vendor = document.getElementById('expFormVendor').value.trim();
          const amount = Number(document.getElementById('expFormAmount').value);
          const status = document.getElementById('expFormStatus').value;
          const paymentMethod = document.getElementById('expFormMethod').value;
          const notes = document.getElementById('expFormNotes').value.trim();

          if (!date || !description || !vendor || !(amount > 0)) {
            GZ.Utils.toast('Please fill all required expense fields.', 'warning');
            return;
          }

          let paidAmount = amount;
          if (status === 'Pending') paidAmount = 0;
          else if (status === 'Partial') {
            paidAmount = Number(document.getElementById('expFormPaidAmount').value) || Math.round(amount / 2);
            paidAmount = Math.min(amount, Math.max(0, paidAmount));
          }

          const payload = { date, category, description, vendor, amount, paidAmount, status, paymentMethod, notes };
          if (isEdit) {
            GZ.State.updateItem('expenses', editId, payload);
            GZ.Utils.toast(`Expense ${editId} updated.`, 'success');
          } else {
            const id = GZ.Utils.generateId('EXP', GZ.State.get('expenses'));
            GZ.State.addItem('expenses', { id, ...payload });
            GZ.Utils.toast(`Expense ${id} added.`, 'success');
          }
          GZ.Utils.closeModal();
        };
      }
    });
  },

  openViewModal(id) {
    const item = GZ.State.get('expenses').find(r => r.id === id);
    if (!item) return;
    const res = GZ.Calc.resolveAmounts(item);
    GZ.Utils.openModal({
      title: `Expense Details — ${item.id}`,
      bodyHtml: `
        <div class="detail-grid">
          <div class="detail-item"><span>Expense ID</span><strong class="mono">${GZ.Utils.escapeHtml(item.id)}</strong></div>
          <div class="detail-item"><span>Date</span><strong>${GZ.Utils.formatDate(item.date)}</strong></div>
          <div class="detail-item"><span>Category</span><strong>${GZ.Utils.escapeHtml(item.category)}</strong></div>
          <div class="detail-item"><span>Vendor</span><strong>${GZ.Utils.escapeHtml(item.vendor)}</strong></div>
          <div class="detail-item" style="grid-column:1/-1;"><span>Description</span><strong>${GZ.Utils.escapeHtml(item.description)}</strong></div>
          <div class="detail-item"><span>Amount</span><strong class="mono">${GZ.Utils.formatINR(res.amount)}</strong></div>
          <div class="detail-item"><span>Paid / Pending</span><strong style="color:var(--success);">${GZ.Utils.formatINR(res.paid)}</strong> / <strong style="color:var(--danger);">${GZ.Utils.formatINR(res.pending)}</strong></div>
          <div class="detail-item"><span>Status</span>${GZ.Utils.badge(item.status)}</div>
          <div class="detail-item"><span>Method</span><strong>${GZ.Utils.escapeHtml(item.paymentMethod)}</strong></div>
          <div class="detail-item" style="grid-column:1/-1;"><span>Notes</span><strong>${GZ.Utils.escapeHtml(item.notes || '—')}</strong></div>
        </div>
      `,
      footerHtml: `<button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Close</button>`
    });
  },

  confirmDelete(id) {
    const item = GZ.State.get('expenses').find(r => r.id === id);
    if (!item) return;
    GZ.Utils.confirmDialog({
      title: 'Delete Expense',
      message: `Delete expense <strong>${GZ.Utils.escapeHtml(item.description)}</strong> (${GZ.Utils.formatINR(item.amount)})?`,
      onConfirm: () => {
        GZ.State.deleteItem('expenses', id);
        GZ.Utils.toast(`Expense ${id} deleted.`, 'info');
      }
    });
  },

  exportCSV() {
    GZ.Utils.exportCSV('gamezone_expenses.csv', this.getFilteredData(), [
      { key: 'id', label: 'ExpenseID' },
      { key: 'date', label: 'Date' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'vendor', label: 'Vendor' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'PaymentStatus' },
      { key: 'paymentMethod', label: 'PaymentMethod' },
      { key: 'notes', label: 'Notes' }
    ]);
  },

  importCSV() {
    GZ.Utils.triggerCSVImport(
      [
        { key: 'date', label: 'Date', default: new Date().toISOString().slice(0, 10) },
        { key: 'category', label: 'Category', default: 'Other' },
        { key: 'description', label: 'Description', default: 'Imported Expense' },
        { key: 'vendor', label: 'Vendor', default: 'Vendor' },
        { key: 'amount', label: 'Amount', type: 'number', default: 0 },
        { key: 'status', label: 'PaymentStatus', default: 'Paid' },
        { key: 'paymentMethod', label: 'PaymentMethod', default: 'UPI' },
        { key: 'notes', label: 'Notes', default: '' }
      ],
      records => {
        const list = GZ.State.get('expenses');
        records.forEach(r => {
          const id = GZ.Utils.generateId('EXP', list);
          const amt = Number(r.amount) || 0;
          list.unshift({ id, ...r, amount: amt, paidAmount: r.status === 'Pending' ? 0 : amt });
        });
        GZ.State.set('expenses', list);
        GZ.Utils.toast(`Imported ${records.length} expenses!`, 'success');
      }
    );
  }
};

/* ==========================================================================
   UPCOMING COSTS MODULE (GZ.Upcoming)
   ========================================================================== */
GZ.Upcoming = {
  state: {
    search: '',
    priority: '',
    status: '',
    sortKey: 'expectedDate',
    sortDir: 'asc',
    page: 1,
    perPage: 8
  },

  onSearch(val) {
    this.state.search = val.trim().toLowerCase();
    this.state.page = 1;
    this.render();
  },

  applyFilters() {
    this.state.priority = (document.getElementById('upcFilterPriority')?.value || '').trim();
    this.state.status = (document.getElementById('upcFilterStatus')?.value || '').trim();
    this.state.page = 1;
    this.render();
  },

  resetFilters() {
    this.state.search = '';
    this.state.priority = '';
    this.state.status = '';
    this.state.page = 1;
    ['upcSearchInput', 'upcFilterPriority', 'upcFilterStatus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this.render();
  },

  sortBy(key) {
    if (this.state.sortKey === key) {
      this.state.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortKey = key;
      this.state.sortDir = 'asc';
    }
    this.render();
  },

  goToPage(p) {
    this.state.page = p;
    this.render();
  },

  getFilteredData() {
    const all = GZ.State.get('upcoming');
    const s = this.state;
    const filtered = all.filter(item => {
      if (s.search) {
        const hay = `${item.id} ${item.name} ${item.category} ${item.priority} ${item.status} ${item.notes}`.toLowerCase();
        if (!hay.includes(s.search)) return false;
      }
      if (s.priority && item.priority !== s.priority) return false;
      if (s.status && item.status !== s.status) return false;
      return true;
    });
    return GZ.Utils.sortData(filtered, s.sortKey, s.sortDir);
  },

  render() {
    const upcSum = GZ.Calc.getUpcomingSummary();

    const kpiEl = document.getElementById('upcomingKpiGrid');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-top"><span class="kpi-title">Total Upcoming Cost</span><div class="kpi-icon"><i class="fa-solid fa-calendar-plus"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(upcSum.totalActive)}</div>
          <div class="kpi-sub"><span>Planned & Approved budget</span></div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-top"><span class="kpi-title">High Priority Cost</span><div class="kpi-icon danger"><i class="fa-solid fa-fire"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(upcSum.highPriority)}</div>
          <div class="kpi-sub"><span class="trend-danger">Critical launch & setup items</span></div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-top"><span class="kpi-title">Next 30 Days Cost</span><div class="kpi-icon warning"><i class="fa-solid fa-bolt"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(upcSum.next30Days)}</div>
          <div class="kpi-sub"><span class="trend-warn">Immediate cash requirement</span></div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-top"><span class="kpi-title">Next 90 Days Cost</span><div class="kpi-icon info"><i class="fa-solid fa-calendar-days"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(upcSum.next90Days)}</div>
          <div class="kpi-sub"><span>Quarterly forecast</span></div>
        </div>
      `;
    }

    const tbody = document.getElementById('upcomingTableBody');
    const summaryBar = document.getElementById('upcomingBottomSummary');
    if (!tbody) return;

    const filtered = this.getFilteredData();
    const pageInfo = GZ.Utils.paginate(filtered, this.state.page, this.state.perPage);
    const totalEst = filtered.reduce((acc, r) => acc + (Number(r.estimatedAmount) || 0), 0);

    if (!pageInfo.items.length) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-calendar-check"></i><p>No upcoming costs match your filter.</p></div></td></tr>`;
    } else {
      tbody.innerHTML = pageInfo.items
        .map(
          r => `
        <tr>
          <td class="mono" style="font-weight:600;color:var(--primary);">${GZ.Utils.escapeHtml(r.id)}</td>
          <td><strong>${GZ.Utils.escapeHtml(r.name)}</strong></td>
          <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(r.category)}</span></td>
          <td>${GZ.Utils.formatDate(r.expectedDate)}</td>
          <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(r.estimatedAmount)}</td>
          <td>${GZ.Utils.badge(r.priority)}</td>
          <td>${GZ.Utils.badge(r.status)}</td>
          <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${GZ.Utils.escapeHtml(r.notes)}">${GZ.Utils.escapeHtml(r.notes || '—')}</td>
          <td>
            <div class="row-actions">
              <button class="action-icon-btn" title="Edit" onclick="GZ.Upcoming.openFormModal('${r.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="action-icon-btn delete" title="Delete" onclick="GZ.Upcoming.confirmDelete('${r.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `
        )
        .join('');
    }

    if (summaryBar) {
      summaryBar.innerHTML = `
        <div class="totals-pills">
          <span>Filtered Estimated Total: <strong style="color:var(--primary);">${GZ.Utils.formatINR(totalEst)}</strong></span>
        </div>
        ${GZ.Utils.renderPagination(pageInfo, 'GZ.Upcoming.goToPage')}
      `;
    }
  },

  openFormModal(editId = null) {
    const existing = editId ? GZ.State.get('upcoming').find(r => r.id === editId) : null;
    const isEdit = Boolean(existing);
    const defaultDate = '2026-10-15';

    GZ.Utils.openModal({
      title: isEdit ? `Edit Upcoming Cost (${existing.id})` : `+ Add Upcoming Cost`,
      bodyHtml: `
        <form class="form-grid" onsubmit="return false;">
          <div class="form-group full-width">
            <label>Cost Name *</label>
            <input type="text" id="upcFormName" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.name : '')}" placeholder="e.g. Remaining Interior or Additional Gaming Chairs">
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select id="upcFormCategory" class="form-control">
              ${GZ.Data.EXPENSE_CATEGORIES.map(c => `<option value="${GZ.Utils.escapeHtml(c)}" ${existing && existing.category === c ? 'selected' : ''}>${GZ.Utils.escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Expected Date *</label>
            <input type="date" id="upcFormDate" class="form-control" required value="${existing ? existing.expectedDate : defaultDate}">
          </div>
          <div class="form-group">
            <label>Estimated Amount (INR ₹) *</label>
            <input type="number" id="upcFormAmount" class="form-control" min="1" required value="${existing ? existing.estimatedAmount : ''}" placeholder="e.g. 35000">
          </div>
          <div class="form-group">
            <label>Priority *</label>
            <select id="upcFormPriority" class="form-control">
              ${GZ.Data.UPCOMING_PRIORITIES.map(p => `<option value="${p}" ${existing && existing.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full-width">
            <label>Status *</label>
            <select id="upcFormStatus" class="form-control">
              ${GZ.Data.UPCOMING_STATUSES.map(st => `<option value="${st}" ${existing && existing.status === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea id="upcFormNotes" class="form-control" placeholder="Vendor estimate, timeline details...">${GZ.Utils.escapeHtml(existing ? existing.notes : '')}</textarea>
          </div>
        </form>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="saveUpcomingBtn"><i class="fa-solid fa-check"></i> Save Upcoming Cost</button>
      `,
      onMount: () => {
        document.getElementById('saveUpcomingBtn').onclick = () => {
          const name = document.getElementById('upcFormName').value.trim();
          const category = document.getElementById('upcFormCategory').value;
          const expectedDate = document.getElementById('upcFormDate').value;
          const estimatedAmount = Number(document.getElementById('upcFormAmount').value);
          const priority = document.getElementById('upcFormPriority').value;
          const status = document.getElementById('upcFormStatus').value;
          const notes = document.getElementById('upcFormNotes').value.trim();

          if (!name || !expectedDate || !(estimatedAmount > 0)) {
            GZ.Utils.toast('Please fill all required fields.', 'warning');
            return;
          }

          const payload = { name, category, expectedDate, estimatedAmount, priority, status, notes };
          if (isEdit) {
            GZ.State.updateItem('upcoming', editId, payload);
            GZ.Utils.toast(`Upcoming cost ${editId} updated.`, 'success');
          } else {
            const id = GZ.Utils.generateId('UPC', GZ.State.get('upcoming'));
            GZ.State.addItem('upcoming', { id, ...payload });
            GZ.Utils.toast(`Upcoming cost ${id} added.`, 'success');
          }
          GZ.Utils.closeModal();
        };
      }
    });
  },

  confirmDelete(id) {
    const item = GZ.State.get('upcoming').find(r => r.id === id);
    if (!item) return;
    GZ.Utils.confirmDialog({
      title: 'Delete Upcoming Cost',
      message: `Delete planned cost <strong>${GZ.Utils.escapeHtml(item.name)}</strong> (${GZ.Utils.formatINR(item.estimatedAmount)})?`,
      onConfirm: () => {
        GZ.State.deleteItem('upcoming', id);
        GZ.Utils.toast(`Upcoming cost ${id} deleted.`, 'info');
      }
    });
  }
};
