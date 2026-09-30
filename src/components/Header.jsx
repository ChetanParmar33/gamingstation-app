import React from 'react';

export default function Header({ serverConnected }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button type="button" id="mobileMenuBtn" className="mobile-menu-btn" aria-label="Toggle Navigation">
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="page-heading">
          <h2 id="headerPageTitle">Home</h2>
          <div className="breadcrumb">
            <small id="headerBreadcrumb">Total Business Summary</small>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Simple Search */}
        <div className="global-search-wrap">
          <div className="global-search-input-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              id="globalSearchInput"
              placeholder="Search name, item or bill..."
              onInput={e => window.GZ?.App?.handleGlobalSearch(e.target.value)}
              onFocus={e => {
                if (e.target.value) window.GZ?.App?.handleGlobalSearch(e.target.value);
              }}
            />
          </div>
          <div id="globalSearchDropdown" className="global-search-dropdown hidden"></div>
        </div>

        {/* Node.js Backend Status Pill */}
        <div
          className="lang-switch-wrap"
          title={serverConnected ? 'Node.js Backend Connected' : 'Local Storage Fallback Mode'}
          style={{ fontSize: '0.78rem', fontWeight: 600 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: serverConnected ? 'var(--success)' : 'var(--warning)',
              display: 'inline-block'
            }}
          />
          <span>{serverConnected ? 'Server Connected' : 'Offline Mode'}</span>
        </div>

        {/* Language Selector (English / Hindi / Gujarati) */}
        <div className="lang-switch-wrap" title="Change Language">
          <i className="fa-solid fa-globe"></i>
          <select
            id="headerLangSelect"
            className="lang-select"
            defaultValue="en"
            onChange={e => window.GZ?.App?.setLanguage(e.target.value)}
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button type="button" className="icon-btn" title="Light / Dark Mode" onClick={() => window.GZ?.App?.toggleTheme()}>
          <i id="headerThemeIcon" className="fa-solid fa-moon"></i>
        </button>

        {/* Notification Bell & Panel */}
        <div className="notif-wrapper">
          <button type="button" id="notifBellBtn" className="icon-btn" title="Reminders">
            <i className="fa-solid fa-bell"></i>
            <span id="notifBadgeCount" className="notif-count">0</span>
          </button>
          <div id="notifDropdownPanel" className="notif-panel hidden">
            <div className="notif-header">
              <span>Important Reminders</span>
            </div>
            <div id="notifListContainer" className="notif-list"></div>
          </div>
        </div>

        {/* Admin Profile Pill */}
        <div className="user-profile-pill" onClick={() => window.GZ?.App?.navigateTo('settings')} title="Settings">
          <div className="user-avatar">A</div>
          <div className="user-meta">
            <span className="user-name js-admin-name">Amit</span>
          </div>
        </div>
      </div>
    </header>
  );
}
