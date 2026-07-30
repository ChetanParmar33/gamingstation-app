import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
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

          <nav className="main-nav" id="desktop-nav" aria-label="Main Navigation">
            <div className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            </div>

            <div className="nav-item">
              <Link to="/plans" className={`nav-link ${isActive('/plans')}`}>
                Plans <i className="fa-solid fa-chevron-down"></i>
              </Link>
              <div className="mega-menu" aria-label="Plans Submenu">
                <div className="mega-col">
                  <h3 className="mega-col-title"><i className="fa-solid fa-clock"></i> Short-Term</h3>
                  <ul className="mega-list">
                    <li><Link to="/plans?term=short"><i className="fa-solid fa-calendar-days"></i> 2 Days Rent</Link></li>
                    <li><Link to="/plans?term=short"><i className="fa-solid fa-calendar-day"></i> 1 Day Rent</Link></li>
                    <li><Link to="/plans?term=short"><i className="fa-solid fa-calendar-minus"></i> 3 Days Weekend</Link></li>
                    <li><Link to="/plans?term=short"><i className="fa-solid fa-calendar-week"></i> 1 Week Pass</Link></li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h3 className="mega-col-title"><i className="fa-solid fa-calendar-check"></i> Long-Term</h3>
                  <ul className="mega-list">
                    <li><Link to="/plans?term=long"><i className="fa-solid fa-tags"></i> 15 Days Pass</Link></li>
                    <li><Link to="/plans?term=long"><i className="fa-solid fa-circle-check"></i> 1 Month Subscription</Link></li>
                    <li><Link to="/plans?term=long"><i className="fa-solid fa-gem"></i> 2 Months Ultimate</Link></li>
                    <li><Link to="/plans?term=long"><i className="fa-solid fa-crown"></i> 3 Months VIP Gamer</Link></li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h3 className="mega-col-title"><i className="fa-solid fa-truck-ramp-box"></i> Delivery</h3>
                  <ul className="mega-list">
                    <li><Link to="/plans"><i className="fa-solid fa-bolt-lightning"></i> 2-Hour Delivery</Link></li>
                    <li><Link to="/plans"><i className="fa-solid fa-handshake-angle"></i> Free Home Setup</Link></li>
                    <li><Link to="/plans"><i className="fa-solid fa-arrows-rotate"></i> Easy Returns</Link></li>
                    <li><Link to="/plans"><i className="fa-solid fa-clipboard-check"></i> Zero Paperwork</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about')}`}>About Us</Link>
            </div>
            <div className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
            </div>
          </nav>

          <div className="header-actions">
            <Button
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
            <Button
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
