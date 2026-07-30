import React, { useState, useEffect } from 'react';

export default function FloatingControls() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="floating-controls">
      <a 
        href="https://wa.me/919988776655?text=Hi%2C%20I%20want%20to%20rent%20a%20PS5!" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="float-btn whatsapp-btn" 
        id="whatsapp-float" 
        aria-label="Chat with support on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span className="whatsapp-badge">1</span>
      </a>
      <button 
        className={`float-btn back-to-top-btn ${isVisible ? 'visible' : ''}`} 
        id="back-to-top" 
        aria-label="Back to Top"
        onClick={scrollToTop}
        style={{ display: isVisible ? 'flex' : 'none' }}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
}
