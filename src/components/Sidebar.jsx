import React from 'react';

export default function Sidebar() {
  const nav = page => () => window.GZ?.App?.navigateTo(page);
  const toggleCollapse = () => {
    document.getElementById('appShell')?.classList.toggle('sidebar-collapsed');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-wrap">
          <img src="/assets/logo.svg" alt="Gaming Station" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title js-business-name">Gaming Station</span>
            <span className="brand-subtitle">Business Records</span>
          </div>
        </div>
        <button
          type="button"
          id="sidebarCollapseBtn"
          className="sidebar-collapse-btn"
          title="Hide / Show Menu"
          onClick={toggleCollapse}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        <a href="#dashboard" className="nav-item active" data-page="dashboard" onClick={e => { e.preventDefault(); nav('dashboard')(); }}>
          <i className="fa-solid fa-house"></i>
          <span className="nav-label">Home</span>
        </a>
        <a href="#investments" className="nav-item" data-page="investments" onClick={e => { e.preventDefault(); nav('investments')(); }}>
          <i className="fa-solid fa-sack-dollar"></i>
          <span className="nav-label">Investments</span>
          <span id="navBadgeInvestments" className="nav-badge">0</span>
        </a>
        <a href="#expenses" className="nav-item" data-page="expenses" onClick={e => { e.preventDefault(); nav('expenses')(); }}>
          <i className="fa-solid fa-receipt"></i>
          <span className="nav-label">Expenses</span>
          <span id="navBadgeExpenses" className="nav-badge">0</span>
        </a>
        <a href="#payments" className="nav-item" data-page="payments" onClick={e => { e.preventDefault(); nav('payments')(); }}>
          <i className="fa-solid fa-wallet"></i>
          <span className="nav-label">Payments</span>
          <span id="navBadgePayments" className="nav-badge">0</span>
        </a>
        <a href="#equipment" className="nav-item" data-page="equipment" onClick={e => { e.preventDefault(); nav('equipment')(); }}>
          <i className="fa-solid fa-gamepad"></i>
          <span className="nav-label">Shop Items</span>
          <span id="navBadgeEquipment" className="nav-badge">0</span>
        </a>
        <a href="#partners" className="nav-item" data-page="partners" onClick={e => { e.preventDefault(); nav('partners')(); }}>
          <i className="fa-solid fa-user-group"></i>
          <span className="nav-label">Partners</span>
        </a>
        <a href="#upcoming" className="nav-item" data-page="upcoming" onClick={e => { e.preventDefault(); nav('upcoming')(); }}>
          <i className="fa-solid fa-calendar-check"></i>
          <span className="nav-label">Future Costs</span>
          <span id="navBadgeUpcoming" className="nav-badge">0</span>
        </a>
        <a href="#reports" className="nav-item" data-page="reports" onClick={e => { e.preventDefault(); nav('reports')(); }}>
          <i className="fa-solid fa-file-lines"></i>
          <span className="nav-label">Reports</span>
        </a>
        <a href="#settings" className="nav-item" data-page="settings" onClick={e => { e.preventDefault(); nav('settings')(); }}>
          <i className="fa-solid fa-gear"></i>
          <span className="nav-label">Settings</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-manager">
          <div className="manager-avatar">A</div>
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-title">
              <span className="js-admin-name">Amit</span>
            </div>
            <div className="sidebar-footer-sub">Owner / Admin</div>
          </div>
        </div>
        <button type="button" className="sidebar-logout-btn" title="Logout" onClick={() => window.GZ?.Auth?.logout()}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </aside>
  );
}
