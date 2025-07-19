import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/api/users/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on user role
      switch(user.role) {
        case 'admin':
          navigate('/adminDashboard');
          break;
        case 'customer':
          navigate('/customerDashboard');
          break;
        default:
          navigate('/userDashboard');
      }

    } catch (err) {
      if (err.response?.status === 403) {
        setError('Your account is banned. Contact support.');
      } else if (err.response?.status === 400) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated background elements */}
      <div className="bg-elements">
        <div className="floating-leaf leaf-1">🌿</div>
        <div className="floating-leaf leaf-2">🍃</div>
        <div className="floating-leaf leaf-3">🌱</div>
        <div className="floating-leaf leaf-4">🌿</div>
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      <div className="login-box">
        <div className="login-header">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L18 9v6l-6 3.5-6-3.5V9l6-3.5z"/>
              <path d="M12 12l-4-2v4l4 2 4-2v-4l-4 2z"/>
            </svg>
            <div className="logo-pulse"></div>
          </div>
          <h2>Welcome to Login</h2>
          <p>Sign in to manage your farm operations</p>
        </div>
        
        {error && (
          <div className="error-message animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={`form-group ${focusedInput === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
            <label htmlFor="email">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                placeholder="farmer@example.com"
              />
              <div className="input-highlight"></div>
            </div>
          </div>
          
          <div className={`form-group ${focusedInput === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
            <label htmlFor="password">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Password
            </label>
            <div className="input-wrapper">
              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <div className="eye-animation">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 6a9.77 9.77 0 018.82 5.5 9.647 9.647 0 01-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68A11.738 11.738 0 001 11.5C2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.48 0-6.82-2.04-8.47-5.33.47-1.01 1.1-1.94 1.87-2.72z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    )}
                  </div>
                </button>
              </div>
              <div className="input-highlight"></div>
            </div>
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bars">
                <div className={`bar ${formData.password.length >= 4 ? 'active' : ''}`}></div>
                <div className={`bar ${formData.password.length >= 6 ? 'active' : ''}`}></div>
                <div className={`bar ${formData.password.length >= 8 ? 'active' : ''}`}></div>
                <div className={`bar ${formData.password.length >= 10 ? 'active' : ''}`}></div>
              </div>
            </div>
          )}

          <div className="forgot-password">
            <button type="button" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <div className="loading-state">
                <div className="spinner-advanced"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="button-content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                </svg>
                <span>Sign In</span>
                <div className="button-ripple"></div>
              </div>
            )}
          </button>
        </form>

        <div className="register-prompt">
          <div className="divider">
            <span>New to FarmConnect?</span>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="register-button"
          >
            <div className="button-content">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>Create Farmer Account</span>
              <div className="button-ripple"></div>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .floating-leaf {
          position: absolute;
          font-size: 2rem;
          opacity: 0.3;
          animation: float 6s ease-in-out infinite;
        }
        
        .leaf-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .leaf-2 { top: 20%; right: 15%; animation-delay: 2s; }
        .leaf-3 { bottom: 15%; left: 20%; animation-delay: 4s; }
        .leaf-4 { bottom: 25%; right: 10%; animation-delay: 1s; }
        
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 8s ease-in-out infinite;
        }
        
        .circle-1 {
          width: 80px;
          height: 80px;
          top: 15%;
          right: 20%;
          animation-delay: 0s;
        }
        
        .circle-2 {
          width: 120px;
          height: 120px;
          bottom: 20%;
          left: 15%;
          animation-delay: 3s;
        }
        
        .circle-3 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 10%;
          animation-delay: 5s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
        
        .login-box {
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.1);
          padding: 50px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 2;
          animation: slideUp 0.8s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #4CAF50, #45A049);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
          position: relative;
          animation: logoFloat 3s ease-in-out infinite;
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .logo svg {
          width: 40px;
          height: 40px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .logo-pulse {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4CAF50, #45A049);
          opacity: 0.3;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        .login-header h2 {
          color: #2E7D32;
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
          background: linear-gradient(135deg, #2E7D32, #4CAF50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .login-header p {
          color: #558B2F;
          font-size: 16px;
          margin-top: 0;
          opacity: 0.8;
        }
        
        .form-group {
          margin-bottom: 30px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .form-group.focused {
          transform: translateY(-2px);
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          color: #33691E;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .form-group.focused label {
          color: #2E7D32;
          transform: translateX(5px);
        }
        
        .form-group label svg {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        .form-group.focused label svg {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .form-group input {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid #E8F5E8;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          background: linear-gradient(135deg, #F8FFF8, #F1F8E9);
          color: #33691E;
          position: relative;
        }
        
        .form-group input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15);
          outline: none;
          background: #fff;
          transform: translateY(-1px);
        }
        
        .form-group input::placeholder {
          color: #A5D6A7;
          transition: all 0.3s ease;
        }
        
        .form-group.focused input::placeholder {
          opacity: 0.7;
          transform: translateX(5px);
        }
        
        .input-highlight {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(135deg, #4CAF50, #45A049);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .form-group.focused .input-highlight {
          width: 100%;
        }
        
        .password-input {
          position: relative;
        }
        
        .toggle-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #558B2F;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .toggle-password:hover {
          background: rgba(76, 175, 80, 0.1);
          color: #2E7D32;
          transform: translateY(-50%) scale(1.1);
        }
        
        .eye-animation {
          transition: all 0.3s ease;
        }
        
        .toggle-password:active .eye-animation {
          transform: scale(0.9);
        }
        
        .toggle-password svg {
          width: 22px;
          height: 22px;
        }
        
        .password-strength {
          margin-top: 8px;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .strength-bars {
          display: flex;
          gap: 4px;
          height: 4px;
        }
        
        .bar {
          flex: 1;
          background: #E0E0E0;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .bar.active {
          background: linear-gradient(135deg, #4CAF50, #45A049);
          transform: scaleY(1.2);
        }
        
        .login-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #4CAF50 0%, #45A049 50%, #2E7D32 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          margin-top: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }
        
        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #45A049 0%, #2E7D32 50%, #1B5E20 100%);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
        }
        
        .login-button:active:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .login-button:disabled {
          background: linear-gradient(135deg, #A5D6A7, #C8E6C9);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        
        .button-content svg {
          width: 22px;
          height: 22px;
          margin-right: 10px;
          transition: all 0.3s ease;
        }
        
        .login-button:hover:not(:disabled) .button-content svg {
          transform: translateX(3px);
        }
        
        .button-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: all 0.6s ease;
        }
        
        .login-button:active:not(:disabled) .button-ripple {
          width: 300px;
          height: 300px;
        }
        
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .spinner-advanced {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
          color: #C62828;
          padding: 18px;
          border-radius: 12px;
          margin-bottom: 30px;
          font-size: 15px;
          display: flex;
          align-items: center;
          border-left: 5px solid #C62828;
          box-shadow: 0 4px 12px rgba(198, 40, 40, 0.2);
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .error-message svg {
          width: 22px;
          height: 22px;
          margin-right: 12px;
          flex-shrink: 0;
        }
        
        .forgot-password {
          text-align: right;
          margin-bottom: 25px;
        }
        
        .forgot-password button {
          background: none;
          border: none;
          color: #558B2F;
          font-size: 14px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .forgot-password button:hover {
          background: rgba(76, 175, 80, 0.1);
          color: #2E7D32;
          transform: translateX(-3px);
        }
        
        .register-prompt {
          text-align: center;
          margin-top: 35px;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 30px 0;
          color: #81C784;
          font-size: 15px;
          font-weight: 600;
        }
        
        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 2px solid #E8F5E8;
        }
        
        .divider::before {
          margin-right: 20px;
        }
        
        .divider::after {
          margin-left: 20px;
        }
        
        .register-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #fff, #f8f9fa);
          color: #2E7D32;
          border: 2px solid #4CAF50;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
        }
        
        .register-button:hover {
          background: linear-gradient(135deg, #F1F8E9, #E8F5E8);
          border-color: #45A049;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }
        
        .register-button:active {
          transform: translateY(-1px);
        }
        
        .register-button .button-content svg {
          width: 22px;
          height: 22px;
          margin-right: 10px;
          transition: all 0.3s ease;
        }
        
        .register-button:hover .button-content svg {
          transform: rotate(90deg);
        }
        
        @media (max-width: 480px) {
          .login-box {
            padding: 30px;
            margin: 10px;
          }
          
          .login-header h2 {
            font-size: 28px;
          }
          
          .form-group input {
            padding: 14px 16px;
          }
          
          .floating-leaf {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;