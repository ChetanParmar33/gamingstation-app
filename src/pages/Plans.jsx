import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Segmented, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ShoppingCartOutlined, TrophyOutlined } from '@ant-design/icons';
import { CTable, CButton } from '../components/custom';

// Plan cards data
const PASS_PLANS = [
  {
    id: 'oneday',
    name: '1 Day Session',
    tag: 'TRIAL RUN',
    price: '699',
    unit: '/ day',
    desc: 'Perfect for weekend gatherings, couch co-op nights, or testing system exclusives.',
    features: ['1 DualSense Controller', '2 Pre-loaded Games', 'Standard Support', '2-Hour Delivery Zone']
  },
  {
    id: 'threedays',
    name: '3 Days Session',
    tag: 'BEST VALUE',
    price: '1,999',
    unit: '/ 3 days',
    desc: 'Our most popular short term pass. Ideal to finish deep campaigns over the holidays.',
    features: ['1 DualSense Controller', '3 Pre-loaded Games', 'Priority Support', '2-Hour Delivery Zone']
  },
  {
    id: 'fifteendays',
    name: '15 Days Pass',
    tag: 'CAMPAIGNER',
    price: '4,999',
    unit: '/ 15 days',
    desc: 'Extended runtime pass. Complete multiple large RPGs with zero rush.',
    features: ['2 DualSense Controllers', '5 Pre-loaded Games', '1 Free Game Swap', 'Express Dispatch']
  },
  {
    id: 'onemonth',
    name: '1 Month Pass',
    tag: 'ULTIMATE UNLIMITED',
    price: '7,999',
    unit: '/ month',
    desc: 'Maximum value subscription. Complete library access and round-the-clock swapping.',
    features: ['2 DualSense Controllers', 'All SSD Games Installed', 'Unlimited Free Game Swaps', 'Instant VVIP Dispatch']
  }
];

// Detail comparison table columns
const columns = [
  {
    title: 'Feature Matrix',
    dataIndex: 'feature',
    key: 'feature',
    render: (text) => <strong style={{ color: 'var(--text-dark)' }}>{text}</strong>
  },
  {
    title: 'Short-Term (1-4 Days)',
    dataIndex: 'shortTerm',
    key: 'shortTerm',
    align: 'center'
  },
  {
    title: 'Campaigner (15 Days)',
    dataIndex: 'campaigner',
    key: 'campaigner',
    align: 'center'
  },
  {
    title: 'Pro Gamer (1-3 Months)',
    dataIndex: 'proGamer',
    key: 'proGamer',
    align: 'center'
  }
];

// Comparison table rows
const data = [
  {
    key: '1',
    feature: 'Refundable Security Deposit',
    shortTerm: <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹0 (Zero Deposit)</span>,
    campaigner: <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹0 (Zero Deposit)</span>,
    proGamer: <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹0 (Zero Deposit)</span>
  },
  {
    key: '2',
    feature: 'Included Controllers',
    shortTerm: '1x DualSense Wireless',
    campaigner: '2x DualSense Wireless',
    proGamer: '2x DualSense Wireless'
  },
  {
    key: '3',
    feature: 'SSD Pre-loaded Blockbusters',
    shortTerm: '2 - 3 Games',
    campaigner: '5 Games',
    proGamer: 'Full Library Access'
  },
  {
    key: '4',
    feature: 'Free Game Swaps',
    shortTerm: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
    campaigner: '1 Swap Included',
    proGamer: 'Unlimited Free Swaps'
  },
  {
    key: '5',
    feature: 'Doorstep Setup & Pick-up',
    shortTerm: <CheckCircleFilled style={{ color: '#52c41a' }} />,
    campaigner: <CheckCircleFilled style={{ color: '#52c41a' }} />,
    proGamer: <CheckCircleFilled style={{ color: '#52c41a' }} />
  },
  {
    key: '6',
    feature: 'KYC Document Validation',
    shortTerm: 'Standard Upload',
    campaigner: 'Standard Upload',
    proGamer: 'VVIP Fast-Track'
  }
];

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState('Short-Term');

  return (
    <>
      {/* HERO BREADCRUMB */}
      <section className="games-hero-section">
        <div className="container animate-on-scroll">
          <span className="section-tag"><i className="fa-solid fa-tags"></i> Pricing Plans</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Choose Your Battle Pass</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Flexible rentals with zero security deposits. Get the latest PS5 Console delivered, wired, and set up at your home.
          </p>

          <div style={{ marginTop: '2.5rem' }}>
            <Segmented
              options={['Short-Term', 'Long-Term Pass']}
              value={billingCycle}
              onChange={(value) => setBillingCycle(value)}
              size="large"
              style={{ padding: '4px', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {/* PLAN CARDS GRID */}
      <section className="container" style={{ paddingBottom: '4rem' }}>
        <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {PASS_PLANS.filter(p => {
            if (billingCycle === 'Short-Term') return p.id === 'oneday' || p.id === 'threedays';
            return p.id === 'fifteendays' || p.id === 'onemonth';
          }).map((plan) => (
            <div className="plan-card glass-card" key={plan.id} style={{ padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
              
              {plan.tag === 'BEST VALUE' && (
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  <Tag color="gold" icon={<TrophyOutlined />} style={{ borderRadius: '6px', fontWeight: 600, padding: '2px 8px' }}>
                    POPULAR
                  </Tag>
                </div>
              )}

              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>{plan.tag}</span>
              <h3 style={{ margin: '0.5rem 0', fontWeight: 900, fontSize: '1.45rem', color: 'var(--text-dark)' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', minHeight: '60px' }}>{plan.desc}</p>
              
              <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-dark)' }}>₹{plan.price}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{plan.unit}</span>
              </div>

              <ul className="plan-features" style={{ padding: 0, margin: '2rem 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {plan.features.map((feat, index) => (
                  <li key={index} style={{ fontSize: '0.88rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircleFilled style={{ color: 'var(--primary)', fontSize: '14px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link to={`/book?plan=${plan.id}`}>
                <CButton 
                  type={plan.tag === 'BEST VALUE' ? 'primary' : 'default'} 
                  size="large" 
                  icon={<ShoppingCartOutlined />}
                  style={{ width: '100%', borderRadius: '10px', height: '48px', fontWeight: 700 }}
                >
                  Book Rental Pass
                </CButton>
              </Link>

            </div>
          ))}
        </div>
      </section>

      {/* PLAN COMPARISON SHEET */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--text-dark)' }}>Detailed Comparison Matrix</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check exact breakdowns of swapping rules, hardware accessories, and terms.</p>
        </div>

        <CTable 
          columns={columns} 
          dataSource={data} 
          pagination={false} 
          bordered 
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      </section>
    </>
  );
}
