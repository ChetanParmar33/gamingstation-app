import React from 'react';
import { Collapse } from 'antd';

const FAQ_LIST = [
  {
    key: '1',
    label: 'Is there a security deposit required for console rentals?',
    children: (
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        No! GamingStation50 works on a deposit-free policy. We only require a quick digital KYC submission (such as Aadhaar card, rent agreement, or company/student ID card) during checkout.
      </p>
    )
  },
  {
    key: '2',
    label: 'How does the Free Game Swap facility work?',
    children: (
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Depending on your selected rental plan, you are permitted a specific number of game disc swaps. You can request a swap directly through your account dashboard or WhatsApp, and our agent will visit to exchange your current game disc with the new one.
      </p>
    )
  },
  {
    key: '3',
    label: 'What accessories are included in the bundle packaging?',
    children: (
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Each console bundle contains: 1x Sony PlayStation 5 (Ultra HD Disc Edition), 1x DualSense Wireless Controller (a second controller is included in specific higher plans), 1x HDMI Cable, 1x Power Cord, 1x Controller charging cable, and a protective carry case.
      </p>
    )
  },
  {
    key: '4',
    label: 'How fast is the delivery and setup completed?',
    children: (
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        We guarantee a 2-hour delivery timeline inside active municipal zones of operational cities. Our delivery executive will also complete the physical connection and wire setup on your television screen to ensure everything is functional before leaving.
      </p>
    )
  },
  {
    key: '5',
    label: 'What happens if the equipment gets accidentally damaged?',
    children: (
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Minor wear and tear on controllers (such as standard cosmetic scratches) is fully covered by us. In case of major physical damage or system hardware failure due to liquid spills or drops, repair charges will be evaluated and billed as per our terms.
      </p>
    )
  },
  {
    key: '6',
    label: 'Do you provide games with the console, or should I buy them?',
    children: (
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        All our PS5 consoles come with top blockbuster games pre-installed on the SSD. In addition, we provide a PS5 Plus Deluxe Subscription included with the rental, which allows you to download and play any other game from the official PlayStation games library for free!
      </p>
    )
  }
];

export default function FAQ() {
  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container animate-on-scroll">
          <span className="section-tag"><i className="fa-solid fa-circle-question"></i> Help Center</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Have questions regarding game swap approvals, security terms, setup guides, or delivery slots? Browse our answers below.
          </p>
        </div>
      </section>

      {/* FAQ ACCORDION LIST */}
      <section className="container" style={{ paddingBottom: '6rem', maxWidth: '800px' }}>
        <Collapse 
          items={FAQ_LIST} 
          defaultActiveKey={['1']} 
          ghost 
          expandIconPosition="end"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--glass-shadow)'
          }}
        />
      </section>
    </>
  );
}
