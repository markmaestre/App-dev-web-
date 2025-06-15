import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      const { username, role } = res.data.user;

      // Save user info
      localStorage.setItem('user', JSON.stringify({ username, role }));

      alert(`Welcome, ${username}`);

      if (role === 'admin') {
        navigate('/adminDashboard');
      } else if (role === 'user') {
        navigate('/userDashboard');
      } else {
        alert('Unknown role');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert(err.response?.data?.message || 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
