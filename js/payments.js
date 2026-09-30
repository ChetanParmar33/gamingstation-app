/* ==========================================================================
   GameZone Business Management — Payments Module (js/payments.js)
   Tracks Paid, Pending, Partial & Upcoming Vendor/Partner Settlements
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Payments = {
  state: {
    search: '',
    status: '',
    method: '',
    sortKey: 'date',
    sortDir: 'desc',
    page: 1,
    perPage: 8
  },

  populateFilterOptions() {
    const mSel = document.getElementById('payFilterMethod');
    if (mSel && mSel.options.length <= 1) {
      mSel.innerHTML = `<option value="">All Methods</option>` +
        GZ.Data.PAYMENT_METHODS.map(m => `<option value="${GZ.Utils.escapeHtml(m)}">${GZ.Utils.escapeHtml(m)}</option>`).join('');
    }
  },

  onSearch(val) {
    this.state.search = val.trim().toLowerCase();
    this.state.page = 1;
    this.render();
  },

  applyFilters() {
    this.state.status = (document.getElementById('payFilterStatus')?.value || '').trim();
    this.state.method = (document.getElementById('payFilterMethod')?.value || '').trim();
    this.state.page = 1;
    this.render();
  },

  resetFilters() {
    this.state.search = '';
    this.state.status = '';
    this.state.method = '';
    this.state.page = 1;
    ['paySearchInput', 'payFilterStatus', 'payFilterMethod'].forEach(id => {
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
    const all = GZ.State.get('payments');
    const s = this.state;
    const filtered = all.filter(item => {
      if (s.search) {
        const hay = `${item.id} ${item.personVendor} ${item.type} ${item.description} ${item.paymentMethod} ${item.status} ${item.notes}`.toLowerCase();
        if (!hay.includes(s.search)) return false;
      }
      if (s.status && item.status !== s.status) return false;
      if (s.method && item.paymentMethod !== s.method) return false;
      return true;
    });

    return GZ.Utils.sortData(filtered, s.sortKey, s.sortDir);
  },

  render() {
    this.populateFilterOptions();
    const paySum = GZ.Calc.getPaymentsSummary();

    const kpiEl = document.getElementById('paymentsKpiGrid');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-card kpi-success">
          <div class="kpi-top"><span class="kpi-title">Paid Amount</span><div class="kpi-icon success"><i class="fa-solid fa-circle-check"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(paySum.paidAmount)}</div>
          <div class="kpi-sub"><span class="trend-up">Cleared settlements</span></div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-top"><span class="kpi-title">Pending Amount</span><div class="kpi-icon danger"><i class="fa-solid fa-circle-exclamation"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(paySum.pendingAmount)}</div>
          <div class="kpi-sub"><span class="trend-danger">Outstanding balance</span></div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-top"><span class="kpi-title">Partial Payments</span><div class="kpi-icon warning"><i class="fa-solid fa-clock-rotate-left"></i></div></div>
          <div class="kpi-value">${paySum.partialCount} Records</div>
          <div class="kpi-sub"><span class="trend-warn">Partly settled invoices</span></div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-top"><span class="kpi-title">Upcoming Payments</span><div class="kpi-icon info"><i class="fa-solid fa-calendar-check"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(paySum.upcomingAmount)}</div>
          <div class="kpi-sub"><span>Scheduled future costs</span></div>
        </div>
      `;
    }

    const tbody = document.getElementById('paymentsTableBody');
    const summaryBar = document.getElementById('paymentsBottomSummary');
    if (!tbody) return;

    const filtered = this.getFilteredData();
    const pageInfo = GZ.Utils.paginate(filtered, this.state.page, this.state.perPage);

    let fAmount = 0;
    let fPaid = 0;
    let fPending = 0;
    filtered.forEach(r => {
      fAmount += Number(r.amount) || 0;
      fPaid += Number(r.paid) || 0;
      fPending += Number(r.pending) || 0;
    });

    if (!pageInfo.items.length) {
      tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state"><i class="fa-solid fa-credit-card"></i><p>No payment records found.</p></div></td></tr>`;
    } else {
      tbody.innerHTML = pageInfo.items
        .map(
          r => `
        <tr>
          <td>${GZ.Utils.formatDate(r.date)}</td>
          <td><strong>${GZ.Utils.escapeHtml(r.personVendor)}</strong></td>
          <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(r.type)}</span></td>
          <td>${GZ.Utils.escapeHtml(r.description)}</td>
          <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(r.amount)}</td>
          <td class="mono" style="color:var(--success);font-weight:600;">${GZ.Utils.formatINR(r.paid)}</td>
          <td class="mono" style="color:var(--danger);font-weight:600;">${GZ.Utils.formatINR(r.pending)}</td>
          <td>${GZ.Utils.escapeHtml(r.paymentMethod)}</td>
          <td>${GZ.Utils.badge(r.status)}</td>
          <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${GZ.Utils.escapeHtml(r.notes)}">${GZ.Utils.escapeHtml(r.notes || '—')}</td>
          <td>
            <div class="row-actions">
              ${r.status !== 'Paid' ? `<button class="action-icon-btn" style="color:var(--success);" title="Mark Full Paid" onclick="GZ.Payments.markPaid('${r.id}')"><i class="fa-solid fa-check"></i></button>` : ''}
              <button class="action-icon-btn" title="Edit" onclick="GZ.Payments.openFormModal('${r.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="action-icon-btn delete" title="Delete" onclick="GZ.Payments.confirmDelete('${r.id}')"><i class="fa-solid fa-trash"></i></button>
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
          <span>Total Amount: <strong>${GZ.Utils.formatINR(fAmount)}</strong></span>
          <span>Paid: <strong style="color:var(--success);">${GZ.Utils.formatINR(fPaid)}</strong></span>
          <span>Pending: <strong style="color:var(--danger);">${GZ.Utils.formatINR(fPending)}</strong></span>
        </div>
        ${GZ.Utils.renderPagination(pageInfo, 'GZ.Payments.goToPage')}
      `;
    }
  },

  markPaid(id) {
    const item = GZ.State.get('payments').find(r => r.id === id);
    if (!item) return;
    GZ.State.updateItem('payments', id, {
      paid: Number(item.amount) || 0,
      pending: 0,
      status: 'Paid'
    });
    GZ.Utils.toast(`Payment ${id} (${item.personVendor}) marked as Paid!`, 'success');
  },

  openFormModal(editId = null) {
    const existing = editId ? GZ.State.get('payments').find(r => r.id === editId) : null;
    const isEdit = Boolean(existing);
    const today = new Date().toISOString().slice(0, 10);

    GZ.Utils.openModal({
      title: isEdit ? `Edit Payment Record (${existing.id})` : `+ Add Payment Record`,
      bodyHtml: `
        <form class="form-grid" onsubmit="return false;">
          <div class="form-group">
            <label>Date *</label>
            <input type="date" id="payFormDate" class="form-control" required value="${existing ? existing.date : today}">
          </div>
          <div class="form-group">
            <label>Person / Vendor *</label>
            <input type="text" id="payFormVendor" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.personVendor : '')}" placeholder="e.g. Sony Center or Partner 2">
          </div>
          <div class="form-group">
            <label>Payment Type *</label>
            <select id="payFormType" class="form-control">
              ${['Equipment Purchase', 'Investment Settlement', 'Monthly Expense', 'Marketing Expense', 'Utility Expense', 'Vendor Advance', 'Other'].map(t => `<option value="${t}" ${existing && existing.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Payment Method *</label>
            <select id="payFormMethod" class="form-control">
              ${GZ.Data.PAYMENT_METHODS.map(m => `<option value="${GZ.Utils.escapeHtml(m)}" ${existing && existing.paymentMethod === m ? 'selected' : ''}>${GZ.Utils.escapeHtml(m)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full-width">
            <label>Description *</label>
            <input type="text" id="payFormDesc" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.description : '')}" placeholder="e.g. Interior Work Settlement">
          </div>
          <div class="form-group">
            <label>Total Amount (INR ₹) *</label>
            <input type="number" id="payFormAmount" class="form-control" min="1" required value="${existing ? existing.amount : ''}" placeholder="e.g. 50000">
          </div>
          <div class="form-group">
            <label>Paid Amount (INR ₹) *</label>
            <input type="number" id="payFormPaid" class="form-control" min="0" required value="${existing ? existing.paid : ''}" placeholder="e.g. 30000">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea id="payFormNotes" class="form-control" placeholder="Transaction ID, pending due date...">${GZ.Utils.escapeHtml(existing ? existing.notes : '')}</textarea>
          </div>
        </form>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="savePaymentBtn"><i class="fa-solid fa-check"></i> Save Payment</button>
      `,
      onMount: () => {
        document.getElementById('savePaymentBtn').onclick = () => {
          const date = document.getElementById('payFormDate').value;
          const personVendor = document.getElementById('payFormVendor').value.trim();
          const type = document.getElementById('payFormType').value;
          const paymentMethod = document.getElementById('payFormMethod').value;
          const description = document.getElementById('payFormDesc').value.trim();
          const amount = Number(document.getElementById('payFormAmount').value);
          const paidRaw = Number(document.getElementById('payFormPaid').value);
          const notes = document.getElementById('payFormNotes').value.trim();

          if (!date || !personVendor || !description || !(amount > 0)) {
            GZ.Utils.toast('Please fill all required payment fields.', 'warning');
            return;
          }

          const paid = Math.min(amount, Math.max(0, isNaN(paidRaw) ? amount : paidRaw));
          const pending = Math.max(0, amount - paid);
          const status = pending === 0 ? 'Paid' : paid === 0 ? 'Pending' : 'Partial';

          const payload = { date, personVendor, type, description, amount, paid, pending, paymentMethod, status, notes };
          if (isEdit) {
            GZ.State.updateItem('payments', editId, payload);
            GZ.Utils.toast(`Payment ${editId} updated.`, 'success');
          } else {
            const id = GZ.Utils.generateId('PAY', GZ.State.get('payments'));
            GZ.State.addItem('payments', { id, ...payload });
            GZ.Utils.toast(`Payment ${id} added.`, 'success');
          }
          GZ.Utils.closeModal();
        };
      }
    });
  },

  confirmDelete(id) {
    const item = GZ.State.get('payments').find(r => r.id === id);
    if (!item) return;
    GZ.Utils.confirmDialog({
      title: 'Delete Payment Record',
      message: `Delete payment entry for <strong>${GZ.Utils.escapeHtml(item.personVendor)}</strong> (${GZ.Utils.formatINR(item.amount)})?`,
      onConfirm: () => {
        GZ.State.deleteItem('payments', id);
        GZ.Utils.toast(`Payment ${id} deleted.`, 'info');
      }
    });
  },

  exportCSV() {
    GZ.Utils.exportCSV('gamezone_payments.csv', this.getFilteredData(), [
      { key: 'id', label: 'ID' },
      { key: 'date', label: 'Date' },
      { key: 'personVendor', label: 'PersonVendor' },
      { key: 'type', label: 'Type' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount' },
      { key: 'paid', label: 'Paid' },
      { key: 'pending', label: 'Pending' },
      { key: 'paymentMethod', label: 'PaymentMethod' },
      { key: 'status', label: 'Status' },
      { key: 'notes', label: 'Notes' }
    ]);
  },

  importCSV() {
    GZ.Utils.triggerCSVImport(
      [
        { key: 'date', label: 'Date', default: new Date().toISOString().slice(0, 10) },
        { key: 'personVendor', label: 'PersonVendor', default: 'Vendor' },
        { key: 'type', label: 'Type', default: 'Equipment Purchase' },
        { key: 'description', label: 'Description', default: 'Imported Payment' },
        { key: 'amount', label: 'Amount', type: 'number', default: 10000 },
        { key: 'paid', label: 'Paid', type: 'number', default: 10000 },
        { key: 'paymentMethod', label: 'PaymentMethod', default: 'UPI' },
        { key: 'notes', label: 'Notes', default: '' }
      ],
      records => {
        const list = GZ.State.get('payments');
        records.forEach(r => {
          const id = GZ.Utils.generateId('PAY', list);
          const amt = Number(r.amount) || 0;
          const paid = Math.min(amt, Math.max(0, Number(r.paid) || 0));
          const pending = Math.max(0, amt - paid);
          const status = pending === 0 ? 'Paid' : paid === 0 ? 'Pending' : 'Partial';
          list.unshift({ id, ...r, amount: amt, paid, pending, status });
        });
        GZ.State.set('payments', list);
        GZ.Utils.toast(`Imported ${records.length} payment records!`, 'success');
      }
    );
  }
};
