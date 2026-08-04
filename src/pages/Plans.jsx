import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleFilled, CloseCircleFilled, ShoppingCartOutlined, TrophyOutlined } from '@ant-design/icons';
import { CTable, CButton, CTag } from '../components/custom';

// Plan cards data
const PASS_PLANS = [
  {
    id: 'oneday',
    name: '1 Day Session',
    tag: 'TRIAL RUN',
    price: '999',
    unit: '/ day',
    desc: 'Perfect for quick gatherings, co-op nights, or testing system exclusives.',
    features: ['1 DualSense Controller', '400+ Games Loaded', 'Standard Support', '2-Hour Delivery Zone']
  },
  {
    id: 'twodays',
    name: '2 Days Session',
    tag: 'WEEKEND PASS',
    price: '1,899',
    unit: '/ 2 days',
    desc: 'Great for an immersive gaming experience over a short break or weekend.',
    features: ['1 DualSense Controller', '400+ Games Loaded', 'Standard Support', '2-Hour Delivery Zone']
  },
  {
    id: 'threedays',
    name: '3 Days Session',
    tag: 'MID-WEEK PASS',
    price: '2,599',
    unit: '/ 3 days',
    desc: 'Perfect short term pass to complete deep campaigns or play multiple games.',
    features: ['1 DualSense Controller', '400+ Games Loaded', 'Priority Support', '2-Hour Delivery Zone']
  },
  {
    id: 'fourdays',
    name: '4 Days Pass',
    tag: 'PRO GAMER',
    price: '2,999',
    unit: '/ 4 days',
    desc: 'Excellent choice for multi-day gaming sessions with absolute comfort.',
    features: ['1 DualSense Controller', '400+ Games Loaded', 'Priority Support', '2-Hour Delivery Zone']
  },
  {
    id: 'fivedays',
    name: '5 Days Pass',
    tag: 'ELITE PASS',
    price: '3,699',
    unit: '/ 5 days',
    desc: 'Maximize your weekly gaming target with your favorite titles.',
    features: ['1 DualSense Controller', '400+ Games Loaded', 'Priority Support', '2-Hour Delivery Zone']
  },
  {
    id: 'sixdays',
    name: '6 Days Pass',
    tag: 'CHAMPION',
    price: '3,999',
    unit: '/ 6 days',
    desc: 'Spend nearly a full week exploring next-gen blockbusters.',
    features: ['1 DualSense Controller', '400+ Games Loaded', 'Priority Support', '2-Hour Delivery Zone']
  },
  {
    id: 'sevendays',
    name: '7 Days Pass',
    tag: 'BEST VALUE',
    price: '4,599',
    unit: '/ 7 days',
    desc: 'Our complete week-long ultimate unlimited gaming experience.',
    features: ['1 DualSense Controller', 'All SSD Games Installed', 'Unlimited Free Game Swaps', 'Instant VVIP Dispatch']
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
    title: 'Standard Pass (1-6 Days)',
    dataIndex: 'shortTerm',
    key: 'shortTerm',
    align: 'center'
  },
  {
    title: 'Weekly Pass (7 Days)',
    dataIndex: 'weeklyPass',
    key: 'weeklyPass',
    align: 'center'
  }
];

// Comparison table rows
const data = [
  {
    key: '1',
    feature: 'Refundable Security Deposit',
    shortTerm: <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹0 (Zero Deposit)</span>,
    weeklyPass: <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹0 (Zero Deposit)</span>
  },
  {
    key: '2',
    feature: 'Included Controllers',
    shortTerm: '1x DualSense Wireless',
    weeklyPass: '1x DualSense Wireless (Extra available)'
  },
  {
    key: '3',
    feature: 'SSD Pre-loaded Blockbusters',
    shortTerm: '400+ Games Access',
    weeklyPass: 'All SSD Games Installed'
  },
  {
    key: '4',
    feature: 'Free Game Swaps',
    shortTerm: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
    weeklyPass: 'Unlimited Free Swaps'
  },
  {
    key: '5',
    feature: 'Doorstep Setup & Pick-up',
    shortTerm: <CheckCircleFilled style={{ color: '#52c41a' }} />,
    weeklyPass: <CheckCircleFilled style={{ color: '#52c41a' }} />
  },
  {
    key: '6',
    feature: 'KYC Document Validation',
    shortTerm: 'Standard Upload',
    weeklyPass: 'Standard Upload'
  }
];

export default function Plans() {
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
        </div>
      </section>

      {/* PLAN CARDS GRID */}
      <section className="container" style={{ paddingBottom: '4rem' }}>
        <div className="plans-grid">
          {PASS_PLANS.map((plan) => (
            <div className="plan-card glass-card" key={plan.id} style={{ padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
              
              {plan.tag === 'BEST VALUE' && (
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  <CTag color="gold" icon={<TrophyOutlined />} style={{ borderRadius: '6px', fontWeight: 600, padding: '2px 8px' }}>
                    POPULAR
                  </CTag>
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

        <div className="plans-table-container">
          <CTable 
            columns={columns} 
            dataSource={data} 
            pagination={false} 
            bordered 
            style={{ borderRadius: '12px', overflow: 'hidden' }}
          />
        </div>
      </section>
    </>
  );
}

