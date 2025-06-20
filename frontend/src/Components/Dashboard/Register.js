import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Cloud, Droplets, Sun, Thermometer, Wind, Leaf, Sprout } from 'lucide-react';

function Register() {
  const navigate = useNavigate(); // ✅ Create navigate function
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bod: '',
    gender: 'Male',
    address: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/auth/register', formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.log('Registration Error:', err);
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div style={styles.container}>
      {/* Floating Weather Icons */}
      <div style={styles.weatherIcons}>
        <div style={{...styles.floatingIcon, ...styles.icon1}}>
          <Sun size={24} color="#f59e0b" />
        </div>
        <div style={{...styles.floatingIcon, ...styles.icon2}}>
          <Cloud size={20} color="#60a5fa" />
        </div>
        <div style={{...styles.floatingIcon, ...styles.icon3}}>
          <Droplets size={18} color="#3b82f6" />
        </div>
        <div style={{...styles.floatingIcon, ...styles.icon4}}>
          <Wind size={22} color="#6b7280" />
        </div>
        <div style={{...styles.floatingIcon, ...styles.icon5}}>
          <Leaf size={20} color="#10b981" />
        </div>
      </div>

      <div style={styles.formWrapper}>
        {/* Header with Agricultural Theme */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <Sprout size={32} color="#059669" />
            </div>
            <Thermometer size={28} color="#f59e0b" style={styles.thermometer} />
          </div>
          <h2 style={styles.title}>AgriWeather Pro</h2>
          <p style={styles.subtitle}>Join the Smart Farming Revolution</p>
          <div style={styles.tagline}>
            <span style={styles.taglineText}>🌾 Predict • Plan • Prosper</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>👤 Farmer Username</span>
            </label>
            <input 
              name="username" 
              placeholder="Enter your farming username" 
              onChange={handleChange} 
              required 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>📧 Email Address</span>
            </label>
            <input 
              name="email" 
              type="email" 
              placeholder="your.email@farm.com" 
              onChange={handleChange} 
              required 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>🔒 Secure Password</span>
            </label>
            <input 
              name="password" 
              type="password" 
              placeholder="Create a strong password" 
              onChange={handleChange} 
              required 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>🎂 Date of Birth</span>
            </label>
            <input 
              name="bod" 
              type="date" 
              onChange={handleChange} 
              required 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>⚧ Gender</span>
            </label>
            <select 
              name="gender" 
              onChange={handleChange} 
              value={formData.gender}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>🏡 Farm/Home Address</span>
            </label>
            <input 
              name="address" 
              placeholder="Your farm or home location" 
              onChange={handleChange} 
              required 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 20px 40px rgba(5, 150, 105, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #047857 0%, #065f46 100%)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 30px rgba(5, 150, 105, 0.3)';
              e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
            }}
          >
            <span style={styles.buttonContent}>
              🌱 Start Farming Smart
            </span>
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.weatherInfo}>
            <div style={styles.weatherItem}>
              <Sun size={16} color="#f59e0b" />
              <span>Weather Forecasting</span>
            </div>
            <div style={styles.weatherItem}>
              <Droplets size={16} color="#3b82f6" />
              <span>Crop Monitoring</span>
            </div>
            <div style={styles.weatherItem}>
              <Leaf size={16} color="#10b981" />
              <span>Yield Prediction</span>
            </div>
          </div>
          
          <p style={styles.footerText}>
            Already growing with us? 
            <span style={styles.link} onClick={() => navigate('/login')}>
              Sign in to your farm
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 25%, #a7f3d0 50%, #6ee7b7 75%, #34d399 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  weatherIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.6,
    animation: 'float 6s ease-in-out infinite'
  },
  icon1: {
    top: '10%',
    left: '10%',
    animationDelay: '0s'
  },
  icon2: {
    top: '20%',
    right: '15%',
    animationDelay: '2s'
  },
  icon3: {
    bottom: '30%',
    left: '8%',
    animationDelay: '4s'
  },
  icon4: {
    bottom: '20%',
    right: '10%',
    animationDelay: '1s'
  },
  icon5: {
    top: '60%',
    left: '5%',
    animationDelay: '3s'
  },
  formWrapper: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '50px 45px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    border: '2px solid rgba(16, 185, 129, 0.1)',
    position: 'relative',
    zIndex: 2
  },
  header: {
    textAlign: 'center',
    marginBottom: '35px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '15px',
    position: 'relative'
  },
  logoIcon: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
    padding: '12px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.2)'
  },
  thermometer: {
    marginLeft: '5px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    margin: '0 0 15px 0',
    fontWeight: '500'
  },
  tagline: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    padding: '8px 20px',
    borderRadius: '20px',
    display: 'inline-block',
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  taglineText: {
    fontSize: '14px',
    color: '#047857',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  input: {
    padding: '16px 20px',
    border: '2px solid #d1d5db',
    borderRadius: '16px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
  },
  select: {
    padding: '16px 20px',
    border: '2px solid #d1d5db',
    borderRadius: '16px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
  },
  button: {
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '15px',
    fontFamily: 'inherit',
    boxShadow: '0 15px 30px rgba(5, 150, 105, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  buttonContent: {
    position: 'relative',
    zIndex: 1
  },
  footer: {
    textAlign: 'center',
    marginTop: '35px'
  },
  weatherInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  weatherItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500'
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0'
  },
  link: {
    color: '#059669',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '5px',
    textDecoration: 'none',
    borderBottom: '1px solid transparent',
    transition: 'border-color 0.2s ease'
  }
};

// Add floating animation via CSS-in-JS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(2deg); }
    50% { transform: translateY(-5px) rotate(-1deg); }
    75% { transform: translateY(-15px) rotate(1deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Register;