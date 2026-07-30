import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Success() {
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Generate a random booking number
    const rand = Math.floor(100000 + Math.random() * 900000);
    setBookingId(`#GS50-${rand}`);
  }, []);

  return (
    <section className="confirmation-section">
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        
        {/* Confirmed Icon */}
        <div className="success-icon-box" style={{ margin: '0 auto 2rem auto', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(var(--success-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '3rem' }}></i>
        </div>

        <h1 style={{ fontWeight: 900, fontSize: '2.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '3rem' }}>
          Thank you for choosing GamingStation50. Your transaction was processed securely. Our logistics representative will reach out shortly to coordinate delivery.
        </p>

        {/* Details Summary Grid */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left', marginBottom: '3rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', borderBottom: '1px solid rgba(24,24,27,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
            Reservation Summary
          </h3>
          
          <div className="summary-details-list" style={{ border: 'none', padding: 0, gap: '1.2rem' }}>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Booking ID</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{bookingId}</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Console Bundle</span>
              <span style={{ fontWeight: 600 }}>Sony PS5 Kit + DualSense</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Selected Duration</span>
              <span style={{ fontWeight: 600 }}>Selected Rental Pass</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>Today (Within 2 Hours)</span>
            </div>
          </div>
        </div>

        {/* Actions buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href={`https://wa.me/919988776655?text=Hi%2C%20I%20want%20to%20track%20my%20order%20${bookingId}!`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            Track Order via WhatsApp <i className="fa-brands fa-whatsapp" style={{ marginLeft: '0.5rem' }}></i>
          </a>
          <Link to="/" className="btn btn-secondary">Return to Home Page</Link>
        </div>

        <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i>
          <span>Need support? Contact Delivery Desk: <strong>+91 99887 76655</strong></span>
        </div>

      </div>
    </section>
  );
}
