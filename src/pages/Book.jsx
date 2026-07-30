import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  CompassOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UploadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import {
  setStep,
  selectPlan,
  setExtraControllers,
  updateCustomerInfo,
  applyPromoCode,
  setTotalAmount,
  markAsPaid,
  resetBooking
} from '../store/bookingSlice';
import { CForm, CInput, CButton, CCard, CSelect, CSteps, CInputNumber } from '../components/custom';

const PLAN_PRICES = {
  'oneday': { name: '1 Day Plan', price: 699 },
  'twodays': { name: '2 Days Plan', price: 1399 },
  'threedays': { name: '3 Days Plan', price: 1999 },
  'fourdays': { name: '4 Days Plan', price: 2699 },
  'fifteendays': { name: '15 Days Pass', price: 4999 },
  'onemonth': { name: '1 Month Subscription', price: 7999 },
  'twomonths': { name: '2 Months Ultimate', price: 13999 },
  'threemonths': { name: '3 Months VIP Gamer', price: 19999 }
};

const EXTRA_CONTROLLER_COST_PER_DAY = 150;

export default function Book() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
  const currentStep = useSelector((state) => state.booking.currentStep);
  const selectedPlanId = useSelector((state) => state.booking.selectedPlanId);
  const extraControllers = useSelector((state) => state.booking.extraControllers);
  const customerInfo = useSelector((state) => state.booking.customerInfo);
  const promoCode = useSelector((state) => state.booking.promoCode);
  const discount = useSelector((state) => state.booking.discount);
  const totalAmount = useSelector((state) => state.booking.totalAmount);

  // Local state for UI
  const [mapSearchText, setMapSearchText] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form2] = CForm.useForm();
  const [form3] = CForm.useForm();

  // Leaflet references
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Initialize selected plan from URL
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && PLAN_PRICES[planParam]) {
      dispatch(selectPlan(planParam));
    }
  }, [searchParams]);

  // Recalculate billing summary
  const baseCost = PLAN_PRICES[selectedPlanId]?.price || 699;
  const durationDays = selectedPlanId === 'oneday' ? 1 :
                       selectedPlanId === 'twodays' ? 2 :
                       selectedPlanId === 'threedays' ? 3 :
                       selectedPlanId === 'fourdays' ? 4 :
                       selectedPlanId === 'fifteendays' ? 15 :
                       selectedPlanId === 'onemonth' ? 30 :
                       selectedPlanId === 'twomonths' ? 60 : 90;

  const controllerCharges = extraControllers * EXTRA_CONTROLLER_COST_PER_DAY * durationDays;
  const finalSubtotal = baseCost + controllerCharges;
  const grandTotal = Math.max(0, finalSubtotal - discount);

  useEffect(() => {
    dispatch(setTotalAmount(grandTotal));
  }, [grandTotal]);

  // Sync Form 2 fields with Redux state
  useEffect(() => {
    form2.setFieldsValue({
      name: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email
    });
  }, [customerInfo]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (currentStep === 2 && mapContainerRef.current && !mapRef.current) {
      const defaultLatLng = [12.9716, 77.5946]; // Bangalore
      const initialCoordinates = customerInfo.coordinates || defaultLatLng;

      // Mount Map
      const mapInstance = window.L.map(mapContainerRef.current).setView(initialCoordinates, 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Create Draggable Marker
      const markerInstance = window.L.marker(initialCoordinates, { draggable: true }).addTo(mapInstance);
      
      mapRef.current = mapInstance;
      markerRef.current = markerInstance;

      // Handle marker dragend
      markerInstance.on('dragend', () => {
        const position = markerInstance.getLatLng();
        reverseGeocode(position.lat, position.lng);
      });

      // If coordinates weren't set yet, do reverse-geocode for default center
      if (!customerInfo.address) {
        reverseGeocode(initialCoordinates[0], initialCoordinates[1]);
      }
    }

    return () => {
      if (currentStep !== 2 && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [currentStep]);

  // Geocoding and Reverse Geocoding via OSM Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        dispatch(updateCustomerInfo({ 
          address: data.display_name,
          coordinates: [lat, lng]
        }));
        form3.setFieldsValue({ address: data.display_name });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleMapSearch = async () => {
    if (!mapSearchText) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchText)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
          markerRef.current.setLatLng([latitude, longitude]);
          dispatch(updateCustomerInfo({ 
            address: display_name,
            coordinates: [latitude, longitude]
          }));
          form3.setFieldsValue({ address: display_name });
        }
      } else {
        message.warning('No locations found. Try a different search query.');
      }
    } catch (error) {
      message.error('Geocoding service unavailable.');
    }
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'GAME50') {
      dispatch(applyPromoCode({ code: 'GAME50', discount: 50 }));
      message.success('Promo code GAME50 applied! Saved ₹50.');
    } else if (code === 'GAMER10') {
      const tenPercent = Math.round(finalSubtotal * 0.1);
      dispatch(applyPromoCode({ code: 'GAMER10', discount: tenPercent }));
      message.success(`Promo code GAMER10 applied! Saved ₹${tenPercent}.`);
    } else {
      message.error('Invalid promo code.');
    }
  };

  // Nav Step Submits
  const handleStep1Submit = () => {
    dispatch(setStep(1));
  };

  const handleStep2Submit = (values) => {
    dispatch(updateCustomerInfo(values));
    dispatch(setStep(2));
  };

  const handleStep3Submit = () => {
    if (!customerInfo.address) {
      message.warning('Please search or pin a location on the map first.');
      return;
    }
    dispatch(setStep(3));
  };

  // Multipart Form Submit to Express Backend
  const handleBookingSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Please log in or register to complete your rental booking.');
      navigate('/login');
      return;
    }

    if (!screenshotFile) {
      message.error('Please upload a screenshot of your successful UPI payment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('planId', selectedPlanId);
      formData.append('extraControllers', extraControllers);
      formData.append('name', customerInfo.name);
      formData.append('phone', customerInfo.phone);
      formData.append('email', customerInfo.email);
      formData.append('address', customerInfo.address);
      formData.append('coordinates', JSON.stringify(customerInfo.coordinates || [12.9716, 77.5946]));
      formData.append('totalAmount', totalAmount);
      formData.append('promoCode', promoCode || '');
      formData.append('screenshot', screenshotFile);

      const response = await fetch(`http://${window.location.hostname}:5000/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Booking requested! Awaiting payment verification.');
        dispatch(markAsPaid(true));
        navigate('/success');
      } else {
        message.error(data.message || 'Failed to submit booking request.');
      }
    } catch (err) {
      message.error('Connection error. Is backend server running on port 5000?');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate real dynamic QR code based on amount
  const upiLink = `upi://pay?pa=gamingstation50@upi&pn=GamingStation50&am=${totalAmount}&cu=INR&tn=GS50%20Console%20Rental`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  return (
    <section className="booking-wizard-wrapper" style={{ paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Steps Indicator */}
        <div style={{ padding: '2.5rem 0' }}>
          <CSteps
            current={currentStep}
            onChange={(step) => {
              if (step < currentStep) dispatch(setStep(step));
            }}
            items={[
              { title: 'Pass Details', icon: <ShoppingOutlined /> },
              { title: 'Contact', icon: <UserOutlined /> },
              { title: 'Location', icon: <EnvironmentOutlined /> },
              { title: 'Invoice & Pay', icon: <DollarOutlined /> }
            ]}
          />
        </div>

        {/* STEP 1: PLAN SELECTION & CONTROLLERS */}
        {currentStep === 0 && (
          <CCard style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              Configure Rental Package
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.8rem', color: 'var(--text-dark)' }}>
                Select Rental Pass Duration:
              </label>
              <select 
                className="form-input" 
                value={selectedPlanId} 
                onChange={(e) => dispatch(selectPlan(e.target.value))}
                style={{ width: '100%', height: '50px', fontSize: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0 1rem', background: 'var(--glass-bg)', color: 'var(--text-dark)' }}
              >
                <optgroup label="Short-Term Session Plans">
                  <option value="oneday">1 Day Rent — ₹699</option>
                  <option value="twodays">2 Days Rent — ₹1,399</option>
                  <option value="threedays">3 Days Rent — ₹1,999</option>
                  <option value="fourdays">4 Days Rent — ₹2,699</option>
                </optgroup>
                <optgroup label="Long-Term Campaign Passes">
                  <option value="fifteendays">15 Days Pass — ₹4,999</option>
                  <option value="onemonth">1 Month Subscription — ₹7,999</option>
                  <option value="twomonths">2 Months Ultimate — ₹13,999</option>
                  <option value="threemonths">3 Months VIP Gamer — ₹19,999</option>
                </optgroup>
              </select>
            </div>

            <div className="booking-addon-item">
              <div>
                <h5 style={{ fontWeight: 700, margin: 0, fontSize: '0.98rem', color: 'var(--text-dark)' }}>Additional DualSense Controller</h5>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Add secondary controllers for multiplayer co-op sessions (+₹150/day).
                </p>
              </div>
              <CInputNumber
                min={0}
                max={3}
                value={extraControllers}
                onChange={(val) => dispatch(setExtraControllers(val || 0))}
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CButton type="primary" size="large" onClick={handleStep1Submit} style={{ padding: '0 2rem' }}>
                Continue to Details
              </CButton>
            </div>
          </CCard>
        )}

        {/* STEP 2: CONTACT INFORMATION */}
        {currentStep === 1 && (
          <CCard style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              Contact Information
            </h3>

            <CForm
              form={form2}
              layout="vertical"
              onFinish={handleStep2Submit}
              requiredMark={false}
            >
              <CForm.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <CInput prefix={<UserOutlined />} placeholder="Jane Doe" size="large" />
              </CForm.Item>

              <CForm.Item
                label="Mobile Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter your mobile number' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                ]}
              >
                <CInput prefix={<PhoneOutlined />} addonBefore="+91" placeholder="Enter 10-digit number" size="large" />
              </CForm.Item>

              <CForm.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <CInput prefix={<MailOutlined />} placeholder="jane.doe@gmail.com" size="large" />
              </CForm.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <CButton size="large" onClick={() => dispatch(setStep(0))}>
                  Back
                </CButton>
                <CButton type="primary" htmlType="submit" size="large">
                  Select Location
                </CButton>
              </div>
            </CForm>
          </CCard>
        )}

        {/* STEP 3: LOCATION ADDRESS MAP */}
        {currentStep === 2 && (
          <CCard style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              Confirm Delivery Location
            </h3>
            
            <div className="search-group">
              <CInput 
                prefix={<CompassOutlined />} 
                placeholder="Search neighborhood or society, e.g. Indiranagar, Bangalore" 
                value={mapSearchText}
                onChange={(e) => setMapSearchText(e.target.value)}
                onPressEnter={handleMapSearch}
                size="large"
              />
              <CButton type="primary" onClick={handleMapSearch} size="large">
                Search
              </CButton>
            </div>

            {/* LEAFLET MAP ELEMENT */}
            <div 
              ref={mapContainerRef} 
              style={{ 
                height: '350px', 
                width: '100%', 
                borderRadius: '12px', 
                marginBottom: '1.5rem',
                border: '1px solid var(--glass-border)',
                zIndex: 1
              }}
            ></div>

            <CForm form={form3} layout="vertical">
              <CForm.Item label="Detailed Address (Auto-selected or modify)">
                <CInput.TextArea
                  rows={3}
                  value={customerInfo.address}
                  onChange={(e) => dispatch(updateCustomerInfo({ address: e.target.value }))}
                  placeholder="Street name, flat number, landmark details"
                  size="large"
                />
              </CForm.Item>
            </CForm>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <CButton size="large" onClick={() => dispatch(setStep(1))}>
                Back
              </CButton>
              <CButton type="primary" size="large" onClick={handleStep3Submit}>
                Go to Payment
              </CButton>
            </div>
          </CCard>
        )}

        {/* STEP 4: INVOICE SUMMARY & PAY via QR */}
        {currentStep === 3 && (
          <div className="booking-payment-grid">
            
            {/* Invoice Left Panel */}
            <CCard style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
                Order Invoice Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(24,24,27,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{PLAN_PRICES[selectedPlanId]?.name} Base Rent</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>₹{baseCost}</span>
                </div>
                
                {extraControllers > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Extra Controller ({extraControllers} qty x {durationDays} days)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>+₹{controllerCharges}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Discount ({promoCode})</span>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>-₹{discount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>KYC Verification Fee</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>FREE</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Doorstep Express Setup & Pickup</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>FREE</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem' }}>
                <CInput 
                  placeholder="Enter Coupon Code" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  size="large"
                />
                <CButton type="primary" onClick={handleApplyPromo} size="large">
                  Apply
                </CButton>
              </div>

              {/* Grand Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(var(--primary-rgb),0.05)', padding: '1.2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>Grand Total</span>
                <span style={{ fontWeight: 900, fontSize: '1.65rem', color: 'var(--primary)' }}>₹{grandTotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CButton size="large" onClick={() => dispatch(setStep(2))}>
                  Back
                </CButton>
              </div>
            </CCard>

            {/* QR Scanner & Screenshot Upload Right Panel */}
            <CCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h4 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                  Pay via UPI QR Code
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                  Scan code using GPay, PhonePe, Paytm, or BHIM to complete transaction.
                </p>

                {/* UPI QR Canvas image */}
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI Payment QR Code" 
                    style={{ width: '180px', height: '180px', display: 'block' }}
                  />
                </div>

                <div style={{ background: 'rgba(9,47,148,0.04)', border: '1px solid rgba(9,47,148,0.08)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '1.8rem' }}>
                  UPI Ref: gamingstation50@upi
                </div>

                {/* Screenshot Uploader Input */}
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                    Attach Payment Screenshot:
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files ? e.target.files[0] : null)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-dark)',
                      marginBottom: '1.5rem',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              <CButton 
                type="primary" 
                size="large" 
                icon={<CheckCircleOutlined />}
                onClick={handleBookingSubmit}
                loading={isSubmitting}
                style={{ width: '100%', borderRadius: '12px', height: '50px', background: '#22c55e', borderColor: '#22c55e', fontWeight: 700 }}
              >
                Submit Booking Ticket
              </CButton>
            </CCard>

          </div>
        )}

      </div>
    </section>
  );
}
