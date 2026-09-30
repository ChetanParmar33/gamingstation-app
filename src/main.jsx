import React from 'react';
import { createRoot } from 'react-dom/client';

// Stylesheets bundled by Vite
import '../css/style.css';
import '../css/responsive.css';

// Core domain modules bundled by Vite
import '../js/utils.js';
import '../js/data.js';
import '../js/storage.js';
import '../js/charts.js';
import '../js/dashboard.js';
import '../js/investments.js';
import '../js/expenses.js';
import '../js/equipment.js';
import '../js/partners.js';
import '../js/payments.js';
import '../js/reports.js';
import '../js/app.js';

import App from './App.jsx';

window.__GS_REACT_MOUNTED = true;

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
