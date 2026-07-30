import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { GoogleOutlined, MessageOutlined, BulbOutlined, LockOutlined, PhoneOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { loginUser } from '../store/userSlice';
import { CForm, CInput, CButton, CSelect, CTabs, CModal } from '../components/custom';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginForm] = CForm.useForm();
  const [signupForm] = CForm.useForm();
  const [forgotForm] = CForm.useForm();

  const getApiUrl = (endpoint) => `http://${window.location.hostname}:5000${endpoint}`;

  // Handle Login API call
  const onLoginFinish = async (values) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: values.phone,
          password: values.password
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        dispatch(loginUser(data.user));
        message.success('Logged in successfully!');
        navigate('/');
      } else {
        message.error(data.message || 'Incorrect mobile number or password.');
      }
    } catch (err) {
      message.error('Backend connection error. Make sure your server is running on port 5000.');
    }
  };

  // Handle Signup API call
  const onSignupFinish = async (values) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
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
        message.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      message.error('Connection error. Server is unreachable.');
    }
  };

  // Handle Password Reset API call
  const onResetPasswordFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match. Please verify.');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: values.phone,
          newPassword: values.newPassword
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Password updated successfully! You can now log in.');
        setIsForgotModalOpen(false);
        forgotForm.resetFields();
        // pre-fill phone in login form
        loginForm.setFieldsValue({ phone: values.phone });
      } else {
        message.error(data.message || 'Failed to update password.');
      }
    } catch (err) {
      message.error('Connection error. Server is unreachable.');
    }
  };

  return (
    <section className="auth-wrapper-section">
      <div className="container" style={{ maxWidth: '500px' }}>
        
        <div className="auth-card glass-card">
          
          <CTabs
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Enter your mobile number and password to log in and manage your rental passes.</p>
                    
                    <CForm
                      form={loginForm}
                      layout="vertical"
                      onFinish={onLoginFinish}
                      requiredMark={false}
                    >
                      <CForm.Item
                        label="Registered Mobile Number"
                        name="phone"
                        rules={[
                          { required: true, message: 'Please enter your mobile number' },
                          { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                        ]}
                      >
                        <CInput 
                          prefix={<PhoneOutlined />}
                          addonBefore="+91" 
                          placeholder="Enter 10-digit number" 
                          size="large" 
                        />
                      </CForm.Item>

                      <CForm.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                      >
                        <CInput.Password 
                          prefix={<LockOutlined />}
                          placeholder="Enter Password" 
                          size="large" 
                        />
                      </CForm.Item>

                      <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <a 
                          href="#" 
                          className="accent-link" 
                          style={{ fontSize: '0.85rem', fontWeight: 600 }}
                          onClick={(e) => { e.preventDefault(); setIsForgotModalOpen(true); }}
                        >
                          Forgot Password?
                        </a>
                      </div>

                      <CButton 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        style={{ width: '100%', borderRadius: '12px' }}
                      >
                        Log In
                      </CButton>
                    </CForm>
                  </div>
                )
              },
              {
                key: 'signup',
                label: 'Sign Up',
                children: (
                  <div className="auth-body" style={{ paddingTop: '1.5rem' }}>
                    <h2 className="auth-title">Create Gamer Profile</h2>
                    <p className="auth-subtitle">Register to rent PS5 consoles instantly with zero security deposit.</p>
                    
                    <CForm
                      form={signupForm}
                      layout="vertical"
                      onFinish={onSignupFinish}
                      requiredMark={false}
                    >
                      <CForm.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                      >
                        <CInput prefix={<UserOutlined />} placeholder="e.g. John Doe" size="large" />
                      </CForm.Item>

                      <CForm.Item
                        label="Email Address"
                        name="email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <CInput prefix={<MailOutlined />} placeholder="name@company.com" size="large" />
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
                        label="Password"
                        name="password"
                        rules={[
                          { required: true, message: 'Please set a password' },
                          { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                      >
                        <CInput.Password prefix={<LockOutlined />} placeholder="Min 6 characters" size="large" />
                      </CForm.Item>

                      <CForm.Item
                        label="City Location"
                        name="city"
                        initialValue="Bangalore"
                      >
                        <CSelect size="large">
                          <CSelect.Option value="Bangalore">Bangalore</CSelect.Option>
                          <CSelect.Option value="Mumbai">Mumbai</CSelect.Option>
                          <CSelect.Option value="Delhi NCR">Delhi NCR</CSelect.Option>
                          <CSelect.Option value="Pune">Pune</CSelect.Option>
                          <CSelect.Option value="Hyderabad">Hyderabad</CSelect.Option>
                          <CSelect.Option value="Chennai">Chennai</CSelect.Option>
                        </CSelect>
                      </CForm.Item>
 
                      <CButton 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }}
                      >
                        Sign Up Account
                      </CButton>
                    </CForm>
                  </div>
                )
              }
            ]}
          />
 
          <div className="auth-body" style={{ borderTop: '1px solid rgba(24,24,27,0.06)', marginTop: '2rem', paddingTop: '1.5rem' }}>
            <div className="auth-divider" style={{ textAlign: 'center', margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
              <span>OR CONNECT WITH</span>
            </div>
 
            <div className="social-login-grid">
              <CButton icon={<GoogleOutlined style={{ color: '#DB4437' }} />} style={{ borderRadius: '8px' }}>Google</CButton>
              <CButton icon={<MessageOutlined style={{ color: '#7289DA' }} />} style={{ borderRadius: '8px' }}>Discord</CButton>
              <CButton icon={<BulbOutlined style={{ color: '#003087' }} />} style={{ borderRadius: '8px' }}>PSN</CButton>
            </div>
          </div>
 
        </div>
 
      </div>
 
      {/* FORGOT PASSWORD / PASSWORD RESET MODAL */}
      <CModal
        title={
          <div style={{ fontWeight: 800, fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(24,24,27,0.06)' }}>
            Reset Password
          </div>
        }
        open={isForgotModalOpen}
        onCancel={() => setIsForgotModalOpen(false)}
        footer={null}
        centered
        width={420}
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Enter your registered mobile number and set your new password directly below.
          </p>
 
          <CForm
            form={forgotForm}
            layout="vertical"
            onFinish={onResetPasswordFinish}
            requiredMark={false}
          >
            <CForm.Item
              label="Registered Mobile Number"
              name="phone"
              rules={[
                { required: true, message: 'Please enter your mobile number' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
              ]}
            >
              <CInput 
                prefix={<PhoneOutlined />}
                addonBefore="+91" 
                placeholder="Enter 10-digit number" 
                size="large" 
              />
            </CForm.Item>
 
            <CForm.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please set your new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <CInput.Password 
                prefix={<LockOutlined />}
                placeholder="Min 6 characters" 
                size="large" 
              />
            </CForm.Item>
 
            <CForm.Item
              label="Confirm New Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your new password' }]}
            >
              <CInput.Password 
                prefix={<LockOutlined />}
                placeholder="Confirm password" 
                size="large" 
              />
            </CForm.Item>
 
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <CButton 
                onClick={() => setIsForgotModalOpen(false)} 
                size="large"
                style={{ flex: 1, borderRadius: '8px' }}
              >
                Cancel
              </CButton>
              <CButton 
                type="primary" 
                htmlType="submit" 
                size="large" 
                style={{ flex: 1.5, borderRadius: '8px' }}
              >
                Reset Password
              </CButton>
            </div>
          </CForm>
        </div>
      </CModal>
 
    </section>
  );
}
