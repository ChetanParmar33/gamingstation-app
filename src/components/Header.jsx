import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CButton } from './custom';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { toggleTheme } from '../store/themeSlice';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsMobileSubmenuOpen(false);
  }, [location]);

  const toggleMobileNav = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleMobileSubmenu = (e) => {
    e.preventDefault();
    setIsMobileSubmenuOpen(!isMobileSubmenuOpen);
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return 'active';
    if (path !== '/' && location.pathname.startsWith(path)) return 'active';
    return '';
  };

  return (
    <>
      <header 
        className={`header-wrapper ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`} 
        id="sticky-header"
      >
        <div className="container header-container">
          <Link to="/" className="logo" id="header-logo">
            <i className="fa-solid fa-gamepad"></i>
            <div>
              <span>GamingStation50</span>
              <span className="logo-sub">Rent • Play • Enjoy</span>
            </div>
          </Link>

          <nav className="main-nav" id="desktop-nav">
            <div className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            </div>
            
            <div className={`nav-item dropdown ${isMobileSubmenuOpen ? 'active' : ''}`}>
              <a 
                href="#" 
                className="nav-link dropdown-toggle" 
                onClick={toggleMobileSubmenu}
                aria-haspopup="true" 
                aria-expanded={isMobileSubmenuOpen}
              >
                Services <i className="fa-solid fa-chevron-down dropdown-icon"></i>
              </a>
              <div className="dropdown-menu">
                <Link to="/plans" className="dropdown-item">Rental Plans & Passes</Link>
                <Link to="/book" className="dropdown-item font-weight-bold">Book PS5 Now</Link>
              </div>
            </div>

            <div className="nav-item">
              <Link to="/faq" className={`nav-link ${isActive('/faq')}`}>FAQ</Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about')}`}>About Us</Link>
            </div>
            <div className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
            </div>
          </nav>

          <div className="header-actions">
            <CButton
              type="text"
              shape="circle"
              icon={themeMode === 'dark' ? <SunOutlined style={{ fontSize: '18px', color: '#fbbf24' }} /> : <MoonOutlined style={{ fontSize: '18px', color: '#1e293b' }} />}
              onClick={() => dispatch(toggleTheme())}
              style={{ marginRight: '0.5rem' }}
            />
            <Link 
              to="/login" 
              className={`btn btn-secondary btn-sm ${isActive('/login')}`} 
              id="btn-login-nav"
            >
              <i className="fa-regular fa-user"></i> Login
            </Link>
            <Link 
              to="/book" 
              className={`btn btn-primary btn-sm ${isActive('/book')}`} 
              id="btn-book-nav"
            >
              Book Now
            </Link>
            <button 
              className={`hamburger ${isMobileOpen ? 'active' : ''}`} 
              id="hamburger-menu" 
              aria-label="Toggle Navigation Menu" 
              aria-expanded={isMobileOpen}
              onClick={toggleMobileNav}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY & NAVIGATION */}
      <div 
        className={`mobile-menu-overlay ${isMobileOpen ? 'active' : ''}`} 
        id="mobile-overlay"
        onClick={toggleMobileNav}
      ></div>
      <aside className={`mobile-menu ${isMobileOpen ? 'active' : ''}`} id="mobile-nav" aria-label="Mobile Navigation Menu">
        <div className="mobile-links">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>Theme</span>
            <CButton
              type="text"
              shape="circle"
              icon={themeMode === 'dark' ? <SunOutlined style={{ fontSize: '18px', color: '#fbbf24' }} /> : <MoonOutlined style={{ fontSize: '18px', color: '#1e293b' }} />}
              onClick={() => dispatch(toggleTheme())}
            />
          </div>
          <Link to="/" className="mobile-link">Home</Link>
          
          <div className="mobile-link-group">
            <a 
              href="#" 
              className="mobile-link mobile-submenu-trigger"
              onClick={toggleMobileSubmenu}
            >
              Plans <i className={`fa-solid fa-chevron-${isMobileSubmenuOpen ? 'up' : 'down'}`} style={{ marginLeft: '0.5rem' }}></i>
            </a>
            <div className={`mobile-submenu ${isMobileSubmenuOpen ? 'active' : ''}`} style={{ display: isMobileSubmenuOpen ? 'block' : 'none' }}>
              <Link to="/plans">1 Day Plan</Link>
              <Link to="/plans">2 Days Plan</Link>
              <Link to="/plans">3 Days Plan</Link>
              <Link to="/plans?term=short">1 Week Pass</Link>
              <Link to="/plans?term=long">Long-term Subscriptions</Link>
            </div>
          </div>

          <Link to="/about" className="mobile-link">About Us</Link>
          <Link to="/contact" className="mobile-link">Contact</Link>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
            <i className="fa-regular fa-user"></i> Login / Signup
          </Link>
          <Link to="/book" className="btn btn-primary" style={{ width: '100%' }}>Book Now</Link>
        </div>
      </aside>
    </>
  );
}
