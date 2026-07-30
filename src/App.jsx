import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ConfigProvider, theme as antdTheme } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingControls from './components/FloatingControls';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Plans from './pages/Plans';
import Book from './pages/Book';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Cancellation from './pages/Cancellation';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Success from './pages/Success';

function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#092f94',
          borderRadius: 12,
          fontFamily: 'Poppins, sans-serif',
        },
      }}
    >
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Header />
          <main className="main-content" style={{ minHeight: 'calc(100vh - var(--header-height) - 400px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/book" element={<Book />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cancellation" element={<Cancellation />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </main>
          <Footer />
          <FloatingControls />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
