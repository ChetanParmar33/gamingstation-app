import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <Link to="/" className="logo" style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <i className="fa-solid fa-gamepad"></i>
            <div>
              <span>GamingStation50</span>
              <span className="logo-sub">Rent • Play • Enjoy</span>
            </div>
          </Link>
          <p className="footer-desc">
            Premium console rental service delivering high-quality Sony PS5 setups straight to your living room. Experience cutting-edge gaming without long-term commitments.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="social-icon" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" class="social-icon" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
            <a href="#" class="social-icon" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Main Menu</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Page</Link></li>
            <li><Link to="/plans">Rental Plans</Link></li>
            <li><Link to="/about">About GamingStation</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Help & Support</h4>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ Desk</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cancellation">Cancellation Policy</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Get In Touch</h4>
          <div className="contact-list">
            <div className="contact-item">
              <i className="fa-solid fa-location-dot"></i>
              <div className="contact-info-text">
                <h5>Locations</h5>
                <p>Bangalore, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-phone"></i>
              <div className="contact-info-text">
                <h5>Phone Support</h5>
                <p>+91 99887 76655 (9 AM - 9 PM)</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-envelope"></i>
              <div className="contact-info-text">
                <h5>Email Address</h5>
                <p>support@gamingstation50.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} GamingStation50 Rental Services. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/terms">Terms of Use</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
