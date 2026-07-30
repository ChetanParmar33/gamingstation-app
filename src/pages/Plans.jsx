import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Table, Button, Segmented, Card } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, TagsOutlined, IdcardOutlined, ArrowRightOutlined, InfoCircleOutlined } from '@ant-design/icons';

const COMPARE_COLUMNS = [
  {
    title: 'Features & Specs',
    dataIndex: 'feature',
    key: 'feature',
    render: (text) => <strong style={{ color: 'var(--text-dark)' }}>{text}</strong>
  },
  { title: '1 Day', dataIndex: 'oneday', key: 'oneday' },
  { title: '2 Days', dataIndex: 'twodays', key: 'twodays' },
  { title: '3 Days', dataIndex: 'threedays', key: 'threedays' },
  { title: '15 Days', dataIndex: 'fifteendays', key: 'fifteendays' },
  { title: '30 Days', dataIndex: 'onemonth', key: 'onemonth' }
];

const COMPARE_DATA = [
  {
    key: '1',
    feature: 'Rental Fee',
    oneday: '₹699',
    twodays: '₹1,399',
    threedays: '₹1,999',
    fifteendays: '₹4,999',
    onemonth: '₹7,999'
  },
  {
    key: '2',
    feature: 'DualSense Controllers',
    oneday: '1x Included',
    twodays: '1x Included',
    threedays: '1x Included',
    fifteendays: '1x Included',
    onemonth: '2x Included'
  },
  {
    key: '3',
    feature: 'Included Games',
    oneday: 'Pre-installed + PS Plus',
    twodays: 'Pre-installed + PS Plus',
    threedays: 'Pre-installed + PS Plus',
    fifteendays: 'Pre-installed + PS Plus',
    onemonth: 'Pre-installed + PS Plus'
  },
  {
    key: '4',
    feature: 'Free Game Swaps',
    oneday: 'None',
    twodays: '1 Swap',
    threedays: '1 Swap',
    fifteendays: '2 Swaps',
    onemonth: '4 Swaps'
  },
  {
    key: '5',
    feature: 'Security Deposit',
    oneday: 'KYC Only',
    twodays: 'KYC Only',
    threedays: 'KYC Only',
    fifteendays: 'KYC Only',
    onemonth: 'KYC Only'
  },
  {
    key: '6',
    feature: 'Delivery Speed',
    oneday: '2 Hours Standard',
    twodays: '2 Hours Standard',
    threedays: '2 Hours Standard',
    fifteendays: 'Express (1 Hour)',
    onemonth: 'VIP Priority'
  }
];

