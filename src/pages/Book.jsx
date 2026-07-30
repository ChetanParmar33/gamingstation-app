import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ALL_PLANS = [
  { id: 'oneday', name: '1 Day Pass', price: 699, duration: '24 Hours', days: 1, type: 'short' },
  { id: 'twodays', name: '2 Days Pass', price: 1399, duration: '48 Hours', days: 2, type: 'short' },
  { id: 'threedays', name: '3 Days Pass', price: 1999, duration: '72 Hours', days: 3, type: 'short' },
  { id: 'fourdays', name: '4 Days Pass', price: 2699, duration: '96 Hours', days: 4, type: 'short' },
  { id: 'fivedays', name: '5 Days Pass', price: 2999, duration: '120 Hours', days: 5, type: 'short' },
  { id: 'sixdays', name: '6 Days Pass', price: 3299, duration: '144 Hours', days: 6, type: 'short' },
  { id: 'sevendays', name: '7 Days Pass', price: 3499, duration: '168 Hours', days: 7, type: 'short' },
  { id: 'fifteendays', name: '15 Days Pass', price: 4999, duration: '15 Days', days: 15, type: 'long' },
  { id: 'onemonth', name: '1 Month Sub', price: 7999, duration: '30 Days', days: 30, type: 'long' },
  { id: 'twomonths', name: '2 Months Ultimate', price: 13999, duration: '60 Days', days: 60, type: 'long' },
  { id: 'threemonths', name: '3 Months VIP', price: 19999, duration: '90 Days', days: 90, type: 'long' },
];

