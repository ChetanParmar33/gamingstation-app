import React from 'react';

export default function Pages() {
  return (
    <main className="content-area">
      {/* ==================================================================
           PAGE 1: DASHBOARD (SIMPLE SUMMARY, NO GRAPHS)
           ================================================================== */}
      <section id="page-dashboard" className="page-view active">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Business Summary</h3>
            <p>See how much money is invested, spent, and pending in simple numbers</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-primary" onClick={() => window.GZ?.Investments?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Investment
            </button>
            <button className="btn btn-secondary" onClick={() => window.GZ?.Expenses?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Expense
            </button>
            <button className="btn btn-secondary" onClick={() => window.GZ?.Payments?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Payment
            </button>
            <button className="btn btn-secondary" onClick={() => window.GZ?.Equipment?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Shop Item
            </button>
          </div>
        </div>

        {/* Simple Balance Calculation Strip */}
        <div id="dashboardFinSummary" className="fin-summary-strip"></div>

        {/* 6 Simple Summary Cards */}
        <div id="dashboardKpiGrid" className="kpi-grid-6"></div>

        {/* Bottom 4 Simple Activity Lists (No Charts/Graphs) */}
        <div className="dashboard-lists-grid">
          <div className="card">
            <div className="card-header">
              <h3>
                <i className="fa-solid fa-sack-dollar"></i> Recent Investments
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.App?.navigateTo('investments')}>
                See All
              </button>
            </div>
            <div id="dashRecentInvestments" className="card-body"></div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>
                <i className="fa-solid fa-receipt"></i> Recent Expenses
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.App?.navigateTo('expenses')}>
                See All
              </button>
            </div>
            <div id="dashRecentExpenses" className="card-body"></div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>
                <i className="fa-solid fa-wallet"></i> Pending Bills
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.App?.navigateTo('payments')}>
                See All
              </button>
            </div>
            <div id="dashUpcomingPayments" className="card-body"></div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>
                <i className="fa-solid fa-calendar-check"></i> Future Costs
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.App?.navigateTo('upcoming')}>
                See All
              </button>
            </div>
            <div id="dashUpcomingCosts" className="card-body"></div>
          </div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 2: INVESTMENTS
           ================================================================== */}
      <section id="page-investments" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Investments</h3>
            <p>Record money put into the business by Amit and partners</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-secondary" onClick={() => window.GZ?.Investments?.toggleFilters()}>
              <i className="fa-solid fa-filter"></i> Filter
            </button>
            <button className="btn btn-secondary" onClick={() => window.GZ?.Investments?.exportCSV()}>
              <i className="fa-solid fa-download"></i> Download Excel/CSV
            </button>
            <button className="btn btn-primary" onClick={() => window.GZ?.Investments?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Investment
            </button>
          </div>
        </div>

        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-search">
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                id="invSearchInput"
                placeholder="Search investments by ID, investor, PS5, TV, status..."
                onInput={e => window.GZ?.Investments?.onSearch(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click any column header to sort</span>
          </div>

          <div id="invFilterBar" className="filter-bar hidden">
            <div className="filter-group">
              <label>From Date</label>
              <input type="date" id="invFilterFrom" />
            </div>
            <div className="filter-group">
              <label>To Date</label>
              <input type="date" id="invFilterTo" />
            </div>
            <div className="filter-group">
              <label>Investor</label>
              <select id="invFilterInvestor">
                <option value="">All Investors</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select id="invFilterCategory">
                <option value="">All Categories</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Paid Status</label>
              <select id="invFilterStatus">
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Payment Method</label>
              <select id="invFilterMethod">
                <option value="">All Methods</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.GZ?.Investments?.applyFilters()}>
              Apply Filter
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.Investments?.resetFilters()}>
              Reset Filter
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('id')}>
                    ID <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('date')}>
                    Date <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('investor')}>
                    Investor <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('category')}>
                    Category <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('description')}>
                    Description <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('amount')}>
                    Amount <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('paymentMethod')}>
                    Payment Method <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('status')}>
                    Paid Status <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Investments?.sortBy('paymentDate')}>
                    Payment Date <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="investmentsTableBody"></tbody>
              <tfoot id="investmentsTableFoot"></tfoot>
            </table>
          </div>

          <div id="investmentsBottomSummary" className="table-footer-summary"></div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 3: EXPENSES
           ================================================================== */}
      <section id="page-expenses" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Expenses</h3>
            <p>Rent, electricity, internet, staff salary, and other bills</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-secondary" onClick={() => window.GZ?.Expenses?.exportCSV()}>
              <i className="fa-solid fa-download"></i> Download Excel/CSV
            </button>
            <button className="btn btn-primary" onClick={() => window.GZ?.Expenses?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Expense
            </button>
          </div>
        </div>

        <div id="expensesKpiGrid" className="kpi-grid-4"></div>

        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-search">
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                id="expSearchInput"
                placeholder="Search expense by name, shop or category..."
                onInput={e => window.GZ?.Expenses?.onSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <label>From Date</label>
              <input type="date" id="expFilterFrom" />
            </div>
            <div className="filter-group">
              <label>To Date</label>
              <input type="date" id="expFilterTo" />
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select id="expFilterCategory">
                <option value="">All Categories</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select id="expFilterStatus">
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.GZ?.Expenses?.applyFilters()}>
              Filter
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.Expenses?.resetFilters()}>
              Show All
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('id')}>
                    ID <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('date')}>
                    Date <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('category')}>
                    Category <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('description')}>
                    Expense Details <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('vendor')}>
                    Paid To (Vendor) <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('amount')}>
                    Amount <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('status')}>
                    Status <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Expenses?.sortBy('paymentMethod')}>
                    Payment Mode <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="expensesTableBody"></tbody>
            </table>
          </div>

          <div id="expensesBottomSummary" className="table-footer-summary"></div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 4: EQUIPMENT
           ================================================================== */}
      <section id="page-equipment" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Shop Items &amp; Machines</h3>
            <p>List of PS5, TVs, controllers, racing wheels, sofas, AC &amp; other items</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-secondary" onClick={() => window.GZ?.Equipment?.exportCSV()}>
              <i className="fa-solid fa-download"></i> Download Excel/CSV
            </button>
            <button className="btn btn-primary" onClick={() => window.GZ?.Equipment?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Shop Item
            </button>
          </div>
        </div>

        <div id="equipmentKpiGrid" className="kpi-grid-4"></div>

        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-search">
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                id="eqpSearchInput"
                placeholder="Search item (PS5, TV, chair, AC)..."
                onInput={e => window.GZ?.Equipment?.onSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <label>Category</label>
              <select id="eqpFilterCategory">
                <option value="">All Categories</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Condition</label>
              <select id="eqpFilterCondition">
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Bought By</label>
              <select id="eqpFilterOwner">
                <option value="">All Owners</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.GZ?.Equipment?.applyFilters()}>
              Filter
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.Equipment?.resetFilters()}>
              Show All
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('name')}>
                    Item Name <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('category')}>
                    Category <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('quantity')}>
                    Qty <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('purchaseDate')}>
                    Buy Date <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('purchasePrice')}>
                    Price (1 Item) <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('totalValue')}>
                    Total Price <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('condition')}>
                    Condition <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Warranty</th>
                  <th>Place / Room</th>
                  <th className="sortable" onClick={() => window.GZ?.Equipment?.sortBy('owner')}>
                    Bought By <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="equipmentTableBody"></tbody>
            </table>
          </div>

          <div id="equipmentBottomSummary" className="table-footer-summary"></div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 5: PARTNERS
           ================================================================== */}
      <section id="page-partners" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Partners</h3>
            <p>Click on any partner to see all the money they have given</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-secondary" onClick={() => window.GZ?.Partners?.exportCSV()}>
              <i className="fa-solid fa-download"></i> Download List
            </button>
            <button className="btn btn-primary" onClick={() => window.GZ?.Partners?.openFormModal()}>
              <i className="fa-solid fa-user-plus"></i> Add Partner
            </button>
          </div>
        </div>

        <div id="partnerCardsGrid" className="partner-cards-grid"></div>

        <div className="table-card">
          <div className="card-header">
            <h3>Partner Summary Table</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Partner Name</th>
                  <th>Total Money Given</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Share (%)</th>
                  <th>Last Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="partnersTableBody"></tbody>
              <tfoot id="partnersTableFoot"></tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 6: UPCOMING COSTS
           ================================================================== */}
      <section id="page-upcoming" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Future Costs</h3>
            <p>Items or work planned for the future (extra chairs, AC, board, etc.)</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-primary" onClick={() => window.GZ?.Upcoming?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Future Cost
            </button>
          </div>
        </div>

        <div id="upcomingKpiGrid" className="kpi-grid-4"></div>

        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-search">
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                id="upcSearchInput"
                placeholder="Search planned item or work..."
                onInput={e => window.GZ?.Upcoming?.onSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <label>Importance</label>
              <select id="upcFilterPriority">
                <option value="">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select id="upcFilterStatus">
                <option value="">All Status</option>
                <option value="Planned">Planned</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.GZ?.Upcoming?.applyFilters()}>
              Filter
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.Upcoming?.resetFilters()}>
              Show All
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('id')}>
                    ID <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('name')}>
                    Work / Item Name <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('category')}>
                    Category <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('expectedDate')}>
                    Planned Date <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('estimatedAmount')}>
                    Estimated Cost <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('priority')}>
                    Priority <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Upcoming?.sortBy('status')}>
                    Status <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="upcomingTableBody"></tbody>
            </table>
          </div>

          <div id="upcomingBottomSummary" className="table-footer-summary"></div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 7: PAYMENTS
           ================================================================== */}
      <section id="page-payments" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Payments &amp; Pending Bills</h3>
            <p>Check who is paid and whose payment is still left</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-secondary" onClick={() => window.GZ?.Payments?.exportCSV()}>
              <i className="fa-solid fa-download"></i> Download List
            </button>
            <button className="btn btn-primary" onClick={() => window.GZ?.Payments?.openFormModal()}>
              <i className="fa-solid fa-plus"></i> Add Payment
            </button>
          </div>
        </div>

        <div id="paymentsKpiGrid" className="kpi-grid-4"></div>

        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-search">
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                id="paySearchInput"
                placeholder="Search person, shop or bill..."
                onInput={e => window.GZ?.Payments?.onSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <label>Status</label>
              <select id="payFilterStatus">
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Payment Mode</label>
              <select id="payFilterMethod">
                <option value="">All Modes</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.GZ?.Payments?.applyFilters()}>
              Filter
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.Payments?.resetFilters()}>
              Show All
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('date')}>
                    Date <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('personVendor')}>
                    Person / Shop <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('type')}>
                    Type <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('description')}>
                    Details <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('amount')}>
                    Total Bill <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('paid')}>
                    Paid <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('pending')}>
                    Pending <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Mode</th>
                  <th className="sortable" onClick={() => window.GZ?.Payments?.sortBy('status')}>
                    Status <i className="fa-solid fa-sort sort-icon"></i>
                  </th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="paymentsTableBody"></tbody>
            </table>
          </div>

          <div id="paymentsBottomSummary" className="table-footer-summary"></div>
        </div>
      </section>

      {/* ==================================================================
           PAGE 8: REPORTS
           ================================================================== */}
      <section id="page-reports" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Reports</h3>
            <p>View or print full summary of Investments, Expenses, Items, Payments and Partners</p>
          </div>
          <div className="action-btn-group">
            <button className="btn btn-secondary" onClick={() => window.GZ?.Reports?.exportCurrentReportCSV()}>
              <i className="fa-solid fa-download"></i> Download Excel/CSV
            </button>
            <button className="btn btn-primary" onClick={() => window.GZ?.Reports?.printReport()}>
              <i className="fa-solid fa-print"></i> Print / Save PDF
            </button>
          </div>
        </div>

        <div className="report-tabs">
          <button className="report-tab-btn active" data-tab="investment" onClick={() => window.GZ?.Reports?.switchTab('investment')}>
            Investments
          </button>
          <button className="report-tab-btn" data-tab="expense" onClick={() => window.GZ?.Reports?.switchTab('expense')}>
            Expenses
          </button>
          <button className="report-tab-btn" data-tab="asset" onClick={() => window.GZ?.Reports?.switchTab('asset')}>
            Shop Items
          </button>
          <button className="report-tab-btn" data-tab="payment" onClick={() => window.GZ?.Reports?.switchTab('payment')}>
            Payments
          </button>
          <button className="report-tab-btn" data-tab="partner" onClick={() => window.GZ?.Reports?.switchTab('partner')}>
            Partner Summary
          </button>
        </div>

        <div className="table-card" style={{ marginBottom: '1.25rem' }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label>From Date</label>
              <input type="date" id="repFilterFrom" />
            </div>
            <div className="filter-group">
              <label>To Date</label>
              <input type="date" id="repFilterTo" />
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select id="repFilterCategory">
                <option value="">All Categories</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Partner</label>
              <select id="repFilterPartner">
                <option value="">All Partners</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.GZ?.Reports?.applyFilters()}>
              Filter
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.GZ?.Reports?.resetFilters()}>
              Show All
            </button>
          </div>
        </div>

        <div id="reportContentContainer"></div>
      </section>

      {/* ==================================================================
           PAGE 9: SETTINGS
           ================================================================== */}
      <section id="page-settings" className="page-view">
        <div className="section-top-bar">
          <div className="section-title-group">
            <h3>Settings</h3>
            <p>Change shop name, owner name, or reset data</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="card">
            <div className="card-header">
              <h3>Shop Details</h3>
            </div>
            <div className="card-body">
              <form className="form-grid" onSubmit={e => e.preventDefault()}>
                <div className="form-group full-width">
                  <label>Shop / Business Name</label>
                  <input type="text" id="setBusinessName" className="form-control" defaultValue="Gaming Station" />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select id="setCurrency" className="form-control" defaultValue="₹">
                    <option value="₹">Rupee (₹)</option>
                    <option value="$">Dollar ($)</option>
                    <option value="€">Euro (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Owner / Admin Name</label>
                  <input type="text" id="setAdminName" className="form-control" defaultValue="Amit" />
                </div>
                <div className="form-group full-width">
                  <label>Screen Color Mode</label>
                  <select id="setThemeSelect" className="form-control" defaultValue="light">
                    <option value="light">Light Mode (White &amp; Clean)</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <button type="button" className="btn btn-primary" onClick={() => window.GZ?.App?.saveSettingsForm()}>
                    <i className="fa-solid fa-check"></i> Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Data Backup &amp; Reset</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="detail-item">
                <span>Load Sample Records</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0.75rem' }}>
                  Load the default Gaming Station example entries (PS5, TV, chairs, partners, and bills).
                </p>
                <button type="button" className="btn btn-secondary" onClick={() => window.GZ?.App?.restoreDefaultSampleData()}>
                  <i className="fa-solid fa-rotate-left"></i> Load Sample Data
                </button>
              </div>

              <div className="detail-item" style={{ borderColor: 'var(--danger)' }}>
                <span style={{ color: 'var(--danger)' }}>Clear All Records</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0.75rem' }}>
                  Delete all entries and start fresh from zero.
                </p>
                <button type="button" className="btn btn-danger" onClick={() => window.GZ?.App?.confirmClearAllData()}>
                  <i className="fa-solid fa-trash-can"></i> Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
