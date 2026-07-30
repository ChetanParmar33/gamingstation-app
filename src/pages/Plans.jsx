import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Plans() {
  const [searchParams] = useSearchParams();
  const [isLongTerm, setIsLongTerm] = useState(false);

  useEffect(() => {
    const term = searchParams.get('term');
    if (term === 'long') {
      setIsLongTerm(true);
    } else if (term === 'short') {
      setIsLongTerm(false);
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
          {/* Toggle Switch */}
          <div className="toggle-container">
            <span className={`toggle-label ${!isLongTerm ? 'active' : ''}`} onClick={() => setIsLongTerm(false)}>Short Term</span>
            <div 
              className={`toggle-switch ${isLongTerm ? 'active' : ''}`} 
              onClick={() => setIsLongTerm(!isLongTerm)}
              role="button" 
              aria-label="Toggle rental plan durations" 
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsLongTerm(!isLongTerm); }}
            >
              <span className="toggle-slider"></span>
            </div>
            <span className={`toggle-label ${isLongTerm ? 'active' : ''}`} onClick={() => setIsLongTerm(true)}>Long Term</span>
          </div>

          {/* Pricing Grid */}
          <div className="plans-grid">
            {!isLongTerm ? (
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
                  <Link to="/book?plan=oneday" className="btn btn-secondary">Select Plan</Link>
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
                  <Link to="/book?plan=twodays" className="btn btn-primary">Select Plan</Link>
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
                  <Link to="/book?plan=threedays" className="btn btn-secondary">Select Plan</Link>
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
                  <Link to="/book?plan=fourdays" className="btn btn-secondary">Select Plan</Link>
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
                  <Link to="/book?plan=fifteendays" className="btn btn-secondary">Select Plan</Link>
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
                  <Link to="/book?plan=onemonth" className="btn btn-primary">Select Plan</Link>
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
                  <Link to="/book?plan=twomonths" className="btn btn-secondary">Select Plan</Link>
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
                  <Link to="/book?plan=threemonths" className="btn btn-secondary">Select Plan</Link>
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

          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Features & Specs</th>
                  <th>1 Day</th>
                  <th>2 Days</th>
                  <th>3 Days</th>
                  <th>5 Days</th>
                  <th>7 Days</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-coins"></i> Rental Fee</td>
                  <td className="compare-price">₹699</td>
                  <td className="compare-price">₹1,399</td>
                  <td className="compare-price">₹1,999</td>
                  <td className="compare-price">₹2,999</td>
                  <td className="compare-price">₹3,499</td>
                </tr>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-gamepad"></i> Included Controllers</td>
                  <td>1x Included</td>
                  <td>1x Included</td>
                  <td>1x Included</td>
                  <td>1x Included</td>
                  <td>1x Included</td>
                </tr>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-compact-disc"></i> Included Games</td>
                  <td>Pre-installed + PS Plus Deluxe</td>
                  <td>Pre-installed + PS Plus Deluxe</td>
                  <td>Pre-installed + PS Plus Deluxe</td>
                  <td>Pre-installed + PS Plus Deluxe</td>
                  <td>Pre-installed + PS Plus Deluxe</td>
                </tr>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-rotate"></i> Free Game Swaps</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-shield-halved"></i> Security Deposit</td>
                  <td>KYC Only</td>
                  <td>KYC Only</td>
                  <td>KYC Only</td>
                  <td>KYC Only</td>
                  <td>KYC Only</td>
                </tr>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-truck-fast"></i> Delivery Priority</td>
                  <td>Standard</td>
                  <td>Standard</td>
                  <td>Express</td>
                  <td>Express</td>
                  <td>VIP (Immediate)</td>
                </tr>
                <tr>
                  <td className="compare-feature-title"><i className="fa-solid fa-headset"></i> Support Service</td>
                  <td>9AM - 9PM</td>
                  <td>9AM - 9PM</td>
                  <td>24/7 Helpline</td>
                  <td>24/7 Helpline</td>
                  <td>VIP Concierge</td>
                </tr>
              </tbody>
            </table>
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
              <p>Submit a digital copy of your Aadhaar Card, Passport, or Driver's License during the checkout stage.</p>
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
              <h2 style={{ color: 'var(--white)', marginBottom: '1rem' }}>Ready to Begin Your Next-Gen Adventure?</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                Reserve your PS5 package today with zero security deposit. Includes sanitized controllers, wiring, and pre-installed blockbusters.
              </p>
              <Link to="/book" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'var(--white)', color: 'var(--primary)' }}>Proceed to Booking Wizard</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
