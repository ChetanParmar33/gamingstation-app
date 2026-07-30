import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CButton } from './custom';
import { toggleTheme } from '../store/themeSlice';
import { FaGamepad, FaPhoneAlt, FaChevronDown, FaChevronUp, FaRegUser } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleNavClick = (e, path, hashId) => {
    if (hashId) {
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(hashId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileOpen(false);
      } else {
        navigate(`/${path}`);
      }
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/' && !location.hash) return 'active';
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
          {/* Logo Design: GAMING STATION 50 */}
          <Link to="/" className="logo-container" id="header-logo">
            <span className="logo-gaming-station">
              <span className="logo-gamepad"><FaGamepad /></span>
              <span className="logo-text">GAMING<br/>STATION</span>
            </span>
            <span className="logo-box-50">50</span>
          </Link>

          {/* Navigation Links */}
          <nav className="main-nav" id="desktop-nav">
            <div className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            </div>
            <div className="nav-item">
              <a href="#pricing-plans" onClick={(e) => handleNavClick(e, '#pricing-plans', 'pricing-plans')} className="nav-link">Plans</a>
            </div>
            <div className="nav-item">
              <a href="#games-library" onClick={(e) => handleNavClick(e, '#games-library', 'games-library')} className="nav-link">Games</a>
            </div>
            <div className="nav-item">
              <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works', 'how-it-works')} className="nav-link">How It Works</a>
            </div>
            <div className="nav-item">
              <a href="#showcase-gallery" onClick={(e) => handleNavClick(e, '#showcase-gallery', 'showcase-gallery')} className="nav-link">Gallery</a>
            </div>
            <div className="nav-item">
              <a href="#reviews" onClick={(e) => handleNavClick(e, '#reviews', 'reviews')} className="nav-link">Reviews</a>
            </div>
            <div className="nav-item">
              <Link to="/faq" className={`nav-link ${isActive('/faq')}`}>FAQ</Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about')}`}>Contact</Link>
            </div>
          </nav>

          {/* Header Action Items */}
          <div className="header-actions">
            {/* Phone Number with Icon */}
            <a href="tel:+917900980514" className="header-phone-link">
              <FaPhoneAlt className="phone-icon-nav" /> +91 79009 80514
            </a>

            <Link 
              to="/book" 
              className={`btn btn-primary btn-sm header-book-btn ${isActive('/book')}`} 
              id="btn-book-nav"
            >
              Book Now
            </Link>

            <CButton
              type="text"
              shape="circle"
              icon={themeMode === 'dark' ? <FiSun style={{ fontSize: '18px', color: '#fbbf24' }} /> : <FiMoon style={{ fontSize: '18px', color: '#1e293b' }} />}
              onClick={() => dispatch(toggleTheme())}
              className="theme-toggle-btn"
            />

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>Theme</span>
            <CButton
              type="text"
              shape="circle"
              icon={themeMode === 'dark' ? <FiSun style={{ fontSize: '18px', color: '#fbbf24' }} /> : <FiMoon style={{ fontSize: '18px', color: '#1e293b' }} />}
              onClick={() => dispatch(toggleTheme())}
            />
          </div>
          
          <Link to="/" className="mobile-link" onClick={() => setIsMobileOpen(false)}>Home</Link>
          
          <a href="#pricing-plans" onClick={(e) => handleNavClick(e, '#pricing-plans', 'pricing-plans')} className="mobile-link">Plans</a>
          <a href="#games-library" onClick={(e) => handleNavClick(e, '#games-library', 'games-library')} className="mobile-link">Games</a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works', 'how-it-works')} className="mobile-link">How It Works</a>
          <a href="#showcase-gallery" onClick={(e) => handleNavClick(e, '#showcase-gallery', 'showcase-gallery')} className="mobile-link">Gallery</a>
          <a href="#reviews" onClick={(e) => handleNavClick(e, '#reviews', 'reviews')} className="mobile-link">Reviews</a>
          
          <Link to="/faq" className="mobile-link" onClick={() => setIsMobileOpen(false)}>FAQ</Link>
          <Link to="/about" className="mobile-link" onClick={() => setIsMobileOpen(false)}>Contact</Link>
          
          <a href="tel:+917900980514" className="mobile-link mobile-phone-display" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
            <FaPhoneAlt /> +91 79009 80514
          </a>
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
            <FaRegUser style={{ marginRight: '0.5rem' }} /> Login / Signup
          </Link>
          <Link to="/book" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>Book Now</Link>
        </div>
      </aside>
    </>
  );
}
