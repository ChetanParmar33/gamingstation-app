import React from 'react';

export default function LoginScreen() {
  return (
    <section id="loginScreen" className="login-screen">
      <div className="login-container">
        <div className="login-brand">
          <img src="/assets/logo.svg" alt="Gaming Station Logo" className="login-logo" />
          <h1>Gaming Station</h1>
          <p>Simple Shop &amp; Money Record</p>
        </div>

        <div id="loginErrorBox" className="login-error hidden">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>Wrong username or password.</span>
        </div>

        <form id="loginForm" className="login-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="loginUsername">Your Name (Username)</label>
            <input
              type="text"
              id="loginUsername"
              className="form-control"
              defaultValue="Amit"
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
              defaultValue="GamingStation@123"
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="login-options">
            <label className="checkbox-label">
              <input type="checkbox" id="loginRemember" defaultChecked />
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
          <button type="button" id="fillDemoCredsBtn" className="btn btn-secondary btn-sm">
            Fill Login
          </button>
        </div>
      </div>
    </section>
  );
}
