import React from 'react';

export default function Privacy() {
  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container animate-on-scroll">
          <span className="section-tag"><i className="fa-solid fa-shield-halved"></i> Data Security</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Learn how we protect and process your documents, verification profiles, and transaction records.
          </p>
        </div>
      </section>

      {/* PRIVACY BODY CONTENT */}
      <section className="container" style={{ paddingBottom: '6rem', maxWidth: '900px' }}>
        <div className="glass-card animate-on-scroll" style={{ padding: '4rem 3.5rem' }}>
          
          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>1. Collection of Information</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            We collect personal information that you voluntarily provide to us when reserving console rental terms. This includes: Full Name, Billing/Delivery address, mobile number, and identity verification proof (Aadhaar or Passport uploads).
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>2. How We Protect Your Verification Files</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            All uploaded KYC documents are processed using secure encrypted SSL gateways and stored in partitioned directories with access restricted to our compliance verification officers. These documents are never sold, rented, or shared with third-party advertising companies.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>3. Payment Details Security</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            We do not store credit card numbers, UPI PINs, or netbanking passwords on our local databases. All transactions are securely routed through PCI-DSS compliant third-party gateways (such as Razorpay).
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>4. Data Retention</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 0 }}>
            Verification documents and address logs are stored for as long as your account remains active or to comply with auditing requirements. Upon termination of your account, all sensitive KYC images are purged from our secure cloud storage directories.
          </p>

        </div>
      </section>
    </>
  );
}
