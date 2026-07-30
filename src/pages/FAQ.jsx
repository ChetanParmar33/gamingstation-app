import React, { useState } from 'react';

const FAQ_LIST = [
  {
    question: 'Is there a security deposit required for console rentals?',
    answer: 'No! GamingStation50 works on a deposit-free policy. We only require a quick digital KYC submission (such as Aadhaar card, rent agreement, or company/student ID card) during checkout.'
  },
  {
    question: 'How does the Free Game Swap facility work?',
    answer: 'Depending on your selected rental plan, you are permitted a specific number of game disc swaps. You can request a swap directly through your account dashboard or WhatsApp, and our agent will visit to exchange your current game disc with the new one.'
  },
  {
    question: 'What accessories are included in the bundle packaging?',
    answer: 'Each console bundle contains: 1x Sony PlayStation 5 (Ultra HD Disc Edition), 1x DualSense Wireless Controller (a second controller is included in specific higher plans), 1x HDMI Cable, 1x Power Cord, 1x Controller charging cable, and a protective carry case.'
  },
  {
    question: 'How fast is the delivery and setup completed?',
    answer: 'We guarantee a 2-hour delivery timeline inside active municipal zones of operational cities. Our delivery executive will also complete the physical connection and wire setup on your television screen to ensure everything is functional before leaving.'
  },
  {
    question: 'What happens if the equipment gets accidentally damaged?',
    answer: 'Minor wear and tear on controllers (such as standard cosmetic scratches) is fully covered by us. In case of major physical damage or system hardware failure due to liquid spills or drops, repair charges will be evaluated and billed as per our terms.'
  },
  {
    question: 'Do you provide games with the console, or should I buy them?',
    answer: 'All our PS5 consoles come with top blockbuster games pre-installed on the SSD. In addition, we provide a PS5 Plus Deluxe Subscription included with the rental, which allows you to download and play any other game from the official PlayStation games library for free!'
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {FAQ_LIST.map((faq, idx) => (
            <div 
              key={idx} 
              className={`accordion-item glass-card ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => toggleAccordion(idx)}
              style={{ cursor: 'pointer' }}
            >
              <div className="accordion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)' }}>{faq.question}</h4>
                <span className="accordion-icon"><i className={`fa-solid fa-${activeIndex === idx ? 'minus' : 'plus'}`}></i></span>
              </div>
              <div 
                className="accordion-body"
                style={{ 
                  display: activeIndex === idx ? 'block' : 'none',
                  paddingTop: '1rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
