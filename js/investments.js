/* ==========================================================================
   GameZone Business Management — Investments Module (js/investments.js)
   Spreadsheet-style CRUD, Sorting, Filtering, Pagination, CSV Import/Export
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Investments = {
  state: {
    search: '',
    dateFrom: '',
    dateTo: '',
    investor: '',
    category: '',
    status: '',
    method: '',
    sortKey: 'date',
    sortDir: 'desc',
    page: 1,
    perPage: 8,
    showFilters: false
  },

  init() {
    this.populateFilterOptions();
  },

  populateFilterOptions() {
    const invSelect = document.getElementById('invFilterInvestor');
    const catSelect = document.getElementById('invFilterCategory');
    const methodSelect = document.getElementById('invFilterMethod');

    if (invSelect) {
      const partners = GZ.Calc.getPartnersSummary().partners.map(p => p.name);
      invSelect.innerHTML = `<option value="">All Investors</option>` +
        partners.map(p => `<option value="${GZ.Utils.escapeHtml(p)}">${GZ.Utils.escapeHtml(p)}</option>`).join('');
      invSelect.value = this.state.investor;
    }

    if (catSelect) {
      catSelect.innerHTML = `<option value="">All Categories</option>` +
        GZ.Data.INVESTMENT_CATEGORIES.map(c => `<option value="${GZ.Utils.escapeHtml(c)}">${GZ.Utils.escapeHtml(c)}</option>`).join('');
      catSelect.value = this.state.category;
    }

    if (methodSelect) {
      methodSelect.innerHTML = `<option value="">All Methods</option>` +
        GZ.Data.PAYMENT_METHODS.map(m => `<option value="${GZ.Utils.escapeHtml(m)}">${GZ.Utils.escapeHtml(m)}</option>`).join('');
      methodSelect.value = this.state.method;
    }
  },

  toggleFilters() {
    this.state.showFilters = !this.state.showFilters;
    const bar = document.getElementById('invFilterBar');
    if (bar) bar.classList.toggle('hidden', !this.state.showFilters);
  },

  applyFilters() {
    this.state.dateFrom = (document.getElementById('invFilterFrom')?.value || '').trim();
    this.state.dateTo = (document.getElementById('invFilterTo')?.value || '').trim();
    this.state.investor = (document.getElementById('invFilterInvestor')?.value || '').trim();
    this.state.category = (document.getElementById('invFilterCategory')?.value || '').trim();
    this.state.status = (document.getElementById('invFilterStatus')?.value || '').trim();
    this.state.method = (document.getElementById('invFilterMethod')?.value || '').trim();
    this.state.page = 1;
    this.render();
  },

  resetFilters() {
    this.state.search = '';
    this.state.dateFrom = '';
    this.state.dateTo = '';
    this.state.investor = '';
    this.state.category = '';
    this.state.status = '';
    this.state.method = '';
    this.state.page = 1;

    ['invSearchInput', 'invFilterFrom', 'invFilterTo', 'invFilterInvestor', 'invFilterCategory', 'invFilterStatus', 'invFilterMethod'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this.render();
  },

  onSearch(val) {
    this.state.search = val.trim().toLowerCase();
    this.state.page = 1;
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
    const all = GZ.State.get('investments');
    const s = this.state;

    const filtered = all.filter(item => {
      if (s.search) {
        const hay = `${item.id} ${item.investor} ${item.category} ${item.description} ${item.paymentMethod} ${item.status} ${item.notes}`.toLowerCase();
        if (!hay.includes(s.search)) return false;
      }
      if (s.dateFrom && item.date < s.dateFrom) return false;
      if (s.dateTo && item.date > s.dateTo) return false;
      if (s.investor && item.investor !== s.investor) return false;
      if (s.category && item.category !== s.category) return false;
      if (s.status && item.status !== s.status) return false;
      if (s.method && item.paymentMethod !== s.method) return false;
      return true;
    });

    return GZ.Utils.sortData(filtered, s.sortKey, s.sortDir);
  },

  render() {
    this.populateFilterOptions();
    const tbody = document.getElementById('investmentsTableBody');
    const tfoot = document.getElementById('investmentsTableFoot');
    const summaryBar = document.getElementById('investmentsBottomSummary');
    if (!tbody) return;

    const filtered = this.getFilteredData();
    const pageInfo = GZ.Utils.paginate(filtered, this.state.page, this.state.perPage);

    let filteredTotal = 0;
    let filteredPaid = 0;
    let filteredPending = 0;

    filtered.forEach(r => {
      const res = GZ.Calc.resolveAmounts(r);
      filteredTotal += res.amount;
      filteredPaid += res.paid;
      filteredPending += res.pending;
    });

    if (!pageInfo.items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11">
            <div class="empty-state">
              <i class="fa-solid fa-sack-dollar"></i>
              <p>No matching investment records found.</p>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = pageInfo.items
        .map(r => {
          const res = GZ.Calc.resolveAmounts(r);
          return `
            <tr>
              <td class="mono" style="font-weight:600;color:var(--primary);">${GZ.Utils.escapeHtml(r.id)}</td>
              <td>${GZ.Utils.formatDate(r.date)}</td>
              <td><strong>${GZ.Utils.escapeHtml(r.investor)}</strong></td>
              <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(r.category)}</span></td>
              <td>${GZ.Utils.escapeHtml(r.description)}</td>
              <td class="mono" style="font-weight:700;">
                ${GZ.Utils.formatINR(res.amount)}
                ${r.status === 'Partial' ? `<div style="font-size:0.7rem;color:var(--text-muted);">Paid: ${GZ.Utils.formatINR(res.paid)}</div>` : ''}
              </td>
              <td>${GZ.Utils.escapeHtml(r.paymentMethod)}</td>
              <td>${GZ.Utils.badge(r.status)}</td>
              <td>${GZ.Utils.formatDate(r.paymentDate)}</td>
              <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${GZ.Utils.escapeHtml(r.notes)}">
                ${GZ.Utils.escapeHtml(r.notes || '—')}
              </td>
              <td>
                <div class="row-actions">
                  <button class="action-icon-btn" title="View Details" onclick="GZ.Investments.openViewModal('${r.id}')"><i class="fa-solid fa-eye"></i></button>
                  <button class="action-icon-btn" title="Edit Record" onclick="GZ.Investments.openFormModal('${r.id}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="action-icon-btn delete" title="Delete Record" onclick="GZ.Investments.confirmDelete('${r.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('');
    }

    if (tfoot) {
      tfoot.innerHTML = `
        <tr>
          <td colspan="5">Filtered Column Total (${filtered.length} records)</td>
          <td class="mono">${GZ.Utils.formatINR(filteredTotal)}</td>
          <td colspan="5">Paid: <span style="color:var(--success);">${GZ.Utils.formatINR(filteredPaid)}</span> &nbsp;|&nbsp; Pending: <span style="color:var(--danger);">${GZ.Utils.formatINR(filteredPending)}</span></td>
        </tr>
      `;
    }

    if (summaryBar) {
      summaryBar.innerHTML = `
        <div class="totals-pills">
          <span>Total Investment: <strong style="color:var(--primary);">${GZ.Utils.formatINR(filteredTotal)}</strong></span>
          <span>Paid: <strong style="color:var(--success);">${GZ.Utils.formatINR(filteredPaid)}</strong></span>
          <span>Pending: <strong style="color:var(--danger);">${GZ.Utils.formatINR(filteredPending)}</strong></span>
        </div>
        ${GZ.Utils.renderPagination(pageInfo, 'GZ.Investments.goToPage')}
      `;
    }
  },

  openFormModal(editId = null) {
    const existing = editId ? GZ.State.get('investments').find(r => r.id === editId) : null;
    const isEdit = Boolean(existing);
    const today = new Date().toISOString().slice(0, 10);

    const partnerNames = Array.from(
      new Set([
        'Amit',
        ...GZ.State.get('partners').map(p => p.name),
        ...(existing ? [existing.investor] : [])
      ])
    );

    const categories = Array.from(
      new Set([...GZ.Data.INVESTMENT_CATEGORIES, ...(existing ? [existing.category] : [])])
    );

    const statusVal = existing ? existing.status : 'Paid';
    const paidVal = existing ? (existing.paidAmount ?? existing.amount) : '';

    GZ.Utils.openModal({
      title: isEdit
        ? `<i class="fa-solid fa-pen-to-square" style="color:var(--primary);margin-right:6px;"></i> Edit Investment (${existing.id})`
        : `<i class="fa-solid fa-circle-plus" style="color:var(--primary);margin-right:6px;"></i> Add Investment`,
      bodyHtml: `
        <form id="investmentModalForm" class="form-grid" onsubmit="return false;">
          <div class="form-group">
            <label>Investor Name *</label>
            <input type="text" list="investorDatalist" id="invFormInvestor" class="form-control" required
              value="${GZ.Utils.escapeHtml(existing ? existing.investor : 'Amit')}" placeholder="e.g. Amit or Partner 2">
            <datalist id="investorDatalist">
              ${partnerNames.map(n => `<option value="${GZ.Utils.escapeHtml(n)}">`).join('')}
            </datalist>
          </div>
          <div class="form-group">
            <label>Date *</label>
            <input type="date" id="invFormDate" class="form-control" required value="${existing ? existing.date : today}">
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select id="invFormCategory" class="form-control" required>
              ${categories.map(c => `<option value="${GZ.Utils.escapeHtml(c)}" ${existing && existing.category === c ? 'selected' : ''}>${GZ.Utils.escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Amount (INR ₹) *</label>
            <input type="number" id="invFormAmount" class="form-control" min="1" step="1" required
              value="${existing ? existing.amount : ''}" placeholder="e.g. 50000">
          </div>
          <div class="form-group full-width">
            <label>Description *</label>
            <input type="text" id="invFormDesc" class="form-control" required
              value="${GZ.Utils.escapeHtml(existing ? existing.description : '')}" placeholder="e.g. PS5 Console or 55 Inch TV">
          </div>
          <div class="form-group">
            <label>Payment Method *</label>
            <select id="invFormMethod" class="form-control">
              ${GZ.Data.PAYMENT_METHODS.map(m => `<option value="${GZ.Utils.escapeHtml(m)}" ${existing && existing.paymentMethod === m ? 'selected' : ''}>${GZ.Utils.escapeHtml(m)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Payment Status *</label>
            <select id="invFormStatus" class="form-control">
              ${GZ.Data.PAYMENT_STATUSES.map(st => `<option value="${st}" ${statusVal === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
          <div class="form-group ${statusVal === 'Partial' ? '' : 'hidden'}" id="invPartialPaidGroup">
            <label>Amount Already Paid (₹)</label>
            <input type="number" id="invFormPaidAmount" class="form-control" min="0" step="1" value="${paidVal}">
          </div>
          <div class="form-group">
            <label>Payment Date</label>
            <input type="date" id="invFormPayDate" class="form-control" value="${existing ? (existing.paymentDate || existing.date) : today}">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea id="invFormNotes" class="form-control" placeholder="Invoice number, warranty details, pending balance info...">${GZ.Utils.escapeHtml(existing ? existing.notes : '')}</textarea>
          </div>
        </form>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="saveInvestmentBtn">
          <i class="fa-solid fa-check"></i> Save Investment
        </button>
      `,
      onMount: () => {
        const statusSel = document.getElementById('invFormStatus');
        const partialGrp = document.getElementById('invPartialPaidGroup');
        statusSel.onchange = () => {
          partialGrp.classList.toggle('hidden', statusSel.value !== 'Partial');
        };

        document.getElementById('saveInvestmentBtn').onclick = () => {
          const investor = document.getElementById('invFormInvestor').value.trim();
          const date = document.getElementById('invFormDate').value;
          const category = document.getElementById('invFormCategory').value;
          const description = document.getElementById('invFormDesc').value.trim();
          const amount = Number(document.getElementById('invFormAmount').value);
          const paymentMethod = document.getElementById('invFormMethod').value;
          const status = document.getElementById('invFormStatus').value;
          const paymentDate = document.getElementById('invFormPayDate').value;
          const notes = document.getElementById('invFormNotes').value.trim();

          if (!investor || !date || !description || !(amount > 0)) {
            GZ.Utils.toast('Please fill all required fields with a valid amount.', 'warning');
            return;
          }

          let paidAmount = amount;
          if (status === 'Pending') paidAmount = 0;
          else if (status === 'Partial') {
            paidAmount = Number(document.getElementById('invFormPaidAmount').value) || Math.round(amount / 2);
            paidAmount = Math.min(amount, Math.max(0, paidAmount));
          }

          const payload = {
            investor,
            date,
            category,
            description,
            amount,
            paidAmount,
            paymentMethod,
            status,
            paymentDate,
            notes
          };

          if (isEdit) {
            GZ.State.updateItem('investments', editId, payload);
            GZ.Utils.toast(`Investment ${editId} updated successfully.`, 'success');
          } else {
            const id = GZ.Utils.generateId('INV', GZ.State.get('investments'));
            GZ.State.addItem('investments', { id, ...payload });
            GZ.Utils.toast(`New investment (${id}) added by ${investor}.`, 'success');
          }

          GZ.Utils.closeModal();
        };
      }
    });
  },

  openViewModal(id) {
    const item = GZ.State.get('investments').find(r => r.id === id);
    if (!item) return;
    const res = GZ.Calc.resolveAmounts(item);

    GZ.Utils.openModal({
      title: `<i class="fa-solid fa-file-lines" style="color:var(--primary);margin-right:6px;"></i> Investment Details — ${item.id}`,
      bodyHtml: `
        <div class="detail-grid">
          <div class="detail-item"><span>Record ID</span><strong class="mono">${GZ.Utils.escapeHtml(item.id)}</strong></div>
          <div class="detail-item"><span>Date</span><strong>${GZ.Utils.formatDate(item.date)}</strong></div>
          <div class="detail-item"><span>Investor</span><strong>${GZ.Utils.escapeHtml(item.investor)}</strong></div>
          <div class="detail-item"><span>Category</span><strong>${GZ.Utils.escapeHtml(item.category)}</strong></div>
          <div class="detail-item" style="grid-column:1/-1;"><span>Description</span><strong>${GZ.Utils.escapeHtml(item.description)}</strong></div>
          <div class="detail-item"><span>Total Amount</span><strong class="mono">${GZ.Utils.formatINR(res.amount)}</strong></div>
          <div class="detail-item"><span>Paid / Pending</span><strong class="mono" style="color:var(--success);">${GZ.Utils.formatINR(res.paid)}</strong> / <strong class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(res.pending)}</strong></div>
          <div class="detail-item"><span>Payment Method</span><strong>${GZ.Utils.escapeHtml(item.paymentMethod)}</strong></div>
          <div class="detail-item"><span>Status & Payment Date</span>${GZ.Utils.badge(item.status)} <small>(${GZ.Utils.formatDate(item.paymentDate)})</small></div>
          <div class="detail-item" style="grid-column:1/-1;"><span>Notes</span><strong>${GZ.Utils.escapeHtml(item.notes || 'No extra notes')}</strong></div>
        </div>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Close</button>
        <button type="button" class="btn btn-primary" onclick="GZ.Utils.closeModal();GZ.Investments.openFormModal('${item.id}')">
          <i class="fa-solid fa-pen"></i> Edit
        </button>
      `
    });
  },

  confirmDelete(id) {
    const item = GZ.State.get('investments').find(r => r.id === id);
    if (!item) return;
    GZ.Utils.confirmDialog({
      title: 'Delete Investment',
      message: `Are you sure you want to delete investment <strong>${GZ.Utils.escapeHtml(item.description)}</strong> (${GZ.Utils.formatINR(item.amount)}) by ${GZ.Utils.escapeHtml(item.investor)}?`,
      onConfirm: () => {
        GZ.State.deleteItem('investments', id);
        GZ.Utils.toast(`Investment ${id} deleted.`, 'info');
      }
    });
  },

  exportCSV() {
    const rows = this.getFilteredData();
    GZ.Utils.exportCSV('gamezone_investments.csv', rows, [
      { key: 'id', label: 'ID' },
      { key: 'date', label: 'Date' },
      { key: 'investor', label: 'Investor' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount' },
      { key: 'paidAmount', label: 'PaidAmount' },
      { key: 'paymentMethod', label: 'PaymentMethod' },
      { key: 'status', label: 'Status' },
      { key: 'paymentDate', label: 'PaymentDate' },
      { key: 'notes', label: 'Notes' }
    ]);
  },

  importCSV() {
    GZ.Utils.triggerCSVImport(
      [
        { key: 'date', label: 'Date', default: new Date().toISOString().slice(0, 10) },
        { key: 'investor', label: 'Investor', default: 'Amit' },
        { key: 'category', label: 'Category', default: 'PS5' },
        { key: 'description', label: 'Description', default: 'Imported Investment' },
        { key: 'amount', label: 'Amount', type: 'number', default: 0 },
        { key: 'paymentMethod', label: 'PaymentMethod', default: 'UPI' },
        { key: 'status', label: 'Status', default: 'Paid' },
        { key: 'paymentDate', label: 'PaymentDate', default: new Date().toISOString().slice(0, 10) },
        { key: 'notes', label: 'Notes', default: '' }
      ],
      records => {
        const list = GZ.State.get('investments');
        records.forEach(r => {
          const id = GZ.Utils.generateId('INV', list);
          const amt = Number(r.amount) || 0;
          const paidAmount = r.status === 'Pending' ? 0 : r.status === 'Partial' ? Math.round(amt / 2) : amt;
          list.unshift({ id, ...r, amount: amt, paidAmount });
        });
        GZ.State.set('investments', list);
        GZ.Utils.toast(`Imported ${records.length} investment records successfully!`, 'success');
      }
    );
  }
};
