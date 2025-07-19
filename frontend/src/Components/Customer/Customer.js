import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Edit3, 
  ShoppingCart, 
  CreditCard,
  History,
  Store,
  Package,
  Heart,
  Settings,
  LogOut, 
  Save, 
  X,
  ChevronRight,
  Star,
  BarChart2,
  MapPin
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
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

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
      transition: 'all 0.2s ease'
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
      transition: 'all 0.2s ease'
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
      transition: 'all 0.2s ease'
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
      transition: 'all 0.2s ease'
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
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1rem'
    },
    productCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    productImage: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem'
    },
    productName: {
      fontWeight: '600',
      marginBottom: '0.25rem'
    },
    productDescription: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginBottom: '0.5rem'
    },
    productPrice: {
      fontWeight: 'bold'
    },
    productQuantity: {
      fontSize: '0.75rem',
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.5rem',
      display: 'inline-block'
    },
    productLocation: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    addToCartButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'background-color 0.2s ease',
      marginTop: '0.5rem'
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    cartItemImage: {
      width: '50px',
      height: '50px',
      objectFit: 'cover',
      borderRadius: '0.5rem'
    },
    cartItemDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    cartItemName: {
      fontWeight: '500'
    },
    cartItemPrice: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    cartItemQuantity: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    quantityButton: {
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '50%',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    cartTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem',
      fontWeight: 'bold',
      fontSize: '1.125rem'
    },
    checkoutButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontWeight: '500',
      marginTop: '1rem',
      transition: 'background-color 0.2s ease'
    },
    loadingSpinner: {
      border: '3px solid rgba(0, 0, 0, 0.1)',
      borderTop: '3px solid #16a34a',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto'
    },
    loadingText: {
      marginTop: '0.5rem',
      color: '#6b7280',
      textAlign: 'center'
    },
    errorMessage: {
      color: '#dc2626',
      textAlign: 'center',
      padding: '1rem'
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

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product._id,
            name: product.productName,
            price: product.price,
            quantity: 1,
            image: product.image
          }
        ];
      }
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const navItems = [
    { to: "/shop", icon: Store, label: "Shop" },
    { to: "/cart", icon: ShoppingCart, label: "My Cart" },
    { to: "/orders", icon: Package, label: "My Orders" },
    { to: "/payment-history", icon: CreditCard, label: "Payment History" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/account-settings", icon: Settings, label: "Account Settings" },
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
          
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          }
          
          .quantity-button:hover {
            background-color: #f3f4f6;
          }
          
          .add-to-cart-button:hover {
            background-color: #15803d;
          }
          
          .checkout-button:hover {
            background-color: #15803d;
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
                  Welcome back, {user?.username || 'Customer'}! 🛍️
                </h1>
                <p style={styles.welcomeSubtitle}>Browse available farm products</p>
              </div>

              {/* Market Products */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Store size={32} color="#16a34a" />
                  <h3 style={styles.cardTitle}>Available Products</h3>
                </div>
                
                {loading ? (
                  <div>
                    <div style={styles.loadingSpinner}></div>
                    <p style={styles.loadingText}>Loading products...</p>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={styles.productPrice}>₱{product.price}</span>
                          <span style={styles.productQuantity}>
                            {product.availableQuantity} available
                          </span>
                        </div>
                        <p style={styles.productLocation}>
                          <MapPin size={14} style={{ marginRight: '0.25rem' }} />
                          {product.location}
                        </p>
                        <button
                          onClick={() => addToCart(product)}
                          className="add-to-cart-button"
                          style={styles.addToCartButton}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', padding: '1rem' }}>
                    No products available at the moment
                  </p>
                )}
              </div>

              {/* Shopping Cart */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <ShoppingCart size={32} color="#ea580c" />
                  <h3 style={styles.cardTitle}>Your Cart</h3>
                </div>
                
                <div>
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map(item => (
                        <div key={item.id} style={styles.cartItem}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                style={styles.cartItemImage}
                              />
                            )}
                            <div style={styles.cartItemDetails}>
                              <div style={styles.cartItemName}>{item.name}</div>
                              <div style={styles.cartItemPrice}>₱{item.price.toFixed(2)} each</div>
                            </div>
                          </div>
                          <div style={styles.cartItemQuantity}>
                            <button 
                              style={styles.quantityButton}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                              style={styles.quantityButton}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div style={styles.cartTotal}>
                        <span>Total:</span>
                        <span>
                          ₱{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                        </span>
                      </div>
                      
                      <button 
                        className="checkout-button"
                        style={styles.checkoutButton}
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                      Your cart is empty
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;