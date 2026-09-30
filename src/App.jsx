import React, { useEffect, useState } from 'react';
import LoginScreen from './components/LoginScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Pages from './components/Pages.jsx';
import GlobalModal from './components/GlobalModal.jsx';
import { ApiService } from './api.js';

export default function App() {
  const [serverConnected, setServerConnected] = useState(ApiService.connected);

  useEffect(() => {
    ApiService.onStatusChange(status => {
      setServerConnected(status);
      if (window.GZ?.I18n) {
        requestAnimationFrame(() => window.GZ.I18n.translateDOM());
      }
    });

    if (window.GZ && window.GZ.App) {
      window.GZ.App.init();
    }

    // Fetch & sync initial data from Node.js backend
    ApiService.bootstrap();
  }, []);

  return (
    <>
      <LoginScreen />
      <div id="appShell" className="app-shell hidden">
        <div id="sidebarOverlay" className="sidebar-overlay"></div>
        <Sidebar />
        <div className="main-wrapper">
          <Header serverConnected={serverConnected} />
          <Pages />
        </div>
      </div>
      <GlobalModal />
    </>
  );
}
