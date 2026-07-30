import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneOutlined, WhatsAppOutlined, HomeOutlined } from '@ant-design/icons';
import { CButton, CCard, CResult } from '../components/custom';

export default function Success() {
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    setBookingId(`#GS50-${rand}`);
  }, []);

  return (
    <section className="confirmation-section">
      <div className="container" style={{ maxWidth: '700px' }}>
        
        <CCard style={{ padding: '1rem', border: '1px solid var(--glass-border)' }}>
          <CResult
            status="success"
            title={<span style={{ fontWeight: 900, fontSize: '2.2rem', color: 'var(--text-dark)' }}>Booking Confirmed!</span>}
            subTitle={
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 auto', maxWidth: '550px' }}>
                Thank you for choosing GamingStation50. Your transaction was processed securely. Our logistics representative will reach out shortly to coordinate delivery.
              </p>
            }
            extra={[
              <CButton 
                type="primary" 
                key="track" 
                icon={<WhatsAppOutlined />}
                size="large"
                href={`https://wa.me/919988776655?text=Hi%2C%20I%20want%20to%20track%20my%20order%20${bookingId}!`}
                target="_blank"
              >
                Track Order via WhatsApp
              </CButton>,
              <Link to="/" key="home">
                <CButton size="large" icon={<HomeOutlined />}>
                  Return to Home
                </CButton>
              </Link>
            ]}
          >
            <div style={{ textAlign: 'left', borderTop: '1px solid rgba(24,24,27,0.08)', paddingTop: '2rem', marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
                Reservation Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(24,24,27,0.05)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Booking ID</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{bookingId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(24,24,27,0.05)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Console Bundle</span>
                  <span style={{ fontWeight: 600 }}>Sony PS5 Kit + DualSense</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(24,24,27,0.05)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Selected Duration</span>
                  <span style={{ fontWeight: 600 }}>Selected Rental Pass</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>Today (Within 2 Hours)</span>
                </div>
              </div>
            </div>
          </CResult>
        </CCard>

        <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <PhoneOutlined style={{ color: 'var(--primary)' }} />
          <span>Need support? Contact Delivery Desk: <strong>+91 99887 76655</strong></span>
        </div>

      </div>
    </section>
  );
}
