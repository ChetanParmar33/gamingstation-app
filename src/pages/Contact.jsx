import React from 'react';
import { message } from 'antd';
import { MailOutlined, PhoneOutlined, SendOutlined, CompassOutlined, MessageOutlined } from '@ant-design/icons';
import { CForm, CInput, CButton } from '../components/custom';

export default function Contact() {
  const [form] = CForm.useForm();

  const onFinish = (values) => {
    message.success('Message sent successfully! We will get back to you within 2 hours.');
    form.resetFields();
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
            
            <CForm
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                <CForm.Item
                  label="Your Full Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                  style={{ margin: 0 }}
                >
                  <CInput placeholder="e.g. John Doe" size="large" />
                </CForm.Item>
                <CForm.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                  style={{ margin: 0 }}
                >
                  <CInput placeholder="name@domain.com" size="large" />
                </CForm.Item>
              </div>

              <CForm.Item
                label="Inquiry Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <CInput placeholder="e.g. Bulk Booking for Event" size="large" />
              </CForm.Item>

              <CForm.Item
                label="Detailed Message"
                name="message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <CInput.TextArea placeholder="Type details here..." rows={5} />
              </CForm.Item>

              <CForm.Item style={{ marginBottom: 0 }}>
                <CButton 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />} 
                  size="large"
                  style={{ width: '100%', borderRadius: '12px' }}
                >
                  Send Message
                </CButton>
              </CForm.Item>
            </CForm>
          </div>

          {/* Contact Information Grid */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-dark)' }}>Direct Channels</h3>
            
            <div className="contact-item" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneOutlined style={{ fontSize: '20px' }} />
              </div>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Hotline Support</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>+91 99887 76655 (9 AM - 9 PM Daily)</p>
              </div>
            </div>

            <div className="contact-item" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--success)', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageOutlined style={{ fontSize: '20px' }} />
              </div>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>WhatsApp Assistant</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>+91 99887 76655 (Automated Updates & Chat)</p>
              </div>
            </div>

            <div className="contact-item" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MailOutlined style={{ fontSize: '20px' }} />
              </div>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Email Correspondence</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>support@gamingstation50.com</p>
              </div>
            </div>

            <div className="contact-item" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CompassOutlined style={{ fontSize: '20px' }} />
              </div>
              <div className="contact-info-text">
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Operating Headquarters</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Indiranagar Operational Hub, Sector 4, Bangalore, KA, India</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
