import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('contact-', '')]: value
    }));
  };

  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container animate-on-scroll">
          <span className="section-tag"><i className="fa-solid fa-headset"></i> Support Desk</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get In Touch</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about document verification, custom packages, or accessories rentals? Our response team is here to assist.
          </p>
        </div>
      </section>

      {/* CONTACT BODY CONTENT */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div className="tracking-layout-grid">
          
          {/* Inquiry Form */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--text-dark)' }}>Send Message</h3>
            
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--success)' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Message Sent Successfully!</h4>
                <p style={{ color: 'var(--text-muted)' }}>We will get back to you within 2 hours.</p>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ marginTop: '1.5rem' }} 
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group-grid">
                  <div className="form-field">
                    <label htmlFor="contact-name">Your Full Name</label>
                    <input 
                      type="text" 
                      id="contact-name" 
                      className="form-input" 
                      required 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email">Email Address</label>
                    <input 
                      type="email" 
                      id="contact-email" 
                      className="form-input" 
                      required 
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">Inquiry Subject</label>
                  <input 
                    type="text" 
                    id="contact-subject" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Bulk Booking for Event"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">Detailed Message</label>
                  <textarea 
                    id="contact-message" 
                    className="form-input" 
                    style={{ height: '140px', fontFamily: 'inherit', resize: 'none' }} 
                    required 
                    placeholder="Type details here..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button className="btn btn-primary" type="submit" style={{ marginTop: '1rem' }}>
                  Send Message <i className="fa-solid fa-paper-plane" style={{ marginLeft: '0.5rem' }}></i>
                </button>
              </form>
            )}
          </div>

          {/* Contact Information Grid */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-dark)' }}>Direct Channels</h3>
            
            <div className="contact-item">
              <i className="fa-solid fa-phone" style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', padding: '1.2rem', borderRadius: '50px', fontSize: '1.3rem' }}></i>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>Hotline Support</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>+91 99887 76655 (9 AM - 9 PM Daily)</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fa-brands fa-whatsapp" style={{ background: 'rgba(var(--success-rgb), 0.08)', color: 'var(--success)', padding: '1.2rem', borderRadius: '50px', fontSize: '1.3rem' }}></i>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>WhatsApp Assistant</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>+91 99887 76655 (Automated Updates & Chat)</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fa-solid fa-envelope" style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', padding: '1.2rem', borderRadius: '50px', fontSize: '1.3rem' }}></i>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>Email Correspondence</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>support@gamingstation50.com</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fa-solid fa-location-dot" style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', padding: '1.2rem', borderRadius: '50px', fontSize: '1.3rem' }}></i>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>Operating Headquarters</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Indiranagar Operational Hub, Sector 4, Bangalore, KA, India</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
