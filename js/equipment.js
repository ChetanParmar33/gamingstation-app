/* ==========================================================================
   GameZone Business Management — Equipment / Asset Module (js/equipment.js)
   Tracks GameZone hardware, consoles, displays, furniture & total asset value
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Equipment = {
  state: {
    search: '',
    category: '',
    condition: '',
    owner: '',
    sortKey: 'purchaseDate',
    sortDir: 'desc',
    page: 1,
    perPage: 8
  },

  populateFilterOptions() {
    const catSel = document.getElementById('eqpFilterCategory');
    const ownSel = document.getElementById('eqpFilterOwner');

    if (catSel && catSel.options.length <= 1) {
      catSel.innerHTML = `<option value="">All Categories</option>` +
        GZ.Data.EQUIPMENT_CATEGORIES.map(c => `<option value="${GZ.Utils.escapeHtml(c)}">${GZ.Utils.escapeHtml(c)}</option>`).join('');
    }
    if (ownSel) {
      const owners = Array.from(new Set(['Amit', ...GZ.State.get('partners').map(p => p.name), ...GZ.State.get('equipment').map(e => e.owner)]));
      ownSel.innerHTML = `<option value="">All Owners</option>` +
        owners.map(o => `<option value="${GZ.Utils.escapeHtml(o)}">${GZ.Utils.escapeHtml(o)}</option>`).join('');
      ownSel.value = this.state.owner;
    }
  },

  onSearch(val) {
    this.state.search = val.trim().toLowerCase();
    this.state.page = 1;
    this.render();
  },

  applyFilters() {
    this.state.category = (document.getElementById('eqpFilterCategory')?.value || '').trim();
    this.state.condition = (document.getElementById('eqpFilterCondition')?.value || '').trim();
    this.state.owner = (document.getElementById('eqpFilterOwner')?.value || '').trim();
    this.state.page = 1;
    this.render();
  },

  resetFilters() {
    this.state.search = '';
    this.state.category = '';
    this.state.condition = '';
    this.state.owner = '';
    this.state.page = 1;
    ['eqpSearchInput', 'eqpFilterCategory', 'eqpFilterCondition', 'eqpFilterOwner'].forEach(id => {
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
    const all = GZ.State.get('equipment').map(item => ({
      ...item,
      totalValue: (Number(item.quantity) || 0) * (Number(item.purchasePrice) || 0)
    }));

    const s = this.state;
    const filtered = all.filter(item => {
      if (s.search) {
        const hay = `${item.id} ${item.name} ${item.category} ${item.location} ${item.owner} ${item.condition} ${item.warranty} ${item.notes}`.toLowerCase();
        if (!hay.includes(s.search)) return false;
      }
      if (s.category && item.category !== s.category) return false;
      if (s.condition && item.condition !== s.condition) return false;
      if (s.owner && item.owner !== s.owner) return false;
      return true;
    });

    return GZ.Utils.sortData(filtered, s.sortKey, s.sortDir);
  },

  render() {
    this.populateFilterOptions();
    const eqpSum = GZ.Calc.getEquipmentSummary();

    const kpiEl = document.getElementById('equipmentKpiGrid');
    if (kpiEl) {
      const healthyUnits = (eqpSum.byCondition.New || 0) + (eqpSum.byCondition.Good || 0);
      const issueUnits = (eqpSum.byCondition['Needs Repair'] || 0) + (eqpSum.byCondition.Damaged || 0);
      kpiEl.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-top"><span class="kpi-title">Total Asset Value</span><div class="kpi-icon"><i class="fa-solid fa-gamepad"></i></div></div>
          <div class="kpi-value">${GZ.Utils.formatINR(eqpSum.totalValue)}</div>
          <div class="kpi-sub"><span>Dynamic valuation across ${eqpSum.count} asset types</span></div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-top"><span class="kpi-title">Total Equipment Units</span><div class="kpi-icon info"><i class="fa-solid fa-boxes-stacked"></i></div></div>
          <div class="kpi-value">${eqpSum.totalUnits}</div>
          <div class="kpi-sub"><span>Consoles, displays, chairs & accessories</span></div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-top"><span class="kpi-title">Operational (New / Good)</span><div class="kpi-icon success"><i class="fa-solid fa-shield-heart"></i></div></div>
          <div class="kpi-value">${healthyUnits} Units</div>
          <div class="kpi-sub"><span class="trend-up">Ready for gaming bays</span></div>
        </div>
        <div class="kpi-card ${issueUnits > 0 ? 'kpi-danger' : 'kpi-warning'}">
          <div class="kpi-top"><span class="kpi-title">Needs Repair / Damaged</span><div class="kpi-icon warning"><i class="fa-solid fa-screwdriver-wrench"></i></div></div>
          <div class="kpi-value">${issueUnits} Units</div>
          <div class="kpi-sub"><span>Maintenance attention</span></div>
        </div>
      `;
    }

    const tbody = document.getElementById('equipmentTableBody');
    const summaryBar = document.getElementById('equipmentBottomSummary');
    if (!tbody) return;

    const filtered = this.getFilteredData();
    const pageInfo = GZ.Utils.paginate(filtered, this.state.page, this.state.perPage);

    const fTotalVal = filtered.reduce((acc, r) => acc + r.totalValue, 0);
    const fTotalQty = filtered.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);

    if (!pageInfo.items.length) {
      tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state"><i class="fa-solid fa-gamepad"></i><p>No equipment assets found.</p></div></td></tr>`;
    } else {
      tbody.innerHTML = pageInfo.items
        .map(
          r => `
        <tr>
          <td><strong>${GZ.Utils.escapeHtml(r.name)}</strong><div style="font-size:0.72rem;color:var(--text-muted);" class="mono">${GZ.Utils.escapeHtml(r.id)}</div></td>
          <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(r.category)}</span></td>
          <td class="mono" style="font-weight:700;">${r.quantity}</td>
          <td>${GZ.Utils.formatDate(r.purchaseDate)}</td>
          <td class="mono">${GZ.Utils.formatINR(r.purchasePrice)}</td>
          <td class="mono" style="font-weight:700;color:var(--primary);">${GZ.Utils.formatINR(r.totalValue)}</td>
          <td>${GZ.Utils.badge(r.condition)}</td>
          <td>${GZ.Utils.escapeHtml(r.warranty || '—')}</td>
          <td>${GZ.Utils.escapeHtml(r.location || '—')}</td>
          <td><strong>${GZ.Utils.escapeHtml(r.owner || 'Amit')}</strong></td>
          <td style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${GZ.Utils.escapeHtml(r.notes)}">${GZ.Utils.escapeHtml(r.notes || '—')}</td>
          <td>
            <div class="row-actions">
              <button class="action-icon-btn" title="View" onclick="GZ.Equipment.openViewModal('${r.id}')"><i class="fa-solid fa-eye"></i></button>
              <button class="action-icon-btn" title="Edit" onclick="GZ.Equipment.openFormModal('${r.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="action-icon-btn delete" title="Delete" onclick="GZ.Equipment.confirmDelete('${r.id}')"><i class="fa-solid fa-trash"></i></button>
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
          <span>Total Units: <strong>${fTotalQty}</strong></span>
          <span>Total Asset Valuation: <strong style="color:var(--primary);">${GZ.Utils.formatINR(fTotalVal)}</strong></span>
        </div>
        ${GZ.Utils.renderPagination(pageInfo, 'GZ.Equipment.goToPage')}
      `;
    }
  },

  openFormModal(editId = null) {
    const existing = editId ? GZ.State.get('equipment').find(r => r.id === editId) : null;
    const isEdit = Boolean(existing);
    const today = new Date().toISOString().slice(0, 10);

    GZ.Utils.openModal({
      title: isEdit ? `Edit Equipment Asset (${existing.id})` : `+ Add Equipment Asset`,
      bodyHtml: `
        <form class="form-grid" onsubmit="return false;">
          <div class="form-group">
            <label>Equipment Name *</label>
            <input type="text" id="eqpFormName" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.name : '')}" placeholder="e.g. PS5, 55&quot; TV, G29 Steering Wheel">
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select id="eqpFormCategory" class="form-control">
              ${GZ.Data.EQUIPMENT_CATEGORIES.map(c => `<option value="${GZ.Utils.escapeHtml(c)}" ${existing && existing.category === c ? 'selected' : ''}>${GZ.Utils.escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Quantity *</label>
            <input type="number" id="eqpFormQty" class="form-control" min="1" required value="${existing ? existing.quantity : 1}">
          </div>
          <div class="form-group">
            <label>Unit Purchase Price (INR ₹) *</label>
            <input type="number" id="eqpFormPrice" class="form-control" min="1" required value="${existing ? existing.purchasePrice : ''}" placeholder="e.g. 50000">
          </div>
          <div class="form-group">
            <label>Purchase Date *</label>
            <input type="date" id="eqpFormDate" class="form-control" required value="${existing ? existing.purchaseDate : today}">
          </div>
          <div class="form-group">
            <label>Condition *</label>
            <select id="eqpFormCondition" class="form-control">
              ${GZ.Data.EQUIPMENT_CONDITIONS.map(c => `<option value="${c}" ${existing && existing.condition === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Warranty Info</label>
            <input type="text" id="eqpFormWarranty" class="form-control" value="${GZ.Utils.escapeHtml(existing ? existing.warranty : '1 Year Warranty')}" placeholder="e.g. 1 Year Sony India">
          </div>
          <div class="form-group">
            <label>Location / Zone</label>
            <input type="text" id="eqpFormLocation" class="form-control" value="${GZ.Utils.escapeHtml(existing ? existing.location : 'Main Gaming Hall')}" placeholder="e.g. Console Bay 1–4">
          </div>
          <div class="form-group full-width">
            <label>Owner / Funded By</label>
            <input type="text" id="eqpFormOwner" class="form-control" value="${GZ.Utils.escapeHtml(existing ? existing.owner : 'Amit')}" placeholder="e.g. Amit or Partner 2">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea id="eqpFormNotes" class="form-control" placeholder="Serial numbers, accessories included...">${GZ.Utils.escapeHtml(existing ? existing.notes : '')}</textarea>
          </div>
        </form>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="saveEquipmentBtn"><i class="fa-solid fa-check"></i> Save Asset</button>
      `,
      onMount: () => {
        document.getElementById('saveEquipmentBtn').onclick = () => {
          const name = document.getElementById('eqpFormName').value.trim();
          const category = document.getElementById('eqpFormCategory').value;
          const quantity = Number(document.getElementById('eqpFormQty').value);
          const purchasePrice = Number(document.getElementById('eqpFormPrice').value);
          const purchaseDate = document.getElementById('eqpFormDate').value;
          const condition = document.getElementById('eqpFormCondition').value;
          const warranty = document.getElementById('eqpFormWarranty').value.trim();
          const location = document.getElementById('eqpFormLocation').value.trim();
          const owner = document.getElementById('eqpFormOwner').value.trim() || 'Amit';
          const notes = document.getElementById('eqpFormNotes').value.trim();

          if (!name || !(quantity > 0) || !(purchasePrice > 0)) {
            GZ.Utils.toast('Please enter valid equipment name, quantity and price.', 'warning');
            return;
          }

          const payload = { name, category, quantity, purchasePrice, purchaseDate, condition, warranty, location, owner, notes };
          if (isEdit) {
            GZ.State.updateItem('equipment', editId, payload);
            GZ.Utils.toast(`Equipment ${editId} updated.`, 'success');
          } else {
            const id = GZ.Utils.generateId('EQP', GZ.State.get('equipment'));
            GZ.State.addItem('equipment', { id, ...payload });
            GZ.Utils.toast(`Equipment ${name} added to assets.`, 'success');
          }
          GZ.Utils.closeModal();
        };
      }
    });
  },

  openViewModal(id) {
    const item = GZ.State.get('equipment').find(r => r.id === id);
    if (!item) return;
    const totalVal = (Number(item.quantity) || 0) * (Number(item.purchasePrice) || 0);

    GZ.Utils.openModal({
      title: `Asset Details — ${item.name}`,
      bodyHtml: `
        <div class="detail-grid">
          <div class="detail-item"><span>Asset ID</span><strong class="mono">${GZ.Utils.escapeHtml(item.id)}</strong></div>
          <div class="detail-item"><span>Category</span><strong>${GZ.Utils.escapeHtml(item.category)}</strong></div>
          <div class="detail-item"><span>Quantity</span><strong class="mono">${item.quantity} Units</strong></div>
          <div class="detail-item"><span>Unit Price</span><strong class="mono">${GZ.Utils.formatINR(item.purchasePrice)}</strong></div>
          <div class="detail-item"><span>Total Asset Value</span><strong class="mono" style="color:var(--primary);">${GZ.Utils.formatINR(totalVal)}</strong></div>
          <div class="detail-item"><span>Condition</span>${GZ.Utils.badge(item.condition)}</div>
          <div class="detail-item"><span>Purchase Date</span><strong>${GZ.Utils.formatDate(item.purchaseDate)}</strong></div>
          <div class="detail-item"><span>Warranty</span><strong>${GZ.Utils.escapeHtml(item.warranty || '—')}</strong></div>
          <div class="detail-item"><span>Location</span><strong>${GZ.Utils.escapeHtml(item.location || '—')}</strong></div>
          <div class="detail-item"><span>Owner</span><strong>${GZ.Utils.escapeHtml(item.owner || 'Amit')}</strong></div>
          <div class="detail-item" style="grid-column:1/-1;"><span>Notes</span><strong>${GZ.Utils.escapeHtml(item.notes || '—')}</strong></div>
        </div>
      `,
      footerHtml: `<button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Close</button>`
    });
  },

  confirmDelete(id) {
    const item = GZ.State.get('equipment').find(r => r.id === id);
    if (!item) return;
    GZ.Utils.confirmDialog({
      title: 'Delete Asset',
      message: `Remove equipment <strong>${GZ.Utils.escapeHtml(item.name)}</strong> (Qty: ${item.quantity}) from assets?`,
      onConfirm: () => {
        GZ.State.deleteItem('equipment', id);
        GZ.Utils.toast(`Equipment ${id} removed.`, 'info');
      }
    });
  },

  exportCSV() {
    GZ.Utils.exportCSV('gamezone_equipment.csv', this.getFilteredData(), [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'EquipmentName' },
      { key: 'category', label: 'Category' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'purchaseDate', label: 'PurchaseDate' },
      { key: 'purchasePrice', label: 'PurchasePrice' },
      { key: 'totalValue', label: 'TotalValue' },
      { key: 'condition', label: 'Condition' },
      { key: 'warranty', label: 'Warranty' },
      { key: 'location', label: 'Location' },
      { key: 'owner', label: 'Owner' },
      { key: 'notes', label: 'Notes' }
    ]);
  },

  importCSV() {
    GZ.Utils.triggerCSVImport(
      [
        { key: 'name', label: 'EquipmentName', default: 'Imported Asset' },
        { key: 'category', label: 'Category', default: 'Console' },
        { key: 'quantity', label: 'Quantity', type: 'number', default: 1 },
        { key: 'purchaseDate', label: 'PurchaseDate', default: new Date().toISOString().slice(0, 10) },
        { key: 'purchasePrice', label: 'PurchasePrice', type: 'number', default: 10000 },
        { key: 'condition', label: 'Condition', default: 'New' },
        { key: 'warranty', label: 'Warranty', default: '1 Year' },
        { key: 'location', label: 'Location', default: 'Main Hall' },
        { key: 'owner', label: 'Owner', default: 'Amit' },
        { key: 'notes', label: 'Notes', default: '' }
      ],
      records => {
        const list = GZ.State.get('equipment');
        records.forEach(r => {
          const id = GZ.Utils.generateId('EQP', list);
          list.unshift({ id, ...r });
        });
        GZ.State.set('equipment', list);
        GZ.Utils.toast(`Imported ${records.length} equipment records!`, 'success');
      }
    );
  }
};
