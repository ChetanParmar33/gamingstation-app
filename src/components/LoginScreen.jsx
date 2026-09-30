import React, { useState } from 'react';

export default function LoginScreen() {
  const [username, setUsername] = useState('Amit');
  const [password, setPassword] = useState('GamingStation@123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!window.GZ || !window.GZ.Auth) return;

    const res = window.GZ.Auth.login(username, password, remember);
    if (res.ok) {
      setError('');
      window.GZ.App.showAppShell();
      window.GZ.App.refreshAllViews();
      window.GZ.Utils.toast('Welcome back, Amit! Gaming Station Dashboard is live.', 'success');
    } else {
      setError(res.error || 'Wrong username or password.');
    }
  };

  const handleFillDemo = () => {
    setUsername('Amit');
    setPassword('GamingStation@123');
    setError('');
  };

  return (
    <section id="loginScreen" className="login-screen">
      <div className="login-container">
        <div className="login-brand">
          <img src="/assets/logo.svg" alt="Gaming Station Logo" className="login-logo" />
          <h1>Gaming Station</h1>
          <p>Simple Shop &amp; Money Record</p>
        </div>

        <div id="loginErrorBox" className={`login-error ${error ? '' : 'hidden'}`}>
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error || 'Wrong username or password.'}</span>
        </div>

        <form id="loginForm" className="login-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginUsername">Your Name (Username)</label>
            <input
              type="text"
              id="loginUsername"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter Amit"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="login-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="loginRemember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span>Keep me logged in</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.75rem', fontSize: '1rem' }}>
            Open Gaming Station Records
          </button>
        </form>

        <div className="login-hint-box">
          <div>
            <div>
              Login ID: <code>Amit</code> &nbsp;|&nbsp; Password: <code>GamingStation@123</code>
            </div>
          </div>
          <button type="button" id="fillDemoCredsBtn" className="btn btn-secondary btn-sm" onClick={handleFillDemo}>
            Fill Login
          </button>
        </div>
      </div>
    </section>
  );
}
