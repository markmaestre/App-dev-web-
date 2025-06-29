import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaFolderOpen, FaComments, FaEnvelope, FaCog, FaUser, FaCloudSun, FaThermometerHalf, FaEye, FaTint, FaWind } from 'react-icons/fa';
import axios from 'axios';

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [showModal, setShowModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    gender: user?.gender || '',
    bod: user?.bod ? new Date(user.bod).toISOString().split('T')[0] : '',
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      fetchWeatherByCity('Manila,PH');          
      fetchWeatherByCity('Quezon City,PH');  
      fetchWeatherByCity('Makati,PH');          
      fetchWeatherByCity('Pasig,PH');           
      fetchWeatherByCity('Taguig,PH');        
      fetchWeatherByCity('Mandaluyong,PH');   
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Using default location.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Using default location.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Using default location.';
            break;
          default:
            errorMessage = 'An error occurred while retrieving location. Using default location.';
            break;
        }
        setLocationError(errorMessage);
        fetchWeatherByCity('Manila,PH');          
        fetchWeatherByCity('Quezon City,PH');  
        fetchWeatherByCity('Makati,PH');          
        fetchWeatherByCity('Pasig,PH');           
        fetchWeatherByCity('Taguig,PH');        
        fetchWeatherByCity('Mandaluyong,PH');   
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 
      }
    );
  };

  const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
      setLoading(true);
      const API_KEY = '14c7dc684b77a84d37ab9473fb19a1d5'; 
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      try {
        const fallbackResponse = await axios.get(`https://wttr.in/${lat},${lon}?format=j1`);
        const data = fallbackResponse.data;
        setWeather({
          name: data.nearest_area[0].areaName[0].value,
          main: {
            temp: parseInt(data.current_condition[0].temp_C),
            feels_like: parseInt(data.current_condition[0].FeelsLikeC),
            humidity: parseInt(data.current_condition[0].humidity)
          },
          weather: [{
            main: data.current_condition[0].weatherDesc[0].value,
            description: data.current_condition[0].weatherDesc[0].value.toLowerCase()
          }],
          wind: {
            speed: parseInt(data.current_condition[0].windspeedKmph) / 3.6
          },
          visibility: parseInt(data.current_condition[0].visibility) * 1000,
          coord: { lat, lon }
        });
      } catch (fallbackError) {
        console.error('Fallback weather API also failed:', fallbackError);
        setLocationError('Unable to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      const API_KEY = '14c7dc684b77a84d37ab9473fb19a1d5'; 
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      try {
        const fallbackResponse = await axios.get(`https://wttr.in/${city.replace(',', '+')}?format=j1`);
        const data = fallbackResponse.data;
        setWeather({
          name: city.split(',')[0],
          main: {
            temp: parseInt(data.current_condition[0].temp_C),
            feels_like: parseInt(data.current_condition[0].FeelsLikeC),
            humidity: parseInt(data.current_condition[0].humidity)
          },
          weather: [{
            main: data.current_condition[0].weatherDesc[0].value,
            description: data.current_condition[0].weatherDesc[0].value.toLowerCase()
          }],
          wind: {
            speed: parseInt(data.current_condition[0].windspeedKmph) / 3.6
          },
          visibility: parseInt(data.current_condition[0].visibility) * 1000
        });
      } catch (fallbackError) {
        console.error('Fallback weather API also failed:', fallbackError);
        setLocationError('Unable to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });
      if (profileImage) form.append('profile', profileImage);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const res = await axios.put('http://localhost:4000/api/users/profile', form, config);
      
      // Update local storage with new user data
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update profile');
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

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'haze':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  if (!user || user.role !== 'user') return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.profileSection}>
          <div style={styles.profileImageContainer}>
            {user.profile ? (
              <img
                src={`http://localhost:4000/uploads/${user.profile}`}
                alt="Profile"
                style={styles.profileImage}
              />
            ) : (
              <div style={styles.defaultAvatar}>
                <FaUser size={35} color="#fff" />
              </div>
            )}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.username}>{user.username}</div>
            <div style={styles.status}>
              <div style={styles.onlineIndicator}></div>
              Online
            </div>
          </div>
        </div>

        <nav style={styles.navList}>
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
        </nav>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span>Logout</span>
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {user.username}!</h1>
            <p style={styles.welcomeSubtitle}>Here's what's happening with your farm today</p>
          </div>
          <div style={styles.dateTime}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.quickActions}>
            <h3 style={styles.sectionTitle}>Quick Actions</h3>
            <div style={styles.actionGrid}>
              <div style={styles.actionCard} onClick={() => navigate('/crop-guide')}>
                <FaChartBar size={24} color="#4CAF50" />
                <span>Crop Guide</span>
              </div>
              <div style={styles.actionCard} onClick={() => navigate('/market-link')}>
                <FaFolderOpen size={24} color="#FF9800" />
                <span>Market Link</span>
              </div>
              <div style={styles.actionCard} onClick={() => navigate('/farm-diary')}>
                <FaComments size={24} color="#2196F3" />
                <span>Farm Diary</span>
              </div>
              <div style={styles.actionCard} onClick={() => navigate('/elearning')}>
                <FaEnvelope size={24} color="#9C27B0" />
                <span>eLearning</span>
              </div>
            </div>
          </div>

          <div style={styles.weatherWidget}>
            <div style={styles.weatherHeader}>
              <h3 style={styles.sectionTitle}>
                <FaCloudSun style={{ marginRight: '8px' }} />
                Weather at Your Location
              </h3>
              <button 
                onClick={getCurrentLocation} 
                style={styles.refreshButton}
                title="Refresh location and weather"
              >
                🔄
              </button>
            </div>
            
            {locationError && (
              <div style={styles.locationAlert}>
                <span style={styles.alertIcon}>⚠️</span>
                <span>{locationError}</span>
              </div>
            )}
            
            {loading ? (
              <div style={styles.loadingSpinner}>
                <div style={styles.spinner}></div>
                <p>Getting your location and weather...</p>
              </div>
            ) : weather ? (
              <div style={styles.weatherContent}>
                <div style={styles.weatherMain}>
                  <div style={styles.weatherIcon}>
                    {getWeatherIcon(weather.weather?.[0]?.main)}
                  </div>
                  <div style={styles.weatherTemp}>
                    <span style={styles.temperature}>{Math.round(weather.main?.temp || 0)}°C</span>
                    <span style={styles.weatherDesc}>
                      {weather.weather?.[0]?.description || 'Clear sky'}
                    </span>
                    <span style={styles.location}>
                      📍 {weather.name || 'Your Location'}
                      {location && (
                        <small style={styles.coordinates}>
                          ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
                        </small>
                      )}
                    </span>
                  </div>
                </div>
                
                <div style={styles.weatherDetails}>
                  <div style={styles.weatherItem}>
                    <FaThermometerHalf color="#FF6B6B" />
                    <span>Feels like</span>
                    <strong>{Math.round(weather.main?.feels_like || 0)}°C</strong>
                  </div>
                  <div style={styles.weatherItem}>
                    <FaTint color="#4ECDC4" />
                    <span>Humidity</span>
                    <strong>{weather.main?.humidity || 0}%</strong>
                  </div>
                  <div style={styles.weatherItem}>
                    <FaWind color="#95A5A6" />
                    <span>Wind Speed</span>
                    <strong>{Math.round((weather.wind?.speed || 0) * 3.6)} km/h</strong>
                  </div>
                  <div style={styles.weatherItem}>
                    <FaEye color="#3498DB" />
                    <span>Visibility</span>
                    <strong>{Math.round((weather.visibility || 0) / 1000)} km</strong>
                  </div>
                </div>

                <div style={styles.weatherAdvice}>
                  <h4>Farming Advice</h4>
                  <p>
                    {weather.main?.temp > 30 
                      ? "🌡️ Hot day ahead! Consider watering your crops early morning or evening."
                      : weather.main?.temp < 15
                      ? "🧊 Cool weather. Perfect for cool-season crops like lettuce and spinach."
                      : "🌱 Great weather for most farming activities. Perfect day to tend your crops!"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div style={styles.weatherError}>
                <p>Unable to load weather data for your location</p>
                <button onClick={getCurrentLocation} style={styles.retryButton}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Edit Profile</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.modalForm}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="Enter username"
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter email"
                  style={styles.input}
                  disabled
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Enter address"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  style={styles.select}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Date of Birth</label>
                <input 
                  type="date" 
                  name="bod" 
                  value={formData.bod} 
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
              </div>
              
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.saveButton}>Save Changes</button>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { 
    display: 'flex', 
    height: '100vh', 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa'
  },
  sidebar: {
    width: '280px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    display: 'flex', 
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    paddingTop: '30px'
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
    padding: '0 20px'
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: '15px'
  },
  profileImage: {
    width: '80px', 
    height: '80px', 
    borderRadius: '50%', 
    objectFit: 'cover',
    border: '3px solid rgba(255,255,255,0.3)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  defaultAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid rgba(255,255,255,0.3)'
  },
  userInfo: {
    textAlign: 'center'
  },
  username: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '5px'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)'
  },
  onlineIndicator: {
    width: '8px',
    height: '8px',
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    marginRight: '6px'
  },
  navList: {
    width: '100%',
    flex: 1,
    padding: '0 15px'
  },
  navItem: {
    display: 'flex', 
    alignItems: 'center', 
    padding: '15px 20px',
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '12px',
    margin: '5px 0',
    position: 'relative'
  },
  activeItem: {
    backgroundColor: 'rgba(255,255,255,0.2)', 
    color: '#fff',
    transform: 'translateX(5px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  icon: { 
    marginRight: '15px',
    fontSize: '16px'
  },
  label: { 
    fontSize: '14px',
    fontWeight: '500'
  },
  logoutBtn: {
    margin: '20px 35px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(238, 90, 36, 0.3)'
  },
  content: { 
    flex: 1, 
    padding: '30px 40px',
    backgroundColor: '#f8fafc',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0'
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0'
  },
  welcomeSubtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0
  },
  dateTime: {
    fontSize: '14px',
    color: '#a0aec0',
    fontWeight: '500'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    height: 'calc(100vh - 200px)'
  },
  quickActions: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 15px',
    backgroundColor: '#f7fafc',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0'
  },
  weatherWidget: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    height: 'fit-content'
  },
  loadingSpinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0'
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  weatherHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  refreshButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease'
  },
  locationAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 15px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#856404'
  },
  alertIcon: {
    fontSize: '16px'
  },
  coordinates: {
    display: 'block',
    fontSize: '11px',
    color: '#a0aec0',
    marginTop: '2px'
  },
  weatherContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  weatherMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '15px 0'
  },
  weatherIcon: {
    fontSize: '60px'
  },
  weatherTemp: {
    display: 'flex',
    flexDirection: 'column'
  },
  temperature: {
    fontSize: '48px',
    fontWeight: '300',
    color: '#2d3748',
    lineHeight: '1'
  },
  weatherDesc: {
    fontSize: '16px',
    color: '#718096',
    textTransform: 'capitalize',
    marginBottom: '4px'
  },
  location: {
    fontSize: '14px',
    color: '#a0aec0'
  },
  weatherDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  weatherItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    fontSize: '14px'
  },
  weatherAdvice: {
    backgroundColor: '#e6fffa',
    padding: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #38b2ac'
  },
  weatherError: {
    textAlign: 'center',
    padding: '40px 0'
  },
  retryButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    backgroundColor: '#fff', 
    padding: '0', 
    borderRadius: '16px',
    width: '500px', 
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    margin: '0 0 20px 0',
    padding: '30px 30px 0 30px'
  },
  modalForm: {
    padding: '0 30px 30px 30px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
    boxSizing: 'border-box'
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    border: '2px dashed #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '30px'
  },
  saveButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  }
};

export default UserDashboard;