import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      const { _id, username, role } = res.data.user;
     localStorage.setItem('user', JSON.stringify({ _id, username, role }));

      
      
      const successNotification = document.createElement('div');
      successNotification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          padding: 18px 24px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(22, 163, 74, 0.3);
          z-index: 1000;
          font-weight: 600;
          font-size: 15px;
          animation: slideIn 0.3s ease;
          border-left: 4px solid #22c55e;
        ">
          Welcome back, ${username}! 🌾
        </div>
      `;
      document.body.appendChild(successNotification);
      
      setTimeout(() => {
        document.body.removeChild(successNotification);
      }, 3000);

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/adminDashboard');
        } else if (role === 'user') {
          navigate('/userDashboard');
        } else {
          setErrors({ general: 'Unknown user role' });
        }
      }, 1500);
    } catch (err) {
      console.error('Login Error:', err);
      setErrors({ 
        general: err.response?.data?.message || 'Invalid credentials. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Enhanced Background */}
      <div className="bg-pattern">
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
        <div className="gradient-mesh"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="login-wrapper">
        {/* Enhanced Login Card */}
        <div className="login-card">
          {/* Professional Header */}
          <div className="brand-header">
            <div className="brand-logo">
              <div className="logo-container">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L20 8H28L22 14L24 22L16 18L8 22L10 14L4 8H12L16 2Z" fill="currentColor" fillOpacity="0.9"/>
                    <path d="M16 6L18 10H22L19 13L20 17L16 15L12 17L13 13L10 10H14L16 6Z" fill="currentColor" fillOpacity="0.6"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="brand-text">
              <h1>SmartFarm</h1>
              <p className="tagline">Professional Agricultural Management Platform</p>
            </div>
          </div>

          {/* Enhanced Error Alert */}
          {errors.general && (
            <div className="error-alert">
              <div className="error-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 4h2v5H7V4zM7 11h2v2H7v-2z"/>
                </svg>
              </div>
              <div className="error-content">
                <span className="error-title">Authentication Failed</span>
                <span className="error-message">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Enhanced Form */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Email Address</span>
                <span className="label-required">*</span>
              </label>
              <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
                <div className="input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <div className="input-border"></div>
              </div>
              {errors.email && (
                <div className="error-text">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 4h2v5H7V4zM7 11h2v2H7v-2z"/>
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">
                  <span className="label-text">Password</span>
                  <span className="label-required">*</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  </svg>
                  Forgot Password?
                </Link>
              </div>
              <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
                <div className="input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
                <div className="input-border"></div>
              </div>
              {errors.password && (
                <div className="error-text">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 4h2v5H7V4zM7 11h2v2H7v-2z"/>
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
            >
              <div className="btn-content">
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10,17 15,12 10,7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    <span>Sign In to SmartFarm</span>
                  </>
                )}
              </div>
              <div className="btn-shine"></div>
            </button>
          </form>

          {/* Enhanced Register Section */}
          <div className="register-section">
            <div className="divider">
              <span>New to SmartFarm?</span>
            </div>
            <div className="register-card">
              <div className="register-content">
                <h3>Join Our Platform</h3>
                <p>Connect with thousands of farmers and transform your agricultural operations with cutting-edge digital solutions.</p>
                <Link to="/register" className="register-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Create Your Account
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="login-footer">
          <p>&copy; 2024 SmartFarm. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/support">Support</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .floating-particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(16, 185, 129, 0.4);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 60%; left: 20%; animation-delay: 1s; }
        .particle-3 { top: 40%; left: 80%; animation-delay: 2s; }
        .particle-4 { top: 80%; left: 60%; animation-delay: 3s; }
        .particle-5 { top: 10%; left: 70%; animation-delay: 4s; }
        .particle-6 { top: 70%; left: 30%; animation-delay: 5s; }

        .gradient-mesh {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: 0 0, 0 0;
          animation: gridMove 20s linear infinite;
        }

        .login-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
        }

        .brand-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .brand-logo {
          margin-bottom: 24px;
          display: inline-block;
        }

        .logo-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 20px 40px rgba(16, 185, 129, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .logo-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
          border-radius: 20px;
        }

        .logo-icon {
          color: white;
          position: relative;
          z-index: 1;
        }

        .brand-text h1 {
          margin: 0 0 8px 0;
          font-size: 36px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          margin: 0;
          font-size: 15px;
          color: #64748b;
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        .error-alert {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          border: 1px solid #fca5a5;
          border-radius: 12px;
          margin-bottom: 32px;
          border-left: 4px solid #ef4444;
          position: relative;
          overflow: hidden;
        }

        .error-alert::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
        }

        .error-icon {
          width: 24px;
          height: 24px;
          background: #ef4444;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .error-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .error-title {
          font-size: 14px;
          font-weight: 700;
          color: #dc2626;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .error-message {
          font-size: 14px;
          color: #991b1b;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .label-text {
          color: #374151;
        }

        .label-required {
          color: #ef4444;
          font-size: 16px;
        }

        .form-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #10b981;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid transparent;
        }

        .forgot-link:hover {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .input-wrapper {
          position: relative;
          transition: all 0.3s ease;
        }

        .input-wrapper.focused {
          transform: translateY(-2px);
        }

        .input-prefix {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .input-wrapper.focused .input-prefix {
          color: #10b981;
        }

        .input-wrapper.error .input-prefix {
          color: #ef4444;
        }

        .form-input {
          width: 100%;
          padding: 20px 20px 20px 56px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          color: #1f2937;
          background: #ffffff;
          transition: all 0.3s ease;
          outline: none;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .input-wrapper.focused .form-input {
          border-color: #10b981;
          background: #f9fafb;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .input-wrapper.error .form-input {
          border-color: #ef4444;
          background: #fef2f2;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .form-input:disabled {
          background: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 0 0 12px 12px;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .input-wrapper.focused .input-border {
          transform: scaleX(1);
        }

        .password-toggle {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .password-toggle:hover {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .error-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #ef4444;
          font-weight: 600;
          margin-top: 8px;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.05);
          border-radius: 8px;
          border-left: 3px solid #ef4444;
        }

        .submit-btn {
          width: 100%;
          padding: 0;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          height: 64px;
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          height: 100%;
          position: relative;
          z-index: 2;
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, #059669, #047857);
        }

        .submit-btn:hover:not(:disabled) .btn-shine {
          left: 100%;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .register-section {
          margin-top: 32px;
        }

        .divider {
          position: relative;
          text-align: center;
          margin-bottom: 24px;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        }

        .divider span {
          background: rgba(255, 255, 255, 0.98);
          padding: 0 24px;
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .register-card {
          background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          border: 1px solid #a7f3d0;
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          border-left: 4px solid #10b981;
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
        }

        .register-content {
          text-align: center;
        }

        .register-content h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
        }

        .register-content p {
          margin: 0 0 24px 0;
          font-size: 15px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.6;
        }

        .register-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-decoration: none;
          font-weight: 700;
          border-radius: 12px;
          transition: all 0.3s ease;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 0.025em;
          box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
          position: relative;
          overflow: hidden;
        }

        .register-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .register-link:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(16, 185, 129, 0.4);
        }

        .register-link:hover::before {
          left: 100%;
        }

        .login-footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 500;
        }

        .login-footer p {
          margin: 0 0 12px 0;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .footer-links a:hover {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-container {
            padding: 16px;
          }

          .login-card {
            padding: 36px 28px;
            border-radius: 20px;
          }

          .brand-text h1 {
            font-size: 32px;
          }

          .tagline {
            font-size: 14px;
          }

          .logo-container {
            width: 72px;
            height: 72px;
          }

          .form-input {
            padding: 18px 18px 18px 52px;
            font-size: 15px;
          }

          .submit-btn {
            height: 60px;
          }

          .btn-content {
            font-size: 15px;
          }

          .register-card {
            padding: 28px 24px;
          }

          .footer-links {
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 12px;
          }
          
          .login-card {
            padding: 32px 24px;
            border-radius: 16px;
          }

          .brand-text h1 {
            font-size: 28px;
          }

          .logo-container {
            width: 64px;
            height: 64px;
          }

          .form-input {
            padding: 16px 16px 16px 48px;
          }

          .submit-btn {
            height: 56px;
          }

          .register-card {
            padding: 24px 20px;
          }

          .register-content h3 {
            font-size: 18px;
          }

          .register-content p {
            font-size: 14px;
          }

          .footer-links {
            flex-direction: column;
            gap: 8px;
          }
        }

        /* Enhanced focus states for accessibility */
        .form-input:focus-visible,
        .password-toggle:focus-visible,
        .forgot-link:focus-visible,
        .register-link:focus-visible,
        .submit-btn:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .login-card {
            border: 2px solid #000;
            box-shadow: none;
          }

          .form-input {
            border: 2px solid #000;
          }

          .submit-btn {
            border: 2px solid #000;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;