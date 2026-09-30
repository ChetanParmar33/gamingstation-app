import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

window.__GS_REACT_MOUNTED = true;

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
