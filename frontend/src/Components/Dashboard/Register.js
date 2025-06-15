import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      <div style={styles.formWrapper}>
        <div style={styles.header}>
          <h2 style={styles.title}>Register</h2>
          <p style={styles.subtitle}>Create your account</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              name="username" 
              placeholder="Username" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input 
              name="bod" 
              type="date" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select 
              name="gender" 
              onChange={handleChange} 
              value={formData.gender}
              style={styles.select}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Address</label>
            <input 
              name="address" 
              placeholder="Address" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.2)';
            }}
          >
            Register
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account? <span style={styles.link}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  formWrapper: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '4px'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    outline: 'none',
    fontFamily: 'inherit'
  },
  select: {
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer'
  },
  button: {
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '10px',
    fontFamily: 'inherit',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.2)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px'
  },
  footerText: {
    fontSize: '14px',
    color: '#718096',
    margin: '0'
  },
  link: {
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Register;