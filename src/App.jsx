import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ConfigProvider, theme as antdTheme, Spin } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingControls from './components/FloatingControls';
import ScrollToTop from './components/ScrollToTop';

// Lazy-load page components to enable code-splitting (Vite chunk optimization)
const Home = lazy(() => import('./pages/Home'));
const Plans = lazy(() => import('./pages/Plans'));
const Book = lazy(() => import('./pages/Book'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Cancellation = lazy(() => import('./pages/Cancellation'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Success = lazy(() => import('./pages/Success'));

// A premium loading loader for lazy route switching
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh', width: '100%' }}>
    <Spin size="large" tip="Loading interface..." />
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </main>
          <Footer />
          <FloatingControls />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