export default function Book() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(ALL_PLANS[0]);
  const [extraControllers, setExtraControllers] = useState(0);

  // Form info state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ text: '', isError: false });

  // Modal / Payment State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState('upi');

  // Map references
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize selected plan from URL
  useEffect(() => {
    const planId = searchParams.get('plan');
    if (planId) {
      const plan = ALL_PLANS.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [searchParams]);

  // Leaflet map setup when arriving at Step 3
  useEffect(() => {
    if (currentStep === 3) {
      // Delay initialization slightly to ensure step panel is rendered and visible in DOM
      const timer = setTimeout(() => {
        initMap();
      }, 150);

      return () => {
        clearTimeout(timer);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          markerRef.current = null;
        }
      };
    }
  }, [currentStep]);

  const initMap = () => {
    // Check if window.L (Leaflet) is loaded
    if (!window.L || mapRef.current) return;

    const L = window.L;
    const defaultCoords = [12.9716, 77.5946]; // Bangalore default center

    mapRef.current = L.map('map').setView(defaultCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    markerRef.current = L.marker(defaultCoords, { draggable: true }).addTo(mapRef.current);

    // Geocode helper
    const reverseGeocode = (lat, lng) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    };

    // Events
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLatLng();
      reverseGeocode(position.lat, position.lng);
    });

    mapRef.current.on('click', (e) => {
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      }
    });

    // Invalidate size in case layout shifts
    mapRef.current.invalidateSize();
  };

  const triggerMapSearch = () => {
    if (!searchAddress.trim() || !window.L || !mapRef.current || !markerRef.current) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);

          mapRef.current.setView([lat, lon], 14);
          markerRef.current.setLatLng([lat, lon]);
          setAddress(result.display_name);
        } else {
          alert('Location not found. Please drag the map pin manually.');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error searching for address. Please try dragging the pin.');
      });
  };

  // Controller pricing details
  const controllersCost = 199 * extraControllers * selectedPlan.days;
  const subtotalCost = selectedPlan.price + controllersCost;

  // Coupon calculations
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'GAME50') {
      discount = 50;
    } else if (appliedCoupon.code === 'GAMER10') {
      discount = Math.round(subtotalCost * 0.1);
    }
  }

  const grandTotal = Math.max(0, subtotalCost - discount);

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponMessage({ text: 'Please enter a coupon code.', isError: true });
      return;
    }

    if (code === 'GAME50') {
      setAppliedCoupon({ code: 'GAME50', type: 'flat', value: 50 });
      setCouponMessage({ text: 'Coupon GAME50 applied successfully! ₹50 Off.', isError: false });
    } else if (code === 'GAMER10') {
      setAppliedCoupon({ code: 'GAMER10', type: 'percentage', value: 10 });
      setCouponMessage({ text: 'Coupon GAMER10 applied successfully! 10% Off.', isError: false });
    } else {
      setCouponMessage({ text: 'Invalid promo code. Try GAME50 or GAMER10.', isError: true });
    }
  };

  // Wizard Nav actions
  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedPlan) {
        alert('Please choose a plan to proceed.');
        return;
      }
    } else if (currentStep === 2) {
      if (!name.trim()) {
        alert('Please enter your full name to proceed.');
        return;
      }
      const rawPhone = phone.replace(/[\s+-]/g, '');
      if (!phone.trim() || rawPhone.length < 10 || isNaN(rawPhone)) {
        alert('Please enter a valid mobile number.');
        return;
      }
    } else if (currentStep === 3) {
      if (!address.trim()) {
        alert('Please pin or specify your delivery address.');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaySecurely = () => {
    setIsRazorpayOpen(true);
  };

  const handleRazorpaySuccess = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsRazorpayOpen(false);
      navigate('/success');
    }, 2000);
  };

  const getStepPercentage = () => {
    return ((currentStep - 1) / 3) * 100;
  };

  return (
    <>
      <section className="booking-section">
        <div className="container">
          <div className="booking-grid">
            
            {/* Left Column: Wizard panel */}
            <div className="booking-wizard-card glass-card" style={{ padding: '3rem 2.5rem' }} id="booking-wizard-form">
              
              {/* Stepper Horizontal Node Progress */}
              <div className="stepper-wrapper">
                <div className="stepper-progress" style={{ width: `${getStepPercentage()}%` }}></div>
                {[
                  { num: 1, label: 'Select Plan' },
                  { num: 2, label: 'Contact Info' },
                  { num: 3, label: 'Select Location' },
                  { num: 4, label: 'Payment' }
                ].map(step => (
                  <div 
                    key={step.num}
                    className={`step-node ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}
                    onClick={() => {
                      if (step.num < currentStep) {
                        setCurrentStep(step.num);
                      }
                    }}
                    style={{ cursor: step.num < currentStep ? 'pointer' : 'default' }}
                  >
                    <div className="step-circle">{step.num}</div>
                    <span className="step-label">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: Select Plan & Controllers */}
              {currentStep === 1 && (
                <div className="booking-panel active">
                  <h3 className="panel-title">
                    <i className="fa-solid fa-gamepad" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> 
                    Select Plan & Controllers
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Choose your rental duration plan and select the number of extra controllers.
                  </p>

                  <div className="plan-select-grid">
                    {ALL_PLANS.map(plan => (
                      <div 
                        key={plan.id}
                        className={`plan-select-option ${selectedPlan.id === plan.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="plan-select-details">
                          <h4>{plan.name}</h4>
                          <p>{plan.duration} duration</p>
                        </div>
                        <span className="plan-select-price">₹{plan.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="form-field" style={{ marginTop: '2rem', borderTop: '1px solid rgba(24, 24, 27, 0.05)', paddingTop: '1.5rem' }}>
                    <label style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <i className="fa-solid fa-gamepad" style={{ color: 'var(--primary)' }}></i> Add Extra Controllers
                    </label>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                      1 DualSense controller is included free. Extra controllers are <strong>₹199 / day</strong> per controller.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(var(--primary-rgb), 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(var(--primary-rgb), 0.05)', maxWidth: '480px' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--white)', border: '1px solid rgba(24,24,27,0.1)', cursor: 'pointer' }}
                        onClick={() => setExtraControllers(prev => Math.max(0, prev - 1))}
                      >-</button>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, minWidth: '30px', textAlign: 'center', color: 'var(--text-dark)' }}>
                        {extraControllers}
                      </span>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--white)', border: '1px solid rgba(24,24,27,0.1)', cursor: 'pointer' }}
                        onClick={() => setExtraControllers(prev => Math.min(4, prev + 1))}
                      >+</button>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginLeft: 'auto' }}>
                        +₹{controllersCost.toLocaleString()} extra
                      </span>
                    </div>
                  </div>

                  <div className="wizard-buttons" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button className="btn btn-primary btn-wizard-next" onClick={handleNext}>
                      Continue to Details <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Contact Details */}
              {currentStep === 2 && (
                <div className="booking-panel active">
                  <h3 className="panel-title">
                    <i className="fa-solid fa-user-tag" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> 
                    Contact Details
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Please enter your name and phone number to start your rental booking.
                  </p>

                  <div className="form-field">
                    <label htmlFor="customer-name">Full Name</label>
                    <input 
                      type="text" 
                      id="customer-name" 
                      className="form-input" 
                      placeholder="Enter your full name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="customer-phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="customer-phone" 
                      className="form-input" 
                      placeholder="Enter your mobile number" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="wizard-buttons">
                    <button className="btn btn-secondary btn-wizard-prev" onClick={handlePrev}>
                      <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Previous
                    </button>
                    <button className="btn btn-primary btn-wizard-next" onClick={handleNext}>
                      Select Location <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Select Location */}
              {currentStep === 3 && (
                <div className="booking-panel active">
                  <h3 className="panel-title">
                    <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> 
                    Select Location
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Search for your area and pin your exact delivery location on the map.
                  </p>

                  <div className="map-search-bar">
                    <input 
                      type="text" 
                      id="map-search-input" 
                      className="form-input" 
                      placeholder="Search area, landmark or street name..."
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') triggerMapSearch(); }}
                    />
                    <button 
                      className="btn btn-primary btn-sm" 
                      id="map-search-btn" 
                      type="button"
                      onClick={triggerMapSearch}
                    >
                      <i className="fa-solid fa-magnifying-glass"></i> Search
                    </button>
                  </div>

                  <div id="map" ref={mapContainerRef} style={{ height: '320px', borderRadius: 'var(--radius-md)', border: '2px solid rgba(var(--primary-rgb), 0.1)', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}></div>

                  <div className="form-field">
                    <label htmlFor="rental-address">Confirmed Delivery Address</label>
                    <textarea 
                      id="rental-address" 
                      className="form-input" 
                      rows="2" 
                      placeholder="Confirm your street address, flat/house number, floor etc."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="wizard-buttons">
                    <button className="btn btn-secondary btn-wizard-prev" onClick={handlePrev}>
                      <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Previous
                    </button>
                    <button className="btn btn-primary btn-wizard-next" onClick={handleNext}>
                      Go to Payment <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Payment Options */}
              {currentStep === 4 && (
                <div className="booking-panel active">
                  <h3 className="panel-title">
                    <i className="fa-solid fa-credit-card" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> 
                    Secure Payment
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Select your payment option to complete your reservation securely.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div 
                      className={`payment-method-item ${paymentMethod === 'upi' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="fa-brands fa-google-pay" style={{ fontSize: '1.8rem', color: '#FFB800' }}></i>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>UPI Apps</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Google Pay, PhonePe, Paytm, BHIM</p>
                        </div>
                      </div>
                      <i className={`fa-solid ${paymentMethod === 'upi' ? 'fa-circle-check' : 'fa-circle'}`} style={{ color: paymentMethod === 'upi' ? 'var(--primary)' : 'rgba(24,24,27,0.1)', fontSize: '1.1rem' }}></i>
                    </div>

                    <div 
                      className={`payment-method-item ${paymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="fa-solid fa-credit-card" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}></i>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>Credit / Debit Cards</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Visa, MasterCard, RuPay</p>
                        </div>
                      </div>
                      <i className={`fa-solid ${paymentMethod === 'card' ? 'fa-circle-check' : 'fa-circle'}`} style={{ color: paymentMethod === 'card' ? 'var(--primary)' : 'rgba(24,24,27,0.1)', fontSize: '1.1rem' }}></i>
                    </div>

                    <div 
                      className={`payment-method-item ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="fa-solid fa-building-columns" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}></i>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>Net Banking</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>All Indian commercial banks</p>
                        </div>
                      </div>
                      <i className={`fa-solid ${paymentMethod === 'netbanking' ? 'fa-circle-check' : 'fa-circle'}`} style={{ color: paymentMethod === 'netbanking' ? 'var(--primary)' : 'rgba(24,24,27,0.1)', fontSize: '1.1rem' }}></i>
                    </div>
                  </div>

                  <div className="wizard-buttons">
                    <button className="btn btn-secondary btn-wizard-prev" onClick={handlePrev}>
                      <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Previous
                    </button>
                    <button 
                      className="btn btn-primary" 
                      id="checkout-pay-btn" 
                      style={{ flexGrow: 1, maxWidth: '300px', justifyContent: 'center' }}
                      onClick={handlePaySecurely}
                    >
                      Pay Securely <i className="fa-solid fa-credit-card" style={{ marginLeft: '0.5rem' }}></i>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Sticky invoice summary */}
            <aside className="booking-summary-column summary-sticky">
              <div className="summary-card glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.25rem', borderBottom: '1px solid rgba(24,24,27,0.05)', paddingBottom: '1rem' }}>Rental Invoice</h3>
                
                <div className="summary-details-list">
                  <div className="summary-row">
                    <span style={{ color: 'var(--text-muted)' }}>Console Pack</span>
                    <span style={{ fontWeight: 600 }}>{selectedPlan.name}</span>
                  </div>
                  <div className="summary-row">
                    <span style={{ color: 'var(--text-muted)' }}>Base Cost</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{selectedPlan.price.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span style={{ color: 'var(--text-muted)' }}>Duration Limit</span>
                    <span style={{ fontWeight: 600 }}>{selectedPlan.duration}</span>
                  </div>
                  {extraControllers > 0 && (
                    <>
                      <div className="summary-row">
                        <span style={{ color: 'var(--text-muted)' }}>Extra Controllers</span>
                        <span style={{ fontWeight: 600 }}>{extraControllers}</span>
                      </div>
                      <div className="summary-row">
                        <span style={{ color: 'var(--text-muted)' }}>Controllers Cost</span>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{controllersCost.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="summary-row" style={{ flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Included Games:</span>
                    <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                      Top Games Pre-installed + PS Plus Deluxe Sub
                    </span>
                  </div>
                </div>

                {/* Coupon Form */}
                <form onSubmit={applyCoupon} className="promo-coupon-form">
                  <input 
                    type="text" 
                    id="coupon-input" 
                    className="form-input" 
                    placeholder="PROMO CODE" 
                    aria-label="Enter promo code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" id="coupon-form-btn">Apply</button>
                </form>

                {couponMessage.text && (
                  <span 
                    id="coupon-message" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.78rem', 
                      fontWeight: 600, 
                      marginTop: '-0.8rem', 
                      marginBottom: '1rem',
                      color: couponMessage.isError ? '#EF4444' : 'var(--success)' 
                    }}
                  >
                    {couponMessage.text}
                  </span>
                )}

                <div className="summary-details-list" style={{ border: 'none', padding: 0 }}>
                  <div className="summary-row total">
                    <span>Grand Total</span>
                    <span id="summary-total">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: 'var(--success)' }}></i>
                  <span>256-bit Secure SSL Connection</span>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* RAZORPAY POPUP MODAL */}
      {isRazorpayOpen && (
        <div className="razorpay-popup open" id="razorpay-modal">
          <div className="razorpay-card">
            
            {/* Header */}
            <div className="razorpay-header">
              <div className="razorpay-header-left">
                <i className="fa-solid fa-gamepad" style={{ color: '#4A90E2', fontSize: '1.2rem' }}></i>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>GamingStation50</h4>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Order Rent Reservation</span>
                </div>
              </div>
              <button className="razorpay-close-btn" aria-label="Cancel transaction" onClick={() => setIsRazorpayOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Amount Showcase */}
            <div className="razorpay-amount-box">
              <h4>Total Rent Charges</h4>
              <span className="razorpay-amount">₹{grandTotal.toLocaleString()}</span>
            </div>

            {/* Methods Panel */}
            <div className="razorpay-methods-list">
              <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>
                Select Payment Method
              </h5>
              
              {/* Method 1: Google Pay / PhonePe UPI */}
              <div 
                className="razorpay-method-item" 
                style={{ border: razorpayMethod === 'upi' ? '1px solid #3182CE' : 'none' }}
                onClick={() => setRazorpayMethod('upi')}
              >
                <div className="razorpay-method-details">
                  <i className="fa-brands fa-google-pay" style={{ fontSize: '1.5rem', color: '#FFB800' }}></i>
                  <span>UPI Apps (Google Pay, BHIM, PhonePe)</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}></i>
              </div>

              {/* Method 2: Cards */}
              <div 
                className="razorpay-method-item" 
                style={{ border: razorpayMethod === 'card' ? '1px solid #3182CE' : 'none' }}
                onClick={() => setRazorpayMethod('card')}
              >
                <div className="razorpay-method-details">
                  <i className="fa-solid fa-credit-card" style={{ color: '#E2E8F0' }}></i>
                  <span>Card (Visa, MasterCard, RuPay)</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}></i>
              </div>

              {/* Method 3: NetBanking */}
              <div 
                className="razorpay-method-item" 
                style={{ border: razorpayMethod === 'netbanking' ? '1px solid #3182CE' : 'none' }}
                onClick={() => setRazorpayMethod('netbanking')}
              >
                <div className="razorpay-method-details">
                  <i className="fa-solid fa-building-columns" style={{ color: '#E2E8F0' }}></i>
                  <span>Netbanking (All Indian Banks)</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}></i>
              </div>
            </div>

            {/* Pay CTA */}
            <button 
              className="razorpay-pay-btn" 
              onClick={handleRazorpaySuccess}
              disabled={isProcessingPayment}
              style={{ backgroundColor: isProcessingPayment ? '#4A5568' : '#3182CE', cursor: isProcessingPayment ? 'not-allowed' : 'pointer' }}
            >
              {isProcessingPayment ? 'Processing Secure Payment...' : 'Pay Securely'}
            </button>

            {/* SSL Seal */}
            <div className="razorpay-secured">
              <i className="fa-solid fa-lock" style={{ color: '#34A853' }}></i>
              <span>Razorpay Secure Checkout • Verified PCI-DSS Compliant</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
