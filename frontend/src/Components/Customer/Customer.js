import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Edit3, 
  ShoppingCart, 
  CreditCard,
  Package,
  Store,
  Home,
  LogOut,
  MapPin,
  Save,
  X,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    profile: null,
  });
  const [marketProducts, setMarketProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },
    productCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    productImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '12px'
    },
    productName: {
      fontWeight: 600,
      marginBottom: '8px',
      fontSize: '16px',
      color: '#1f2937'
    },
    productDescription: {
      color: '#6b7280',
      fontSize: '14px',
      marginBottom: '12px',
      lineHeight: 1.5
    },
    productPrice: {
      fontWeight: 600,
      fontSize: '18px',
      color: '#059669'
    },
    productQuantity: {
      fontSize: '13px',
      background: '#dcfce7',
      color: '#166534',
      padding: '4px 8px',
      borderRadius: '12px',
      fontWeight: 500
    },
    productLocation: {
      fontSize: '14px',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '8px'
    },
    shopButton: {
      padding: '10px 16px',
      background: '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      marginTop: '16px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
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
    errorMessage: {
      color: '#ef4444',
      textAlign: 'center',
      padding: '2rem',
      fontSize: '16px'
    },
    priceQuantityContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || JSON.parse(storedUser).role !== 'customer') {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '',
        profile: null
      });
    }

    const fetchMarketProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/market');
        setMarketProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching market products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchMarketProducts();
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
    data.append('email', formData.email);
    data.append('phone', formData.phone);
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

  const navItems = [
    { to: "/customer-dashboard", icon: Home, label: "Dashboard" },
    { to: "/shop", icon: Store, label: "Shop" },
    { to: "/cart", icon: ShoppingCart, label: "My Cart" },
    { to: "/orders", icon: Package, label: "My Orders" },
    { to: "/payment-history", icon: CreditCard, label: "Payment History" },
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
          
          input:focus {
            border-color: #22c55e !important;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
          }
          
          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          }
          
          .shop-button:hover {
            background: #16a34a !important;
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
              <h3 style={styles.profileName}>{user?.username || 'Customer'}</h3>
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
                    <label style={styles.label}>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Enter your email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="input-field"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Enter your phone number" 
                      value={formData.phone} 
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
                  Welcome back, {user?.username || 'Customer'}!
                  <Sparkles size={24} style={styles.sparkleIcon} />
                </h1>
                <p style={styles.welcomeSubtitle}>
                  Discover fresh farm products from local growers
                </p>
              </div>

              {/* Market Products */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Store size={28} color="#22c55e" />
                  <h3 style={styles.cardTitle}>Available Products</h3>
                </div>
                
                {loading ? (
                  <div>
                    <div style={styles.loadingSpinner}></div>
                    <p style={styles.loadingText}>Loading fresh products...</p>
                  </div>
                ) : error ? (
                  <p style={styles.errorMessage}>{error}</p>
                ) : marketProducts.length > 0 ? (
                  <div style={styles.productGrid}>
                    {marketProducts.map(product => (
                      <div 
                        key={product._id} 
                        className="product-card"
                        style={styles.productCard}
                      >
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.productName}
                            style={styles.productImage}
                          />
                        )}
                        <h4 style={styles.productName}>{product.productName}</h4>
                        <p style={styles.productDescription}>
                          {product.description}
                        </p>
                        <div style={styles.priceQuantityContainer}>
                          <span style={styles.productPrice}>₱{product.price}</span>
                          <span style={styles.productQuantity}>
                            {product.availableQuantity} available
                          </span>
                        </div>
                        <div style={styles.productLocation}>
                          <MapPin size={16} />
                          {product.location}
                        </div>
                        <NavLink
                          to="/shop"
                          className="shop-button"
                          style={styles.shopButton}
                        >
                          <Store size={16} />
                          Visit Shop
                        </NavLink>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.125rem' }}>No products available at the moment</p>
                    <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Check back soon for fresh farm products!</p>
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

export default CustomerDashboard;