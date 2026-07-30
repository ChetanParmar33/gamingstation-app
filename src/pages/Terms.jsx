import React from 'react';

export default function Terms() {
  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container animate-on-scroll">
          <span className="section-tag"><i className="fa-solid fa-scale-balanced"></i> Legal Terms</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Terms & Conditions</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Please review our terms of service, device ownership policies, verification protocols, and damage liability limits.
          </p>
        </div>
      </section>

      {/* TERMS BODY CONTENT */}
      <section className="container" style={{ paddingBottom: '6rem', maxWidth: '900px' }}>
        <div className="glass-card animate-on-scroll" style={{ padding: '4rem 3.5rem' }}>
          
          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>1. Rental Agreement Scope</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            By completing a booking on GamingStation50, you enter into a binding rental agreement with GamingStation50 Console Rental Services. All rented hardware, including the console, controllers, discs, and cables, remains the sole property of GamingStation50 and must be returned in functional condition.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>2. KYC and Verification Protocol</h3>
          <p style={{ color: 'var(--text-muted);', lineHeight: 1.7, marginBottom: '2rem' }}>
            GamingStation50 operates without a security deposit. To facilitate this policy, users must undergo a digital Know Your Customer (KYC) verification. This requires submitting one primary ID proof (Aadhaar, Passport, or DL) and address/work proof. We reserve the right to cancel bookings if documents are found invalid or suspicious.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>3. Damage & Loss Policy</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            The user assumes full responsibility for the equipment during the rental period. Standard wear and tear, including minor cosmetic scratches, is fully covered. In the event of catastrophic physical damage, liquid spills, or theft, the user will be liable to pay the actual repair cost or the depreciated retail value of the system.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>4. Delivery & Pickup Coordination</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Delivery and pickup are executed by our authorized logistics representatives. The setup must be unpacked and connected by our agent on your screen. At the end of the rental term, our agent will visit to inspect and pack the kit. Users are requested to be present at the delivery address during pickup.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>5. Governing Law</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 0 }}>
            These terms are governed by the laws of India. Any legal disputes arising out of the use of our services or hardware rental will be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka.
          </p>

        </div>
      </section>
    </>
  );
}
