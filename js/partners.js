/* ==========================================================================
   GameZone Business Management — Partners Module (js/partners.js)
   Partner Cards, Partner Table, and Partner-wise Transaction Drilldown
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Partners = {
  render() {
    const summary = GZ.Calc.getPartnersSummary();
    const partners = summary.partners;
    const totalInvestedAll = summary.totalPartnerInvested || 1;

    // 1. Render Partner Cards
    const cardsGrid = document.getElementById('partnerCardsGrid');
    if (cardsGrid) {
      cardsGrid.innerHTML = partners
        .map(p => {
          const initials = p.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          const actualSharePct = Math.round((p.invested / totalInvestedAll) * 100);
          return `
            <div class="partner-card" onclick="GZ.Partners.openPartnerLedger('${GZ.Utils.escapeHtml(p.name)}')">
              <div class="partner-card-top">
                <div class="partner-identity">
                  <div class="partner-avatar">${GZ.Utils.escapeHtml(initials)}</div>
                  <div>
                    <h4 style="font-size:1.05rem;">${GZ.Utils.escapeHtml(p.name)}</h4>
                    <span style="font-size:0.76rem;color:var(--text-muted);">${GZ.Utils.escapeHtml(p.role || 'Partner')}</span>
                  </div>
                </div>
                <span class="badge badge-purple">Share: ${p.profitShare || actualSharePct}%</span>
              </div>
              <div class="partner-metrics-row">
                <div class="partner-metric">
                  <small>Invested</small>
                  <strong class="mono" style="color:var(--primary);">${GZ.Utils.formatINR(p.invested)}</strong>
                </div>
                <div class="partner-metric">
                  <small>Paid</small>
                  <strong class="mono" style="color:var(--success);">${GZ.Utils.formatINR(p.paid)}</strong>
                </div>
                <div class="partner-metric">
                  <small>Pending</small>
                  <strong class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(p.pending)}</strong>
                </div>
              </div>
              <div class="progress-bar-track" title="Capital contribution ratio: ${actualSharePct}% of total">
                <div class="progress-bar-fill" style="width:${Math.min(100, Math.max(6, actualSharePct))}%;"></div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:0.55rem;font-size:0.74rem;color:var(--text-muted);">
                <span>${p.txCount} transactions</span>
                <span style="color:var(--primary);font-weight:600;">Click to view ledger &rarr;</span>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // 2. Render Partner Table
    const tbody = document.getElementById('partnersTableBody');
    if (tbody) {
      let sumInv = 0;
      let sumPaid = 0;
      let sumPend = 0;
      let sumShare = 0;

      tbody.innerHTML = partners
        .map(p => {
          sumInv += p.invested;
          sumPaid += p.paid;
          sumPend += p.pending;
          sumShare += Number(p.profitShare) || 0;

          return `
            <tr style="cursor:pointer;" onclick="GZ.Partners.openPartnerLedger('${GZ.Utils.escapeHtml(p.name)}')">
              <td>
                <strong>${GZ.Utils.escapeHtml(p.name)}</strong>
                <div style="font-size:0.74rem;color:var(--text-muted);">${GZ.Utils.escapeHtml(p.phone || '')}</div>
              </td>
              <td class="mono" style="font-weight:700;color:var(--primary);">${GZ.Utils.formatINR(p.invested)}</td>
              <td class="mono" style="color:var(--success);font-weight:600;">${GZ.Utils.formatINR(p.paid)}</td>
              <td class="mono" style="color:var(--danger);font-weight:600;">${GZ.Utils.formatINR(p.pending)}</td>
              <td><span class="badge badge-purple">${p.profitShare}%</span></td>
              <td>${GZ.Utils.formatDate(p.lastPayment)}</td>
              <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${GZ.Utils.escapeHtml(p.notes)}">${GZ.Utils.escapeHtml(p.notes || '—')}</td>
              <td onclick="event.stopPropagation();">
                <div class="row-actions">
                  <button class="action-icon-btn" title="View Transactions" onclick="GZ.Partners.openPartnerLedger('${GZ.Utils.escapeHtml(p.name)}')"><i class="fa-solid fa-list-check"></i></button>
                  <button class="action-icon-btn" title="Edit Partner" onclick="GZ.Partners.openFormModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="action-icon-btn delete" title="Delete Partner" onclick="GZ.Partners.confirmDelete('${p.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('');

      const tfoot = document.getElementById('partnersTableFoot');
      if (tfoot) {
        tfoot.innerHTML = `
          <tr>
            <td>Total (${partners.length} Partners)</td>
            <td class="mono">${GZ.Utils.formatINR(sumInv)}</td>
            <td class="mono" style="color:var(--success);">${GZ.Utils.formatINR(sumPaid)}</td>
            <td class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(sumPend)}</td>
            <td><span class="badge badge-purple">${sumShare}%</span></td>
            <td colspan="3"></td>
          </tr>
        `;
      }
    }
  },

  /**
   * Open Detailed Modal showing all transactions belonging to clicked Partner
   */
  openPartnerLedger(partnerName) {
    const summary = GZ.Calc.getPartnersSummary();
    const partner = summary.partners.find(p => p.name.toLowerCase() === partnerName.toLowerCase());
    if (!partner) return;

    const txs = GZ.Utils.sortData(partner.transactions, 'date', 'desc');

    const rowsHtml = txs.length
      ? txs
          .map(
            t => `
          <tr>
            <td class="mono">${GZ.Utils.escapeHtml(t.id)}</td>
            <td>${GZ.Utils.formatDate(t.date)}</td>
            <td><span class="badge badge-purple">${GZ.Utils.escapeHtml(t.category)}</span></td>
            <td>${GZ.Utils.escapeHtml(t.description)}</td>
            <td class="mono" style="font-weight:700;">${GZ.Utils.formatINR(t.amount)}</td>
            <td class="mono" style="color:var(--success);">${GZ.Utils.formatINR(t.paid)}</td>
            <td class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(t.pending)}</td>
            <td>${GZ.Utils.badge(t.status)}</td>
          </tr>
        `
          )
          .join('')
      : `<tr><td colspan="8"><div class="empty-state"><p>No investments recorded for ${GZ.Utils.escapeHtml(partner.name)} yet.</p></div></td></tr>`;

    GZ.Utils.openModal({
      title: `<i class="fa-solid fa-user-shield" style="color:var(--primary);margin-right:6px;"></i> ${GZ.Utils.escapeHtml(partner.name)} — Complete Transaction Ledger`,
      size: 'lg',
      bodyHtml: `
        <div class="detail-grid detail-grid-4">
          <div class="detail-item"><span>Total Invested</span><strong class="mono" style="color:var(--primary);">${GZ.Utils.formatINR(partner.invested)}</strong></div>
          <div class="detail-item"><span>Paid Amount</span><strong class="mono" style="color:var(--success);">${GZ.Utils.formatINR(partner.paid)}</strong></div>
          <div class="detail-item"><span>Pending Amount</span><strong class="mono" style="color:var(--danger);">${GZ.Utils.formatINR(partner.pending)}</strong></div>
          <div class="detail-item"><span>Profit Share</span><strong>${partner.profitShare}%</strong></div>
        </div>
        <div class="table-responsive" style="border:1px solid var(--border);border-radius:10px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Close</button>
        <button type="button" class="btn btn-primary" onclick="GZ.Utils.closeModal();GZ.Investments.openFormModal()">
          <i class="fa-solid fa-plus"></i> Add Investment for ${GZ.Utils.escapeHtml(partner.name)}
        </button>
      `
    });
  },

  openFormModal(editId = null) {
    const existing = editId ? GZ.State.get('partners').find(p => p.id === editId) : null;
    const isEdit = Boolean(existing);

    GZ.Utils.openModal({
      title: isEdit ? `Edit Partner (${existing.name})` : `+ Add Business Partner`,
      bodyHtml: `
        <form class="form-grid" onsubmit="return false;">
          <div class="form-group">
            <label>Partner Name *</label>
            <input type="text" id="prtFormName" class="form-control" required value="${GZ.Utils.escapeHtml(existing ? existing.name : '')}" placeholder="e.g. Amit or Partner 2">
          </div>
          <div class="form-group">
            <label>Role / Designation</label>
            <input type="text" id="prtFormRole" class="form-control" value="${GZ.Utils.escapeHtml(existing ? existing.role : 'Co-Partner')}" placeholder="e.g. Managing Partner">
          </div>
          <div class="form-group">
            <label>Profit Share (%) *</label>
            <input type="number" id="prtFormShare" class="form-control" min="0" max="100" step="0.5" required value="${existing ? existing.profitShare : 25}">
          </div>
          <div class="form-group">
            <label>Phone / Contact</label>
            <input type="text" id="prtFormPhone" class="form-control" value="${GZ.Utils.escapeHtml(existing ? existing.phone : '')}" placeholder="+91 98XXX XXXXX">
          </div>
          <div class="form-group full-width">
            <label>Notes & Responsibilities</label>
            <textarea id="prtFormNotes" class="form-control" placeholder="Agreement terms, capital commitment...">${GZ.Utils.escapeHtml(existing ? existing.notes : '')}</textarea>
          </div>
        </form>
      `,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="savePartnerBtn"><i class="fa-solid fa-check"></i> Save Partner</button>
      `,
      onMount: () => {
        document.getElementById('savePartnerBtn').onclick = () => {
          const name = document.getElementById('prtFormName').value.trim();
          const role = document.getElementById('prtFormRole').value.trim();
          const profitShare = Number(document.getElementById('prtFormShare').value) || 0;
          const phone = document.getElementById('prtFormPhone').value.trim();
          const notes = document.getElementById('prtFormNotes').value.trim();

          if (!name) {
            GZ.Utils.toast('Partner name is required.', 'warning');
            return;
          }

          const payload = { name, role, profitShare, phone, notes };
          if (isEdit) {
            GZ.State.updateItem('partners', editId, payload);
            GZ.Utils.toast(`Partner ${name} updated.`, 'success');
          } else {
            const id = GZ.Utils.generateId('PRT', GZ.State.get('partners'));
            GZ.State.addItem('partners', { id, ...payload });
            GZ.Utils.toast(`Partner ${name} added.`, 'success');
          }
          GZ.Utils.closeModal();
        };
      }
    });
  },

  confirmDelete(id) {
    const item = GZ.State.get('partners').find(p => p.id === id);
    if (!item) return;
    GZ.Utils.confirmDialog({
      title: 'Remove Partner Profile',
      message: `Remove partner profile <strong>${GZ.Utils.escapeHtml(item.name)}</strong>? (Existing investment records under their name will remain intact.)`,
      onConfirm: () => {
        GZ.State.deleteItem('partners', id);
        GZ.Utils.toast(`Partner ${item.name} removed.`, 'info');
      }
    });
  },

  exportCSV() {
    const rows = GZ.Calc.getPartnersSummary().partners;
    GZ.Utils.exportCSV('gamezone_partners.csv', rows, [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'PartnerName' },
      { key: 'invested', label: 'TotalInvested' },
      { key: 'paid', label: 'Paid' },
      { key: 'pending', label: 'Pending' },
      { key: 'profitShare', label: 'ProfitSharePct' },
      { key: 'lastPayment', label: 'LastPayment' },
      { key: 'notes', label: 'Notes' }
    ]);
  }
};
