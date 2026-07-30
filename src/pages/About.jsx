import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container">
          <span className="section-tag"><i className="fa-solid fa-gamepad"></i> Our Mission</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Play Without Limits</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Empowering gamers across India with immediate, flexible access to console gaming systems. Zero deposit, zero hassle, maximum satisfaction.
          </p>
        </div>
      </section>

      {/* BODY CONTENT */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div className="tracking-layout-grid">
          
          <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Who We Are</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Founded in 2024, GamingStation50 is India's pioneer in gaming hardware-as-a-service. We believe that top-tier next-generation gaming experiences shouldn't be gated behind high retail price tags.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              We purchase, configure, sanitize, and deliver complete PlayStation 5 bundles directly to gamers' doorsteps, including controllers, wiring, and a library of pre-loaded blockbuster games.
            </p>
            
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1.2rem', color: 'var(--text-dark)' }}>Core Values</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', marginTop: '0.2rem' }}></i>
                <span><strong>Trust & Transparency:</strong> Absolutely zero security deposits and no hidden logistics charges.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', marginTop: '0.2rem' }}></i>
                <span><strong>Pristine Sanitization:</strong> Every controller and console goes through a multi-point UV sanitization cycle before packaging.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', marginTop: '0.2rem' }}></i>
                <span><strong>Hyperlocal Velocity:</strong> 2-hour delivery zones configured across key tech cities.</span>
              </li>
            </ul>
          </div>

          {/* Stats/Milestones Card */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', display: 'block' }}>15,000+</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Successful Rentals</span>
            </div>
            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(24,24,27,0.05)', borderBottom: '1px solid rgba(24,24,27,0.05)', padding: '2rem 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', display: 'block' }}>6 Cities</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Operational Hubs</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', display: 'block' }}>4.9 ★</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Rating</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
