import React, { useState, useEffect } from 'react';

const LiveWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [locationName, setLocationName] = useState('');

  // Get user's live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          setError("Location access denied. Using default location.");
          // Default to Manila coordinates if location access is denied
          setLocation({ lat: 14.5995, lon: 120.9842 });
          setLocationName("Manila, Philippines");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocation({ lat: 14.5995, lon: 120.9842 });
      setLocationName("Manila, Philippines");
    }
  }, []);

  // Get location name from coordinates
  const getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await response.json();
      return `${data.city || data.locality || 'Unknown'}, ${data.countryName || 'Unknown'}`;
    } catch (error) {
      return 'Unknown Location';
    }
  };

  // Fetch weather data when location is available
  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchWeatherData = async () => {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pressure_msl,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${timezone}`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          // Get location name
          const locName = await getLocationName(location.lat, location.lon);
          setLocationName(locName);
          
          setWeatherData(data);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch weather data");
          setLoading(false);
        }
      };

      fetchWeatherData();
    }
  }, [location]);

  const getWeatherIcon = (code) => {
    const icons = {
      0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️',
      51: '🌦️', 53: '🌧️', 55: '🌧️', 61: '🌧️', 63: '🌧️',
      65: '🌧️', 80: '🌧️', 95: '⛈️', 96: '⛈️',
    };
    return icons[code] || '❓';
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 51: 'Light Drizzle', 53: 'Moderate Rain', 55: 'Heavy Drizzle',
      61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain', 80: 'Rain Showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with Hail',
    };
    return descriptions[code] || 'Unknown';
  };

  const refreshWeather = () => {
    setLoading(true);
    setError(null);
    if (location.lat && location.lon) {
      const fetchWeatherData = async () => {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pressure_msl,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${timezone}`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          setWeatherData(data);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch weather data");
          setLoading(false);
        }
      };
      fetchWeatherData();
    }
  };

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#1e293b',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: '1px solid #e2e8f0',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0f172a',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '500',
      margin: '4px 0 0 0',
    },
    refreshBtn: {
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 20px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    tabNav: {
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '4px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
    },
    tab: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      background: 'transparent',
      color: '#64748b',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px',
    },
    activeTab: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '600',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #f1f5f9',
    },
    currentWeather: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '40px',
      alignItems: 'center',
    },
    tempSection: {
      textAlign: 'center',
    },
    temperature: {
      fontSize: '72px',
      fontWeight: '300',
      margin: '0',
      color: '#0f172a',
      lineHeight: '1',
    },
    weatherIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      display: 'block',
    },
    description: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#475569',
      margin: '8px 0',
    },
    location: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    detailCard: {
      backgroundColor: '#f8fafc',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
    },
    detailValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0f172a',
      margin: '8px 0 4px 0',
    },
    detailLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    forecastContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '16px',
    },
    forecastItem: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      transition: 'all 0.2s ease',
    },
    forecastTime: {
      fontWeight: '600',
      fontSize: '14px',
      color: '#475569',
      marginBottom: '8px',
    },
    forecastIcon: {
      fontSize: '32px',
      margin: '8px 0',
    },
    forecastTemp: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0f172a',
      margin: '8px 0',
    },
    forecastDetail: {
      fontSize: '12px',
      color: '#64748b',
      margin: '2px 0',
    },
    mapContainer: {
      position: 'relative',
      height: '400px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    },
    mapFrame: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
    mapOverlay: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 10,
    },
    loading: {
      textAlign: 'center',
      padding: '80px 20px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px',
    },
    error: {
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      marginBottom: '24px',
    }
  };

  const spinnerAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{spinnerAnimation}</style>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p style={{ fontSize: '16px', color: '#64748b' }}>Loading weather data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !weatherData) {
    return (
      <>
        <style>{spinnerAnimation}</style>
        <div style={styles.container}>
          <div style={styles.error}>
            <h3 style={{ margin: '0 0 8px 0' }}>Unable to load weather data</h3>
            <p style={{ margin: '0 0 16px 0' }}>{error}</p>
            <button 
              style={styles.refreshBtn} 
              onClick={refreshWeather}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!weatherData) {
    return (
      <>
        <style>{spinnerAnimation}</style>
        <div style={styles.container}>
          <div style={styles.error}>
            <h3 style={{ margin: '0 0 8px 0' }}>No weather data available</h3>
          </div>
        </div>
      </>
    );
  }

  // Prepare hourly data (next 8 hours)
  const hourlyData = weatherData.hourly.time.slice(0, 8).map((time, index) => ({
    time: new Date(time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
    temp: weatherData.hourly.temperature_2m[index],
    precipitation: weatherData.hourly.precipitation_probability[index],
    wind: weatherData.hourly.wind_speed_10m[index],
    weatherCode: weatherData.hourly.weather_code[index]
  }));

  // Prepare daily data (next 7 days)
  const dailyData = weatherData.daily.time.slice(0, 7).map((time, index) => ({
    day: new Date(time).toLocaleDateString([], { weekday: 'short' }),
    date: new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    maxTemp: weatherData.daily.temperature_2m_max[index],
    minTemp: weatherData.daily.temperature_2m_min[index],
    weatherCode: weatherData.daily.weather_code[index]
  }));

  const renderCurrentWeather = () => (
    <div style={styles.card}>
      <div style={styles.currentWeather}>
        <div style={styles.tempSection}>
          <span style={styles.weatherIcon}>
            {getWeatherIcon(weatherData.current.weather_code)}
          </span>
          <div style={styles.temperature}>{Math.round(weatherData.current.temperature_2m)}°</div>
          <div style={styles.description}>
            {getWeatherDescription(weatherData.current.weather_code)}
          </div>
          <div style={styles.location}>{locationName}</div>
        </div>
        
        <div style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <div style={styles.detailValue}>{weatherData.current.precipitation}%</div>
            <div style={styles.detailLabel}>Precipitation</div>
          </div>
          <div style={styles.detailCard}>
            <div style={styles.detailValue}>{weatherData.current.relative_humidity_2m}%</div>
            <div style={styles.detailLabel}>Humidity</div>
          </div>
          <div style={styles.detailCard}>
            <div style={styles.detailValue}>{Math.round(weatherData.current.wind_speed_10m)} km/h</div>
            <div style={styles.detailLabel}>Wind Speed</div>
          </div>
          <div style={styles.detailCard}>
            <div style={styles.detailValue}>{Math.round(weatherData.current.pressure_msl)} hPa</div>
            <div style={styles.detailLabel}>Pressure</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHourlyForecast = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Hourly Forecast</h3>
      <div style={styles.forecastContainer}>
        {hourlyData.map((hour, index) => (
          <div 
            key={index} 
            style={styles.forecastItem}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.forecastTime}>{hour.time}</div>
            <div style={styles.forecastIcon}>{getWeatherIcon(hour.weatherCode)}</div>
            <div style={styles.forecastTemp}>{Math.round(hour.temp)}°C</div>
            <div style={styles.forecastDetail}>{hour.precipitation}% rain</div>
            <div style={styles.forecastDetail}>{Math.round(hour.wind)} km/h wind</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDailyForecast = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>7-Day Forecast</h3>
      <div style={styles.forecastContainer}>
        {dailyData.map((day, index) => (
          <div 
            key={index} 
            style={styles.forecastItem}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.forecastTime}>{day.day}</div>
            <div style={{...styles.forecastDetail, marginBottom: '8px'}}>{day.date}</div>
            <div style={styles.forecastIcon}>{getWeatherIcon(day.weatherCode)}</div>
            <div style={styles.forecastTemp}>{Math.round(day.maxTemp)}°C</div>
            <div style={styles.forecastDetail}>{Math.round(day.minTemp)}°C</div>
          </div>
        ))}
      </div>
    </div>
  );

  
  return (
    <>
      <style>{spinnerAnimation}</style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Weather Dashboard</h1>
            <p style={styles.subtitle}>Real-time weather information and forecasts</p>
          </div>
          <button 
            style={styles.refreshBtn}
            onClick={refreshWeather}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
            disabled={loading}
          >
            <span>↻</span>
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            <strong>Notice:</strong> {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={styles.tabNav}>
          {[
            { key: 'current', label: 'Current Weather' },
            { key: 'hourly', label: 'Hourly Forecast' },
            { key: 'daily', label: 'Weekly Forecast' },
          ].map(tab => (
            <button
              key={tab.key}
              style={{
                ...styles.tab,
                ...(activeTab === tab.key ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.key)}
              onMouseOver={(e) => {
                if (activeTab !== tab.key) {
                  e.target.style.backgroundColor = '#f1f5f9';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.key) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'current' && renderCurrentWeather()}
        {activeTab === 'hourly' && renderHourlyForecast()}
        {activeTab === 'daily' && renderDailyForecast()}
        {activeTab === 'map' && renderWeatherMap()}
      </div>
    </>
  );
};

export default LiveWeather;