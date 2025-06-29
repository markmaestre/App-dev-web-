import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bod: '',
    gender: '',
    address: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      const res = await axios.post('http://localhost:4000/api/users/register', formData);

      if (res.data.message === 'User registered successfully') {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Enhanced CSS Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .register-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }
        
        .register-box {
          max-width: 32rem;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 3rem 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 
                      0 0 0 1px rgba(255, 255, 255, 0.2);
          position: relative;
          animation: slideUp 0.6s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.2);
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
        
        .register-title {
          margin-top: 0;
          margin-bottom: 0.5rem;
          text-align: center;
          font-size: 2.25rem;
          font-weight: 700;
          color: #1a202c;
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #667eea, #764ba2);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .register-subtitle {
          text-align: center;
          color: #718096;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          font-weight: 400;
        }
        
        .register-error {
          background: linear-gradient(135deg, #fed7d7, #feb2b2);
          border: 1px solid #fc8181;
          color: #c53030;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
          animation: shake 0.5s ease-in-out;
          position: relative;
          overflow: hidden;
        }
        
        .register-error::before {
          content: '⚠️';
          margin-right: 0.5rem;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2d3748;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .register-input,
        .register-select,
        .register-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 400;
          color: #2d3748;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        
        .register-input:focus,
        .register-select:focus,
        .register-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1),
                      0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .register-input:hover,
        .register-select:hover,
        .register-textarea:hover {
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }
        
        .register-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .register-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .register-button:hover::before {
          left: 100%;
        }
        
        .register-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .register-button:active {
          transform: translateY(0);
        }
        
        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .register-button:disabled:hover {
          transform: none;
          box-shadow: none;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .login-section {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .login-text {
          color: #718096;
          font-size: 0.95rem;
          margin-bottom: 0;
        }
        
        .register-link {
          font-weight: 600;
          color: #667eea;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .register-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }
        
        .register-link:hover::after {
          width: 100%;
        }
        
        .register-link:hover {
          color: #764ba2;
          transform: translateY(-1px);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        @media (max-width: 640px) {
          .register-container {
            padding: 1rem;
          }
          
          .register-box {
            padding: 2rem 1.5rem;
            border-radius: 1rem;
          }
          
          .register-title {
            font-size: 1.875rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Enhanced Register Form */}
      <div className="register-container">
        <div className="register-box">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join us and start your journey today</p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="register-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="register-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="register-input"
                placeholder="Create a strong password"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bod" className="form-label">Date of Birth</label>
                <input
                  id="bod"
                  name="bod"
                  type="date"
                  value={formData.bod}
                  onChange={handleChange}
                  className="register-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="register-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="register-textarea"
                placeholder="Enter your address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-section">
            <p className="login-text">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="register-link"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;