export default function Plans() {
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState('Short Term');

  useEffect(() => {
    const termParam = searchParams.get('term');
    if (termParam === 'long') {
      setTerm('Long Term');
    } else {
      setTerm('Short Term');
    }
  }, [searchParams]);

  return (
    <>
      {/* BREADCRUMBS BANNER */}
      <section className="games-hero-section">
        <div className="container">
          <span className="section-tag"><i className="fa-solid fa-tags"></i> Transparency</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Console Rental Plans</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Explore flexible plans tailored for every gaming need. Short-term sessions for weekend parties, or long-term passes for deep gaming campaigns.
          </p>
        </div>
      </section>

      {/* PRICING TOGGLE SYSTEM */}
      <section className="plans-section" style={{ background: 'none', border: 'none', paddingTop: '2rem' }}>
        <div className="container">
          
          {/* Ant Design Segmented Control */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
            <Segmented
              options={['Short Term', 'Long Term']}
              value={term}
              onChange={(value) => setTerm(value)}
              size="large"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                padding: '4px',
                borderRadius: '50px'
              }}
            />
          </div>

          {/* Pricing Grid */}
          <div className="plans-grid">
            {term === 'Short Term' ? (
              <>
                {/* Card 1 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">1 Day Plan</h3>
                    <p className="plan-duration">24 Hours of pure gaming</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">699</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li className="disabled"><i className="fas fa-times-circle"></i> Extra Controller</li>
                  </ul>
                  <Link to="/book?plan=oneday" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>

                {/* Card 2 */}
                <div className="plan-card glass-card recommended">
                  <span className="plan-badge">Best Seller</span>
                  <div className="plan-header">
                    <h3 className="plan-name">2 Days Plan</h3>
                    <p className="plan-duration">48 Hours gaming session</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">1,399</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li className="disabled"><i className="fas fa-times-circle"></i> Extra Controller</li>
                  </ul>
                  <Link to="/book?plan=twodays" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button type="primary" size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>

                {/* Card 3 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">3 Days Plan</h3>
                    <p className="plan-duration">Perfect for long weekends</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">1,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li><i className="fas fa-check-circle"></i> 24/7 Support Assistance</li>
                  </ul>
                  <Link to="/book?plan=threedays" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>

                {/* Card 4 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">4 Days Plan</h3>
                    <p className="plan-duration">Great for weekly holidays</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">2,699</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li><i className="fas fa-check-circle"></i> Zero Security Deposit*</li>
                  </ul>
                  <Link to="/book?plan=fourdays" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Long Term Card 1 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">15 Days Pass</h3>
                    <p className="plan-duration">Half-month gaming pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">4,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> 2 free physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & setup</li>
                    <li className="disabled"><i className="fas fa-times-circle"></i> Free controllers repair</li>
                  </ul>
                  <Link to="/book?plan=fifteendays" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>

                {/* Long Term Card 2 */}
                <div className="plan-card glass-card recommended">
                  <span className="plan-badge">Best Value</span>
                  <div className="plan-header">
                    <h3 className="plan-name">1 Month Sub</h3>
                    <p className="plan-duration">30 Days deep gaming pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">7,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 2x DualSense Controllers</li>
                    <li><i className="fas fa-check-circle"></i> 4 free physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> VIP immediate priority dispatch</li>
                    <li><i className="fas fa-check-circle"></i> Free door repair support</li>
                  </ul>
                  <Link to="/book?plan=onemonth" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button type="primary" size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>

                {/* Long Term Card 3 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">2 Months Ultimate</h3>
                    <p className="plan-duration">60 Days ultimate pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">13,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 2x DualSense Controllers</li>
                    <li><i className="fas fa-check-circle"></i> Unlimited physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> VIP immediate priority dispatch</li>
                    <li><i className="fas fa-check-circle"></i> Free door repair support</li>
                  </ul>
                  <Link to="/book?plan=twomonths" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>

                {/* Long Term Card 4 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">3 Months VIP</h3>
                    <p className="plan-duration">90 Days hardcode gamer pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">19,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 2x DualSense Controllers</li>
                    <li><i className="fas fa-check-circle"></i> Unlimited physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> VIP immediate priority dispatch</li>
                    <li><i className="fas fa-check-circle"></i> Free door repair support</li>
                  </ul>
                  <Link to="/book?plan=threemonths" style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                    <Button size="large" style={{ width: '100%', borderRadius: '8px' }}>Select Plan</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PLANS COMPARISON TABLE */}
      <section className="compare-section" id="compare-plans">
        <div className="container">
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-list-check"></i> Compare Features</span>
            <h2 className="section-title">Detailed Plan Comparison</h2>
            <p className="section-desc">Review a side-by-side breakdown of the features and benefits offered in each tier.</p>
          </div>

          <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--glass-shadow)',
            padding: '1.5rem'
          }}>
            <Table 
              columns={COMPARE_COLUMNS} 
              dataSource={COMPARE_DATA} 
              pagination={false} 
              bordered={false}
              size="middle"
            />
          </div>
        </div>
      </section>

      {/* KYC & DELIVERY REQUIREMENTS SECTION */}
      <section className="how-section" style={{ backgroundColor: 'rgba(108, 43, 255, 0.01)', borderTop: '1px solid rgba(24, 24, 27, 0.05)' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-clipboard-check"></i> Verification</span>
            <h2 className="section-title">KYC & Delivery Policy</h2>
            <p className="section-desc">Frictionless documentation process. Get verified in under 15 minutes before dispatch.</p>
          </div>

          <div className="why-grid" style={{ marginTop: '3.5rem' }}>
            <div className="why-card glass-card">
              <div className="why-icon"><i className="fa-solid fa-id-card"></i></div>
              <h3>1. Primary ID Check</h3>
              <p>Submit a digital copy of your Aadhaar Card, Passport, or Driver\'s License during the checkout stage.</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon"><i className="fa-solid fa-house-laptop"></i></div>
              <h3>2. Address Proof</h3>
              <p>Provide a utility bill, broadband bill, or rent agreement matching your selected delivery address.</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon"><i className="fa-solid fa-briefcase"></i></div>
              <h3>3. Work / College Proof</h3>
              <p>Verify your professional status using your company work email ID or a valid student ID card.</p>
            </div>
          </div>

          <div className="newsletter-card" style={{ marginTop: '5rem', background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)' }}>
            <div className="text-center">
              <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Ready to Begin Your Next-Gen Adventure?</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                Reserve your PS5 package today with zero security deposit. Includes sanitized controllers, wiring, and pre-installed blockbusters.
              </p>
              <Link to="/book">
                <Button size="large" type="primary" style={{ height: '54px', padding: '0 40px', fontSize: '1.05rem', background: '#ffffff', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                  Proceed to Booking Wizard <ArrowRightOutlined />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
