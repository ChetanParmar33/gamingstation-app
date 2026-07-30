import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('Bangalore');

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleaned && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Focus previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'login') {
      const rawPhone = phone.replace(/[\s+-]/g, '');
      if (rawPhone.length < 10 || isNaN(rawPhone)) {
        alert('Please enter a valid 10-digit registered phone number.');
        return;
      }
      const enteredOtp = otp.join('');
      if (enteredOtp.length < 4) {
        alert('Please enter the full 4-digit verification code.');
        return;
      }
      alert('Logged in successfully!');
      navigate('/');
    } else {
      if (!signupName.trim()) {
        alert('Please enter your full name.');
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      const rawPhone = signupPhone.replace(/[\s+-]/g, '');
      if (rawPhone.length < 10 || isNaN(rawPhone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }
      alert('Verification OTP sent successfully! Please switch to the Login tab to verify.');
      setActiveTab('login');
      setPhone(signupPhone);
    }
  };

  return (
    <section className="auth-wrapper-section">
      <div className="container" style={{ maxWidth: '500px' }}>
        
        {/* Auth Form Card */}
        <div className="auth-card glass-card">
          
          {/* Navigation Tabs */}
          <div className="auth-tabs">
            <button 
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`} 
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-body">
            <h2 className="auth-title" id="auth-form-title">
              {activeTab === 'login' ? 'Verify Gamer Account' : 'Register Gamer Account'}
            </h2>
            <p className="auth-subtitle">
              {activeTab === 'login' 
                ? 'Verify your mobile via instant OTP to manage console rentals and games swaps.' 
                : 'Create an account in 1 minute to rent consoles with zero security deposit.'}
            </p>

            <form onSubmit={handleAuthSubmit}>
              {/* Login Fields */}
              {activeTab === 'login' ? (
                <div id="login-fields-container" className="auth-fields-block">
                  <div className="form-field">
                    <label htmlFor="login-phone">Registered Mobile Number</label>
                    <div className="phone-input-wrapper">
                      <span className="phone-prefix">+91</span>
                      <input 
                        type="tel" 
                        id="login-phone" 
                        className="form-input" 
                        style={{ margin: 0 }} 
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* OTP Inputs row */}
                  <div className="form-field" style={{ marginTop: '1.5rem' }}>
                    <label>Enter 4-Digit Security Code (OTP)</label>
                    <div className="otp-row-container">
                      {otp.map((digit, idx) => (
                        <input 
                          key={idx}
                          type="text" 
                          maxLength="1" 
                          className="otp-box" 
                          aria-label={`Digit ${idx + 1}`}
                          ref={otpRefs[idx]}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.8rem', textAlign: 'right' }}>
                      Didn't receive OTP? <a href="#" className="accent-link" onClick={(e) => { e.preventDefault(); alert('Security code resent successfully!'); }}>Resend Code</a>
                    </span>
                  </div>
                </div>
              ) : (
                /* Signup Fields */
                <div id="signup-fields-container" className="auth-fields-block">
                  <div className="form-field">
                    <label htmlFor="signup-name">Full Name</label>
                    <input 
                      type="text" 
                      id="signup-name" 
                      className="form-input" 
                      placeholder="e.g. John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="signup-email">Email Address</label>
                    <input 
                      type="email" 
                      id="signup-email" 
                      className="form-input" 
                      placeholder="name@company.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="signup-phone">Mobile Number</label>
                    <div className="phone-input-wrapper">
                      <span className="phone-prefix">+91</span>
                      <input 
                        type="tel" 
                        id="signup-phone" 
                        className="form-input" 
                        style={{ margin: 0 }} 
                        placeholder="Enter 10-digit number"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="signup-city">City Location</label>
                    <select 
                      id="signup-city" 
                      className="form-input" 
                      style={{ fontFamily: 'inherit' }}
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                    >
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit action */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }} 
                id="auth-submit-btn"
              >
                {activeTab === 'login' ? 'Request OTP / Login' : 'Sign Up Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR CONNECT WITH</span>
            </div>

            {/* Social Button Grid */}
            <div className="social-login-grid">
              <button className="social-login-btn"><i className="fa-brands fa-google" style={{ color: '#DB4437' }}></i> Google</button>
              <button className="social-login-btn"><i className="fa-brands fa-discord" style={{ color: '#7289DA' }}></i> Discord</button>
              <button className="social-login-btn"><i className="fa-brands fa-playstation" style={{ color: '#003087' }}></i> PSN</button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
