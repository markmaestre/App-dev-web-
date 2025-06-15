import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Welcome, {user.username}</h1>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} style={buttonStyle}>Logout</button>
    </div>
  );
}

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#764ba2',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

export default AdminDashboard;
