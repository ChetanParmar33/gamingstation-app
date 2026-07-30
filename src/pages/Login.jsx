import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Tabs, Form, Input, Button, Select, message } from 'antd';
import { GoogleOutlined, MessageOutlined, BulbOutlined } from '@ant-design/icons';
import { loginUser } from '../store/userSlice';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [phoneInput, setPhoneInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  // If tab switches to signup, and we have a verified phone, pre-fill it!
  useEffect(() => {
    if (activeTab === 'signup' && phoneInput) {
      signupForm.setFieldsValue({ phone: phoneInput });
    }
  }, [activeTab, phoneInput, signupForm]);

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Step 1: Request OTP from Express backend
  const handleRequestOtp = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: values.phone })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsOtpSent(true);
        setPhoneInput(values.phone);
        message.success('Verification code generated! Please check your backend terminal log.');
      } else {
        message.error(data.message || 'Failed to send OTP code.');
      }
    } catch (err) {
      message.error('Backend connection error. Make sure your server is running on port 5000.');
    }
  };

  // Step 2: Verify OTP code with Express backend
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      message.error('Please enter the full 4-digit verification code.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput, otp: enteredOtp })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.isRegistered) {
          // User already exists - log in directly
          localStorage.setItem('token', data.token);
          dispatch(loginUser(data.user));
          message.success('Logged in successfully!');
          navigate('/');
        } else {
          // User verified but not registered yet
          message.info('Verification successful! Please complete your registration profile.');
          setActiveTab('signup');
        }
      } else {
        message.error(data.message || 'Incorrect or expired verification code.');
      }
    } catch (err) {
      message.error('Error connecting to authentication service.');
    }
  };

  // Signup Submit to Express backend
  const onSignupFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        dispatch(loginUser(data.user));
        message.success('Account registered successfully! Welcome to GamingStation50!');
        navigate('/');
      } else {
        message.error(data.message || 'Failed to register account profile.');
      }
    } catch (err) {
      message.error('Connection error. Server is unreachable.');
    }
  };

  return (
    <section className="auth-wrapper-section">
      <div className="container" style={{ maxWidth: '500px' }}>
        
        <div className="auth-card glass-card">
          
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            centered
            size="large"
            items={[
              {
                key: 'login',
                label: 'Login',
                children: (
                  <div className="auth-body" style={{ paddingTop: '1.5rem' }}>
                    <h2 className="auth-title">Verify Gamer Account</h2>
                    <p className="auth-subtitle">Verify your mobile via instant OTP to manage console rentals and games swaps.</p>
                    
                    <Form
                      form={loginForm}
                      layout="vertical"
                      onFinish={handleRequestOtp}
                      requiredMark={false}
                    >
                      <Form.Item
                        label="Registered Mobile Number"
                        name="phone"
                        rules={[
                          { required: true, message: 'Please enter your mobile number' },
                          { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                        ]}
                      >
                        <Input 
                          addonBefore="+91" 
                          placeholder="Enter 10-digit number" 
                          size="large" 
                          disabled={isOtpSent}
                        />
                      </Form.Item>

                      {isOtpSent && (
                        <Form.Item label="Enter 4-Digit Security Code (OTP)" style={{ animation: 'fadeIn 0.3s ease' }}>
                          <div className="otp-row-container" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                            {otp.map((digit, idx) => (
                              <input 
                                key={idx}
                                type="text" 
                                maxLength="1" 
                                className="otp-box" 
                                ref={otpRefs[idx]}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  textAlign: 'center',
                                  fontSize: '1.25rem',
                                  fontWeight: '700',
                                  border: '1px solid var(--glass-border)',
                                  borderRadius: '8px',
                                  background: 'rgba(255,255,255,0.05)',
                                  color: 'var(--text-dark)'
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.8rem', textAlign: 'right' }}>
                            Didn't receive OTP? <a href="#" className="accent-link" onClick={(e) => { e.preventDefault(); handleRequestOtp({ phone: phoneInput }); }}>Resend Code</a>
                          </span>
                        </Form.Item>
                      )}

                      {!isOtpSent ? (
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          size="large" 
                          style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }}
                        >
                          Request OTP code
                        </Button>
                      ) : (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <Button 
                            onClick={() => { setIsOtpSent(false); setOtp(['','','','']); }} 
                            size="large"
                            style={{ flex: 1, borderRadius: '12px' }}
                          >
                            Change Number
                          </Button>
                          <Button 
                            type="primary" 
                            onClick={handleVerifyOtp} 
                            size="large" 
                            style={{ flex: 2, borderRadius: '12px' }}
                          >
                            Verify & Login
                          </Button>
                        </div>
                      )}
                    </Form>
                  </div>
                )
              },
              {
                key: 'signup',
                label: 'Sign Up',
                children: (
                  <div className="auth-body" style={{ paddingTop: '1.5rem' }}>
                    <h2 className="auth-title">Register Gamer Account</h2>
                    <p className="auth-subtitle">Create an account in 1 minute to rent consoles with zero security deposit.</p>
                    
                    <Form
                      form={signupForm}
                      layout="vertical"
                      onFinish={onSignupFinish}
                      requiredMark={false}
                    >
                      <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                      >
                        <Input placeholder="e.g. John Doe" size="large" />
                      </Form.Item>

                      <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input placeholder="name@company.com" size="large" />
                      </Form.Item>

                      <Form.Item
                        label="Mobile Number"
                        name="phone"
                        rules={[
                          { required: true, message: 'Please enter your mobile number' },
                          { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                        ]}
                      >
                        <Input addonBefore="+91" placeholder="Enter 10-digit number" size="large" />
                      </Form.Item>

                      <Form.Item
                        label="City Location"
                        name="city"
                        initialValue="Bangalore"
                      >
                        <Select size="large">
                          <Select.Option value="Bangalore">Bangalore</Select.Option>
                          <Select.Option value="Mumbai">Mumbai</Select.Option>
                          <Select.Option value="Delhi NCR">Delhi NCR</Select.Option>
                          <Select.Option value="Pune">Pune</Select.Option>
                          <Select.Option value="Hyderabad">Hyderabad</Select.Option>
                          <Select.Option value="Chennai">Chennai</Select.Option>
                        </Select>
                      </Form.Item>

                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }}
                      >
                        Sign Up Account
                      </Button>
                    </Form>
                  </div>
                )
              }
            ]}
          />

          <div className="auth-body" style={{ borderTop: '1px solid rgba(24,24,27,0.06)', marginTop: '2rem', paddingTop: '1.5rem' }}>
            <div className="auth-divider" style={{ textAlign: 'center', margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
              <span>OR CONNECT WITH</span>
            </div>

            <div className="social-login-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <Button icon={<GoogleOutlined style={{ color: '#DB4437' }} />} style={{ borderRadius: '8px' }}>Google</Button>
              <Button icon={<MessageOutlined style={{ color: '#7289DA' }} />} style={{ borderRadius: '8px' }}>Discord</Button>
              <Button icon={<BulbOutlined style={{ color: '#003087' }} />} style={{ borderRadius: '8px' }}>PSN</Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
