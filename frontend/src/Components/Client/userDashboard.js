import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaFolderOpen, FaComments, FaEnvelope, FaCog, FaUser } from 'react-icons/fa';
import axios from 'axios';

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    gender: user?.gender || '',
    bod: user?.bod ? user.bod.split('T')[0] : '',
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });
    if (profileImage) form.append('profile', profileImage);

    try {
      const res = await axios.put(`http://localhost:4000/api/users/${user._id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(res.data));
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', route: '/user-dashboard' },
    { icon: <FaChartBar />, label: 'Crop Guide Hub', route: '/crop-guide' },
    { icon: <FaFolderOpen />, label: 'Market Link', route: '/market-link' },
    { icon: <FaComments />, label: 'Farm Diary', route: '/farm-diary' },
    { icon: <FaEnvelope />, label: 'eLearning', route: '/elearning' },
    { icon: <FaCog />, label: 'Edit Profile', route: '/user-dashboard', action: handleEditProfile }
  ];

  if (!user || user.role !== 'user') return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.profileSection}>
          {user.profile ? (
            <img
              src={user.profile}
              alt="Profile"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <FaUser size={40} color="#fff" />
          )}
          <div style={{ marginTop: '10px', color: '#ccc', fontSize: '14px', textAlign: 'center' }}>
            {user.username}
            <div style={{ fontSize: '12px', color: '#888' }}>Logged in</div>
          </div>
        </div>

        <div style={styles.navList}>
          {navItems.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.navItem,
                ...(window.location.pathname === item.route ? styles.activeItem : {})
              }}
              onClick={() => item.action ? item.action() : navigate(item.route)}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span style={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.content}>
        <h1>Welcome, {user.username}</h1>
        <h2>User Dashboard</h2>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="date" name="bod" value={formData.bod} onChange={handleChange} />
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div style={{ marginTop: '10px' }}>
                <button type="submit" style={{ marginRight: '10px' }}>Save</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', height: '100vh', fontFamily: 'Arial' },
  sidebar: {
    width: '230px', backgroundColor: '#2f3241', color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',
    paddingTop: '20px'
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px'
  },
  navList: {
    width: '100%',
    flex: 1
  },
  navItem: {
    display: 'flex', alignItems: 'center', padding: '12px 20px',
    cursor: 'pointer', transition: 'background 0.3s', color: '#ccc'
  },
  activeItem: {
    backgroundColor: '#1e90ff', color: '#fff',
    borderTopRightRadius: '20px', borderBottomRightRadius: '20px'
  },
  icon: { marginRight: '10px' },
  label: { fontSize: '15px' },
  content: { flex: 1, padding: '40px' },
  logoutBtn: {
    marginTop: 'auto',
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
    width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  }
};

export default UserDashboard;
