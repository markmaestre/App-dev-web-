import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Edit3, 
  Cloud, 
  TrendingUp, 
  ShoppingCart, 
  BookOpen, 
  Bot, 
  FileText, 
  LogOut, 
  Save, 
  X,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Lightbulb,
  BarChart3,
  Sprout,
  DollarSign,
  MapPin,
  Home,
  Package,
  CreditCard,
  Store,
  Sparkles,
  Wallet
} from 'lucide-react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    bod: '',
    address: '',
    profile: null,
  });
  const [weather, setWeather] = useState({
    loading: true,
    temp: null,
    condition: '',
    humidity: null,
    wind: null,
    precipitation: null,
    location: ''
  });
  const [farmTips, setFarmTips] = useState([
    "Check soil moisture before watering to conserve resources.",
    "Rotate crops annually to maintain soil fertility.",
    "Consider planting cover crops during off-seasons.",
    "Monitor weather forecasts regularly for planting decisions."
  ]);

  const navigate = useNavigate();

  // CSS Styles as JavaScript objects
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 20%)
      `,
      zIndex: 0
    },
    sidebar: {
      width: '280px',
      background: 'rgba(15, 23, 42, 0.98)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.2)'
    },
    sidebarContent: {
      padding: '24px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '32px',
      padding: '24px 16px',
      background: 'rgba(34, 197, 94, 0.08)',
      borderRadius: '16px',
      border: '1px solid rgba(34, 197, 94, 0.15)',
      position: 'relative'
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: '16px'
    },
    profileImage: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid rgba(34, 197, 94, 0.5)',
      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)'
    },
    profilePlaceholder: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    profileStatus: {
      position: 'absolute',
      bottom: '4px',
      right: '4px',
      width: '16px',
      height: '16px',
      background: '#22c55e',
      borderRadius: '50%',
      border: '2px solid rgba(255, 255, 255, 0.2)'
    },
    profileName: {
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '8px',
      color: 'white',
      textAlign: 'center'
    },
    editButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      background: 'rgba(34, 197, 94, 0.1)',
      color: '#22c55e',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'all 0.2s ease'
    },
    navigationContainer: {
      flex: 1,
      overflowY: 'auto',
      paddingRight: '8px',
      marginBottom: '24px'
    },
    navigation: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      textDecoration: 'none',
      color: 'rgba(255, 255, 255, 0.7)',
      transition: 'all 0.2s ease',
      fontSize: '15px',
      fontWeight: 500
    },
    logoutSection: {
      padding: '16px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(220, 38, 38, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(220, 38, 38, 0.3)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '15px',
      transition: 'all 0.2s ease'
    },
    mainContent: {
      flex: 1,
      padding: '32px',
      overflowY: 'auto',
      position: 'relative',
      zIndex: 1
    },
    editForm: {
      maxWidth: '600px',
      margin: '0 auto'
    },
    editFormCard: {
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    editFormHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    editFormTitle: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#1f2937'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      color: '#4b5563',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: 'rgba(249, 250, 251, 0.8)'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: 'rgba(249, 250, 251, 0.8)'
    },
    fileInput: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      fontSize: '15px',
      backgroundColor: 'rgba(249, 250, 251, 0.8)'
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '24px'
    },
    saveButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      background: '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '15px',
      transition: 'all 0.2s ease'
    },
    cancelButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      background: 'rgba(107, 114, 128, 0.1)',
      color: '#4b5563',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '15px',
      transition: 'all 0.2s ease'
    },
    dashboardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    },
    welcomeHeader: {
      textAlign: 'left',
      marginBottom: '32px'
    },
    welcomeTitle: {
      fontSize: '32px',
      fontWeight: 700,
      color: 'white',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    welcomeSubtitle: {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: 400
    },
    sparkleIcon: {
      color: '#fbbf24'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 600,
      color: 'white'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 0'
    },
    loadingSpinner: {
      border: '4px solid rgba(255, 255, 255, 0.1)',
      borderTop: '4px solid #22c55e',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      margin: '2rem auto'
    },
    loadingText: {
      marginTop: '1rem',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      fontSize: '16px'
    },
    weatherGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem'
    },
    weatherGridLarge: {
      gridTemplateColumns: '1fr 1fr'
    },
    temperatureDisplay: {
      textAlign: 'center'
    },
    temperature: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      marginBottom: '0.5rem'
    },
    condition: {
      fontSize: '1.25rem',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500'
    },
    weatherStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    weatherStatCard: {
      padding: '1rem',
      borderRadius: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    weatherStatHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem'
    },
    weatherStatLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    weatherStatValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white'
    },
    weatherAdvice: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#fbbf24'
    },
    gridTwoColumns: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem'
    },
    gridTwoColumnsLarge: {
      gridTemplateColumns: '1fr 1fr'
    },
    tipCard: {
      background: 'rgba(234, 179, 8, 0.1)',
      padding: '1.5rem',
      borderRadius: '1rem',
      borderLeft: '4px solid rgba(234, 179, 8, 0.5)'
    },
    tipText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500',
      lineHeight: '1.625'
    },
    statsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderRadius: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    statItemLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    statIcon: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(34, 197, 94, 0.2)'
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    statTitle: {
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    statSubtitle: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    statValue: {
      fontWeight: 'bold',
      color: 'white'
    },
    locationInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    locationText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '500'
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        gender: parsedUser.gender || '',
        bod: parsedUser.bod || '',
        address: parsedUser.address || '',
        profile: null
      });
    }

    // Get user's location and fetch weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherResponse = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`
            );
            
            const locationResponse = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            const weatherCodeMap = {
              0: 'Clear sky',
              1: 'Mainly clear',
              2: 'Partly cloudy',
              3: 'Overcast',
              45: 'Fog',
              48: 'Depositing rime fog',
              51: 'Light drizzle',
              53: 'Moderate drizzle',
              55: 'Dense drizzle',
              56: 'Light freezing drizzle',
              57: 'Dense freezing drizzle',
              61: 'Slight rain',
              63: 'Moderate rain',
              65: 'Heavy rain',
              66: 'Light freezing rain',
              67: 'Heavy freezing rain',
              71: 'Slight snow',
              73: 'Moderate snow',
              75: 'Heavy snow',
              77: 'Snow grains',
              80: 'Slight rain showers',
              81: 'Moderate rain showers',
              82: 'Violent rain showers',
              85: 'Slight snow showers',
              86: 'Heavy snow showers',
              95: 'Thunderstorm',
              96: 'Thunderstorm with hail',
              99: 'Thunderstorm with heavy hail'
            };

            setWeather({
              loading: false,
              temp: weatherResponse.data.current.temperature_2m,
              condition: weatherCodeMap[weatherResponse.data.current.weather_code] || 'Unknown',
              humidity: weatherResponse.data.current.relative_humidity_2m,
              wind: weatherResponse.data.current.wind_speed_10m,
              precipitation: weatherResponse.data.current.precipitation,
              location: locationResponse.data.address?.village || 
                       locationResponse.data.address?.town || 
                       locationResponse.data.address?.city || 
                       'Your area'
            });
          } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeather(prev => ({ ...prev, loading: false, location: 'Your area' }));
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeather(prev => ({ ...prev, loading: false, location: 'Your area' }));
        }
      );
    } else {
      setWeather(prev => ({ ...prev, loading: false, location: 'Your area' }));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile') {
      setFormData((prev) => ({ ...prev, profile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized');

    const data = new FormData();
    data.append('username', formData.username);
    data.append('gender', formData.gender);
    data.append('bod', formData.bod);
    data.append('address', formData.address);
    if (formData.profile) {
      data.append('profile', formData.profile);
    }

    try {
      const res = await axios.put('http://localhost:4000/api/users/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile updated!');
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  const getRandomTip = () => {
    return farmTips[Math.floor(Math.random() * farmTips.length)];
  };

  const navItems = [

    { to: "/weather", icon: Cloud, label: "Weather" },
    { to: "/prediction", icon: TrendingUp, label: "Crop Prediction" },
    { to: "/market", icon: Store, label: "Market" },
    { to: "/learning", icon: BookOpen, label: "Learning" },
    { to: "/assistant", icon: Bot, label: "Assistant" },
  ];

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .nav-link:hover {
            background: rgba(34, 197, 94, 0.1) !important;
            color: white !important;
          }
          
          .nav-link.active {
            background: rgba(34, 197, 94, 0.2) !important;
            color: white !important;
          }
          
          .edit-button:hover {
            background: rgba(34, 197, 94, 0.2) !important;
            color: white !important;
          }
          
          .logout-button:hover {
            background: rgba(220, 38, 38, 0.2) !important;
            color: white !important;
          }
          
          .save-button:hover {
            background: #16a34a !important;
            transform: translateY(-2px);
          }
          
          .cancel-button:hover {
            background: rgba(107, 114, 128, 0.2) !important;
          }
          
          input:focus, select:focus {
            border-color: #22c55e !important;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
          }
          
          @media (min-width: 1024px) {
            .weather-grid {
              grid-template-columns: 1fr 1fr !important;
            }
            .grid-two-columns {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            {/* Profile Section */}
            <div style={styles.profileSection}>
              <div style={styles.profileImageContainer}>
                {user?.profile ? (
                  <img 
                    src={user.profile} 
                    alt="Profile" 
                    style={styles.profileImage}
                  />
                ) : (
                  <div style={styles.profilePlaceholder}>
                    <User size={32} color="white" />
                  </div>
                )}
                <div style={styles.profileStatus}></div>
              </div>
              <h3 style={styles.profileName}>{user?.username || 'Farmer'}</h3>
              <button 
                className="edit-button"
                style={styles.editButton}
                onClick={() => setEditing(true)}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>
            
            {/* Navigation */}
            <div style={styles.navigationContainer}>
              <nav style={styles.navigation}>
                {navItems.map((item) => (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className="nav-link"
                    style={styles.navLink}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Logout Button */}
          <div style={styles.logoutSection}>
            <button 
              className="logout-button"
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {editing ? (
            <div style={styles.editForm}>
              <div style={styles.editFormCard}>
                <div style={styles.editFormHeader}>
                  <Edit3 size={28} color="#22c55e" />
                  <h2 style={styles.editFormTitle}>Edit Profile</h2>
                </div>
                
                <div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      placeholder="Enter your username" 
                      value={formData.username} 
                      onChange={handleInputChange} 
                      className="input-field"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Gender</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleInputChange} 
                      className="input-field"
                      style={styles.select}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Birth Date</label>
                    <input 
                      type="date" 
                      name="bod" 
                      value={formData.bod} 
                      onChange={handleInputChange} 
                      className="input-field"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      placeholder="Enter your address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className="input-field"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Profile Picture</label>
                    <input 
                      type="file" 
                      name="profile" 
                      onChange={handleInputChange} 
                      className="input-field"
                      style={styles.fileInput}
                    />
                  </div>
                </div>
                
                <div style={styles.buttonGroup}>
                  <button 
                    className="save-button"
                    style={styles.saveButton}
                    onClick={handleUpdate}
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button 
                    className="cancel-button"
                    style={styles.cancelButton}
                    onClick={() => setEditing(false)}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.dashboardContent}>
              {/* Welcome Header */}
              <div style={styles.welcomeHeader}>
                <h1 style={styles.welcomeTitle}>
                  Welcome back, {user?.username || 'Farmer'}!
                  <Sparkles size={24} style={styles.sparkleIcon} />
                </h1>
                <p style={styles.welcomeSubtitle}>
                  Here's your farm dashboard overview
                </p>
              </div>

              {/* Weather Card */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Cloud size={28} color="#3b82f6" />
                  <h3 style={styles.cardTitle}>Farm Weather Forecast</h3>
                </div>
                
                <div style={styles.locationInfo}>
                  <MapPin size={20} color="rgba(255, 255, 255, 0.7)" />
                  <span style={styles.locationText}>{weather.location}</span>
                </div>
                
                {weather.loading ? (
                  <div>
                    <div style={styles.loadingSpinner}></div>
                    <p style={styles.loadingText}>Loading weather data...</p>
                  </div>
                ) : (
                  <div className="weather-grid" style={styles.weatherGrid}>
                    <div style={styles.temperatureDisplay}>
                      <div style={styles.temperature}>{weather.temp}°C</div>
                      <div style={styles.condition}>{weather.condition}</div>
                    </div>
                    
                    <div style={styles.weatherStats}>
                      <div style={styles.weatherStatCard}>
                        <div style={styles.weatherStatHeader}>
                          <Droplets size={20} color="#3b82f6" />
                          <span style={styles.weatherStatLabel}>Humidity</span>
                        </div>
                        <div style={styles.weatherStatValue}>{weather.humidity}%</div>
                      </div>
                      
                      <div style={styles.weatherStatCard}>
                        <div style={styles.weatherStatHeader}>
                          <Wind size={20} color="#22c55e" />
                          <span style={styles.weatherStatLabel}>Wind Speed</span>
                        </div>
                        <div style={styles.weatherStatValue}>{weather.wind} km/h</div>
                      </div>
                      
                      <div style={styles.weatherStatCard}>
                        <div style={styles.weatherStatHeader}>
                          <CloudRain size={20} color="#8b5cf6" />
                          <span style={styles.weatherStatLabel}>Precipitation</span>
                        </div>
                        <div style={styles.weatherStatValue}>{weather.precipitation} mm</div>
                      </div>
                      
                      <div style={styles.weatherStatCard}>
                        <div style={styles.weatherStatHeader}>
                          <Thermometer size={20} color="#fbbf24" />
                          <span style={styles.weatherStatLabel}>Farm Advice</span>
                        </div>
                        <div style={styles.weatherAdvice}>
                          {weather.condition.includes('rain') ? 
                            "Good for planting" : 
                            "Consider irrigation"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
             
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;