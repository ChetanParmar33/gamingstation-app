import React from 'react';

export default function Cancellation() {
  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container animate-on-scroll">
          <span className="section-tag"><i className="fa-solid fa-arrows-spin"></i> Refund Terms</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Cancellation Policy</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Read our rules regarding booking cancellations, rescheduling, and processing refunds.
          </p>
        </div>
      </section>

      {/* CANCELLATION BODY CONTENT */}
      <section className="container" style={{ paddingBottom: '6rem', maxWidth: '900px' }}>
        <div className="glass-card animate-on-scroll" style={{ padding: '4rem 3.5rem' }}>
          
          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>1. Cancellation Prior to Dispatch</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            You can cancel your console rental reservation at any point prior to the shipment being dispatched from our operational hub (usually up to 2 hours before the scheduled delivery slot). A full refund will be processed back to your original payment channel.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>2. Cancellation Post-Dispatch / Rejection</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            If you cancel the order after the delivery executive has left our hub, or if you refuse delivery at your doorstep, a flat logistics/convenience fee of ₹150 will be deducted, and the remaining amount will be refunded.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>3. Rescheduling Policy</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            You can reschedule your rental duration dates free of charge up to 6 hours before delivery. Rescheduling requests must be sent through WhatsApp support or customer portal dashboards.
          </p>

          <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>4. Refund Timelines</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 0 }}>
            All approved refunds are initiated instantly. Depending on your financial bank, the credited amount will reflect in your account within 3 to 5 business days for cards/netbanking, or instantly for UPI transactions.
          </p>

        </div>
      </section>
    </>
  );
}
