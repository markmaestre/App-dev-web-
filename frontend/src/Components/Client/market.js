import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/market';

const Market = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    description: '',
    price: '',
    location: '',
    availableQuantity: '',
    contactNumber: '',
    image: null,
    existingImage: ''
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');


  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.05,
      background: `
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)
      `
    },
    contentWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 1
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      color: 'white',
      marginBottom: '15px',
      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '400',
      letterSpacing: '0.5px'
    },
    mainCard: {
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '28px',
      padding: '45px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    cardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
      borderRadius: '28px 28px 0 0'
    },
    formTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '30px',
      textAlign: 'center',
      position: 'relative'
    },
    formGrid: {
      display: 'grid',
      gap: '25px'
    },
    inputGroup: {
      position: 'relative'
    },
    inputLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.8px'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '18px 24px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: '#ffffff',
      color: '#1e293b',
      outline: 'none',
      boxSizing: 'border-box',
      position: 'relative'
    },
    textarea: {
      width: '100%',
      padding: '18px 24px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '500',
      minHeight: '140px',
      resize: 'vertical',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: '#ffffff',
      color: '#1e293b',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    twoColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px'
    },
    fileInput: {
      width: '100%',
      padding: '24px',
      border: '3px dashed #cbd5e0',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      fontSize: '16px',
      color: '#475569',
      fontWeight: '500',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      marginTop: '35px',
      justifyContent: 'center'
    },
    button: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '18px 36px',
      border: 'none',
      borderRadius: '14px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      position: 'relative',
      overflow: 'hidden',
      transform: 'translateY(0)',
      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
    },
    buttonDanger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)'
    },
    divider: {
      border: 'none',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
      margin: '60px 0',
      borderRadius: '3px'
    },
    sectionTitle: {
      fontSize: '2.4rem',
      fontWeight: '700',
      color: 'white',
      marginBottom: '40px',
      textAlign: 'center',
      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
      letterSpacing: '-0.01em'
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '30px',
      marginTop: '40px'
    },
    postCard: {
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)'
    },
    postImage: {
      width: '100%',
      height: '240px',
      objectFit: 'cover',
      borderRadius: '18px',
      marginBottom: '24px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid rgba(59, 130, 246, 0.1)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    },
    postTitle: {
      color: '#1e293b',
      marginBottom: '16px',
      fontSize: '1.4rem',
      fontWeight: '700',
      lineHeight: '1.3',
      letterSpacing: '-0.01em'
    },
    postDescription: {
      color: '#475569',
      marginBottom: '24px',
      lineHeight: '1.6',
      fontSize: '15px',
      fontWeight: '400'
    },
    postMeta: {
      color: '#64748b',
      margin: '12px 0',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      fontWeight: '500'
    },
    metaLabel: {
      color: '#1e293b',
      fontWeight: '600'
    },
    priceTag: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '25px',
      fontSize: '18px',
      fontWeight: '700',
      display: 'inline-block',
      marginBottom: '20px',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
      letterSpacing: '0.5px'
    },
    errorMessage: {
      color: '#dc2626',
      background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
      padding: '20px 28px',
      borderRadius: '16px',
      marginBottom: '30px',
      textAlign: 'center',
      fontWeight: '600',
      border: '1px solid #fecaca',
      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.15)',
      fontSize: '15px'
    },
    loading: {
      textAlign: 'center',
      padding: '100px 20px',
      fontSize: '20px',
      color: 'white',
      fontWeight: '600',
      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    emptyState: {
      textAlign: 'center',
      gridColumn: '1/-1',
      padding: '80px 20px',
      color: 'rgba(255,255,255,0.8)',
      fontSize: '20px',
      fontWeight: '500',
      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    floatingElement: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.05)',
      animation: 'float 6s ease-in-out infinite'
    }
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(decoded.id);
          // Fetch only user's posts
          const myRes = await axios.get(`${API_BASE}/user/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyPosts(myRes.data);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== '') {
        formData.append(key, form[key]);
      }
    }

    try {
      setIsLoading(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingPostId) {
        await axios.put(`${API_BASE}/${editingPostId}`, formData, config);
        setEditingPostId(null);
      } else {
        await axios.post(API_BASE, formData, config);
      }

      setForm({
        productName: '',
        description: '',
        price: '',
        location: '',
        availableQuantity: '',
        contactNumber: '',
        image: null,
        existingImage: ''
      });
      
      // Refresh only my posts
      const myRes = await axios.get(`${API_BASE}/user/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyPosts(myRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting post');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setForm({
      productName: post.productName,
      description: post.description,
      price: post.price,
      location: post.location,
      availableQuantity: post.availableQuantity,
      contactNumber: post.contactNumber,
      image: null,
      existingImage: post.image || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setForm({
      productName: '',
      description: '',
      price: '',
      location: '',
      availableQuantity: '',
      contactNumber: '',
      image: null,
      existingImage: ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_BASE}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update my posts list
        setMyPosts(myPosts.filter(post => post._id !== id));
      } catch (err) {
        setError('Failed to delete post');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.contentWrapper}>
        <div style={styles.loading}>Loading your marketplace...</div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={{...styles.floatingElement, top: '10%', right: '10%'}}></div>
      <div style={{...styles.floatingElement, bottom: '15%', left: '5%'}}></div>
      
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {editingPostId ? 'Edit Your Listing' : 'Post Your Product'}
          </h1>
          <p style={styles.subtitle}>
            {editingPostId ? 'Update your product details' : 'Create and manage your product listings'}
          </p>
        </div>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <div style={styles.mainCard}>
          <div style={styles.cardGlow}></div>
          
          <h2 style={styles.formTitle}>
            {editingPostId ? 'Update Product Information' : 'List Your Product'}
          </h2>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Product Name</label>
              <div style={styles.inputWrapper}>
                <input
                  name="productName"
                  placeholder="Enter your product name"
                  value={form.productName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Product Description</label>
              <textarea
                name="description"
                placeholder="Describe your product in detail"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.twoColumnGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Price (₱)</label>
                <input
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Location</label>
                <input
                  name="location"
                  placeholder="Your location"
                  value={form.location}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={styles.twoColumnGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Available Quantity</label>
                <input
                  name="availableQuantity"
                  placeholder="Available quantity"
                  value={form.availableQuantity}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Contact Number</label>
                <input
                  name="contactNumber"
                  placeholder="Your contact number"
                  value={form.contactNumber}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Product Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                style={styles.fileInput}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#cbd5e0';
                  e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            </div>
            
            <div style={styles.buttonGroup}>
              <button 
                type="submit" 
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
                }}
              >
                {editingPostId ? 'Update Listing' : 'Create Listing'}
              </button>
              
              {editingPostId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  style={{...styles.button, ...styles.buttonDanger}}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(239, 68, 68, 0.5)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  }}
                >
                  Cancel Changes
                </button>
              )}
            </div>
          </form>
        </div>

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>My Product Listings</h2>
        
        <div style={styles.postsGrid}>
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <div 
                key={post._id} 
                style={styles.postCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.2)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.08)';
                    img.style.borderRadius = '14px';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                    img.style.borderRadius = '18px';
                  }
                }}
              >
                {post.image && <img src={post.image} alt={post.productName} style={styles.postImage} />}
                
                <div style={styles.priceTag}>₱{post.price}</div>
                
                <h3 style={styles.postTitle}>{post.productName}</h3>
                <p style={styles.postDescription}>{post.description}</p>
                
                <div style={styles.postMeta}>
                  <span style={styles.metaLabel}>Location:</span>
                  <span>{post.location}</span>
                </div>
                
                <div style={styles.postMeta}>
                  <span style={styles.metaLabel}>Quantity:</span>
                  <span>{post.availableQuantity}</span>
                </div>
                
                <div style={styles.postMeta}>
                  <span style={styles.metaLabel}>Contact:</span>
                  <span>{post.contactNumber}</span>
                </div>
                
                <div style={styles.buttonGroup}>
                  <button 
                    onClick={() => handleEdit(post)}
                    style={styles.button}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                    }}
                  >
                    Edit Listing
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)}
                    style={{...styles.button, ...styles.buttonDanger}}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.4)';
                    }}
                  >
                    Remove Listing
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <h3 style={{marginBottom: '10px', fontSize: '1.5rem'}}>No listings yet</h3>
              <p>Create your first product listing to get started!</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        input:focus::placeholder,
        textarea:focus::placeholder {
          color: transparent;
        }
        
        @media (max-width: 768px) {
          .title {
            fontSize: '2.5rem' !important;
          }
          
          .mainCard {
            padding: '25px' !important;
            margin: '0 10px' !important;
          }
          
          .postsGrid {
            gridTemplateColumns: '1fr' !important;
          }
          
          .twoColumnGrid {
            gridTemplateColumns: '1fr' !important;
          }
          
          .buttonGroup {
            flexDirection: 'column' !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Market;