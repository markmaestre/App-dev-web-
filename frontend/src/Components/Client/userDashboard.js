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
  MapPin
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
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    sidebar: {
      width: '18rem',
      background: 'linear-gradient(180deg, #166534 0%, #14532d 100%)',
      color: 'white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      position: 'relative'
    },
    sidebarContent: {
      padding: '1.5rem'
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      backdropFilter: 'blur(8px)'
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: '1rem'
    },
    profileImage: {
      width: '5rem',
      height: '5rem',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid white',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    profilePlaceholder: {
      width: '5rem',
      height: '5rem',
      background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    profileStatus: {
      position: 'absolute',
      bottom: '-0.25rem',
      right: '-0.25rem',
      width: '1.5rem',
      height: '1.5rem',
      backgroundColor: '#4ade80',
      borderRadius: '50%',
      border: '2px solid white'
    },
    profileName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      textAlign: 'center'
    },
    editButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      transform: 'scale(1)'
    },
    editButtonHover: {
      backgroundColor: '#15803d',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      transform: 'scale(1.05)'
    },
    navigation: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      textDecoration: 'none',
      color: 'white',
      transition: 'all 0.2s ease',
      fontWeight: '500'
    },
    navLinkHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    navLinkActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    logoutSection: {
      padding: '1.5rem',
      marginTop: 'auto',
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      transform: 'scale(1)'
    },
    logoutButtonHover: {
      backgroundColor: '#b91c1c',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      transform: 'scale(1.05)'
    },
    mainContent: {
      flex: 1,
      padding: '2rem',
      overflowY: 'auto'
    },
    editForm: {
      maxWidth: '32rem',
      margin: '0 auto'
    },
    editFormCard: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem'
    },
    editFormHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    editFormTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#22c55e'
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    fileInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    saveButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      transform: 'scale(1)'
    },
    saveButtonHover: {
      backgroundColor: '#15803d',
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      transform: 'scale(1.05)'
    },
    cancelButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      transform: 'scale(1)'
    },
    cancelButtonHover: {
      backgroundColor: '#4b5563',
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      transform: 'scale(1.05)'
    },
    dashboardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    welcomeHeader: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    welcomeTitle: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    welcomeSubtitle: {
      fontSize: '1.125rem',
      color: '#6b7280'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      overflow: 'hidden',
      position: 'relative'
    },
    cardDecorative: {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '16rem',
      height: '16rem',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)',
      borderRadius: '50%',
      transform: 'translate(8rem, -8rem)'
    },
    cardContent: {
      position: 'relative',
      zIndex: 10
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    locationInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    locationText: {
      color: '#6b7280',
      fontWeight: '500'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 0'
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
      borderRadius: '50%',
      height: '3rem',
      width: '3rem',
      borderWidth: '0 0 2px 0',
      borderStyle: 'solid',
      borderColor: '#3b82f6'
    },
    loadingText: {
      marginLeft: '0.75rem',
      color: '#6b7280'
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
      color: '#2563eb',
      marginBottom: '0.5rem'
    },
    condition: {
      fontSize: '1.25rem',
      color: '#374151',
      fontWeight: '500'
    },
    weatherStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    weatherStatCard: {
      padding: '1rem',
      borderRadius: '1rem'
    },
    weatherStatCardBlue: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    weatherStatCardGreen: {
      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
    },
    weatherStatCardPurple: {
      background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
    },
    weatherStatCardOrange: {
      background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)'
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
      color: '#374151'
    },
    weatherStatValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    weatherStatValueBlue: {
      color: '#2563eb'
    },
    weatherStatValueGreen: {
      color: '#16a34a'
    },
    weatherStatValuePurple: {
      color: '#7c3aed'
    },
    weatherStatValueOrange: {
      color: '#ea580c'
    },
    weatherAdvice: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#ea580c'
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
      background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
      padding: '1.5rem',
      borderRadius: '1rem',
      borderLeft: '4px solid #eab308'
    },
    tipText: {
      color: '#374151',
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
      borderRadius: '1rem'
    },
    statItemGreen: {
      background: 'linear-gradient(90deg, #dcfce7 0%, #bbf7d0 100%)'
    },
    statItemBlue: {
      background: 'linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    statItemPurple: {
      background: 'linear-gradient(90deg, #f3e8ff 0%, #e9d5ff 100%)'
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
      justifyContent: 'center'
    },
    statIconGreen: {
      backgroundColor: '#22c55e'
    },
    statIconBlue: {
      backgroundColor: '#3b82f6'
    },
    statIconPurple: {
      backgroundColor: '#8b5cf6'
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    statTitle: {
      fontWeight: '500',
      color: '#374151'
    },
    statSubtitle: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    statValue: {
      fontWeight: 'bold'
    },
    statValueGreen: {
      color: '#16a34a'
    },
    statValueBlue: {
      color: '#2563eb'
    },
    statValuePurple: {
      color: '#7c3aed'
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
    { to: "/market", icon: ShoppingCart, label: "Market Connection" },
    { to: "/records", icon: FileText, label: "Farm Records" },
    { to: "/learning", icon: BookOpen, label: "Agricultural Learning" },
    { to: "/assistant", icon: Bot, label: "Farm Assistant" },
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
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .edit-button:hover {
            background-color: #15803d;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: scale(1.05);
          }
          
          .logout-button:hover {
            background-color: #b91c1c;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: scale(1.05);
          }
          
          .save-button:hover {
            background-color: #15803d;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
            transform: scale(1.05);
          }
          
          .cancel-button:hover {
            background-color: #4b5563;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
            transform: scale(1.05);
          }
          
          .input-field:focus {
            border-color: #22c55e;
          }
          
          @media (min-width: 1024px) {
            .weather-grid {
              grid-template-columns: 1fr 1fr;
            }
            .grid-two-columns {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}
      </style>
      
      <div style={styles.container}>
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
                    <User size={40} color="white" />
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
                  <Edit3 size={32} color="#16a34a" />
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
                    <Save size={20} />
                    Save Changes
                  </button>
                  <button 
                    className="cancel-button"
                    style={styles.cancelButton}
                    onClick={() => setEditing(false)}
                  >
                    <X size={20} />
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
                  Welcome back, {user?.username || 'Farmer'}! 🌱
                </h1>
                <p style={styles.welcomeSubtitle}>Here's your farm dashboard overview</p>
              </div>

              {/* Weather Card */}
              <div style={styles.card}>
                <div style={styles.cardDecorative}></div>
                
                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    <Cloud size={32} color="#3b82f6" />
                    <h3 style={styles.cardTitle}>Farm Weather Forecast</h3>
                  </div>
                  
                  <div style={styles.locationInfo}>
                    <MapPin size={20} color="#6b7280" />
                    <span style={styles.locationText}>{weather.location}</span>
                  </div>
                  
                  {weather.loading ? (
                    <div style={styles.loadingContainer}>
                      <div style={styles.loadingSpinner}></div>
                      <span style={styles.loadingText}>Loading weather data...</span>
                    </div>
                  ) : (
                    <div className="weather-grid" style={styles.weatherGrid}>
                      <div style={styles.temperatureDisplay}>
                        <div style={styles.temperature}>{weather.temp}°C</div>
                        <div style={styles.condition}>{weather.condition}</div>
                      </div>
                      
                      <div style={styles.weatherStats}>
                        <div style={{...styles.weatherStatCard, ...styles.weatherStatCardBlue}}>
                          <div style={styles.weatherStatHeader}>
                            <Droplets size={20} color="#3b82f6" />
                            <span style={styles.weatherStatLabel}>Humidity</span>
                          </div>
                          <div style={{...styles.weatherStatValue, ...styles.weatherStatValueBlue}}>{weather.humidity}%</div>
                        </div>
                        
                        <div style={{...styles.weatherStatCard, ...styles.weatherStatCardGreen}}>
                          <div style={styles.weatherStatHeader}>
                            <Wind size={20} color="#16a34a" />
                            <span style={styles.weatherStatLabel}>Wind Speed</span>
                          </div>
                          <div style={{...styles.weatherStatValue, ...styles.weatherStatValueGreen}}>{weather.wind} km/h</div>
                        </div>
                        
                        <div style={{...styles.weatherStatCard, ...styles.weatherStatCardPurple}}>
                          <div style={styles.weatherStatHeader}>
                            <CloudRain size={20} color="#7c3aed" />
                            <span style={styles.weatherStatLabel}>Precipitation</span>
                          </div>
                          <div style={{...styles.weatherStatValue, ...styles.weatherStatValuePurple}}>{weather.precipitation} mm</div>
                        </div>
                        
                        <div style={{...styles.weatherStatCard, ...styles.weatherStatCardOrange}}>
                          <div style={styles.weatherStatHeader}>
                            <Thermometer size={20} color="#ea580c" />
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
              
              {/* Farm Tips and Stats */}
              <div className="grid-two-columns" style={styles.gridTwoColumns}>
                {/* Farm Tips */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <Lightbulb size={32} color="#eab308" />
                    <h3 style={styles.cardTitle}>Today's Farming Tip</h3>
                  </div>
                  
                  <div style={styles.tipCard}>
                    <p style={styles.tipText}>{getRandomTip()}</p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <BarChart3 size={32} color="#16a34a" />
                    <h3 style={styles.cardTitle}>Farm Overview</h3>
                  </div>
                  
                  <div style={styles.statsContainer}>
                    <div style={{...styles.statItem, ...styles.statItemGreen}}>
                      <div style={styles.statItemLeft}>
                        <div style={{...styles.statIcon, ...styles.statIconGreen}}>
                          <Sprout size={20} color="white" />
                        </div>
                        <div style={styles.statInfo}>
                          <div style={styles.statTitle}>Soil Quality</div>
                          <div style={styles.statSubtitle}>Current Status</div>
                        </div>
                      </div>
                      <div style={{...styles.statValue, ...styles.statValueGreen}}>Optimal</div>
                    </div>
                    
                    <div style={{...styles.statItem, ...styles.statItemBlue}}>
                      <div style={styles.statItemLeft}>
                        <div style={{...styles.statIcon, ...styles.statIconBlue}}>
                          <TrendingUp size={20} color="white" />
                        </div>
                        <div style={styles.statInfo}>
                          <div style={styles.statTitle}>Planting Season</div>
                          <div style={styles.statSubtitle}>Best for</div>
                        </div>
                      </div>
                      <div style={{...styles.statValue, ...styles.statValueBlue}}>Tomatoes</div>
                    </div>
                    
                    <div style={{...styles.statItem, ...styles.statItemPurple}}>
                      <div style={styles.statItemLeft}>
                        <div style={{...styles.statIcon, ...styles.statIconPurple}}>
                          <DollarSign size={20} color="white" />
                        </div>
                        <div style={styles.statInfo}>
                          <div style={styles.statTitle}>Market Prices</div>
                          <div style={styles.statSubtitle}>Rice per kg</div>
                        </div>
                      </div>
                      <div style={{...styles.statValue, ...styles.statValuePurple}}>₱25</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;