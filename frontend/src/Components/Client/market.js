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

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    form: {
      background: '#f9f9f9',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      minHeight: '100px'
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginRight: '10px',
      transition: 'background-color 0.3s'
    },
    buttonDanger: {
      backgroundColor: '#e74c3c'
    },
    buttonHover: {
      backgroundColor: '#2980b9'
    },
    buttonDangerHover: {
      backgroundColor: '#c0392b'
    },
    divider: {
      border: '0',
      height: '1px',
      background: '#ddd',
      margin: '30px 0'
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    postCard: {
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s'
    },
    postCardHover: {
      transform: 'translateY(-5px)'
    },
    postImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '15px'
    },
    postTitle: {
      color: '#2c3e50',
      marginBottom: '10px'
    },
    postMeta: {
      color: '#7f8c8d',
      margin: '5px 0',
      fontSize: '14px'
    },
    strong: {
      color: '#2c3e50'
    },
    buttonGroup: {
      display: 'flex',
      marginTop: '15px'
    },
    errorMessage: {
      color: '#e74c3c',
      background: '#fadbd8',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: '#7f8c8d'
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

  if (isLoading) return <div style={styles.loading}>Loading your posts...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{editingPostId ? 'Edit Post' : 'Create Market Post'}</h2>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
        <input
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="availableQuantity"
          placeholder="Available Quantity"
          value={form.availableQuantity}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={styles.input}
        />
        
        <button 
          type="submit" 
          style={styles.button}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          {editingPostId ? 'Update Post' : 'Create Post'}
        </button>
        
        {editingPostId && (
          <button 
            type="button" 
            onClick={handleCancelEdit}
            style={{...styles.button, ...styles.buttonDanger}}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonDangerHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.buttonDanger.backgroundColor}
          >
            Cancel
          </button>
        )}
      </form>

      <hr style={styles.divider} />

      <h2 style={styles.title}>My Market Posts</h2>
      
      <div style={styles.postsGrid}>
        {myPosts.length > 0 ? (
          myPosts.map((post) => (
            <div 
              key={post._id} 
              style={styles.postCard}
              onMouseOver={(e) => e.currentTarget.style.transform = styles.postCardHover.transform}
              onMouseOut={(e) => e.currentTarget.style.transform = ''}
            >
              {post.image && <img src={post.image} alt={post.productName} style={styles.postImage} />}
              <h3 style={styles.postTitle}>{post.productName}</h3>
              <p>{post.description}</p>
              <p style={styles.postMeta}><span style={styles.strong}>₱{post.price}</span> - {post.location}</p>
              <p style={styles.postMeta}><span style={styles.strong}>Quantity:</span> {post.availableQuantity}</p>
              <p style={styles.postMeta}><span style={styles.strong}>Contact:</span> {post.contactNumber}</p>
              
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => handleEdit(post)}
                  style={styles.button}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(post._id)}
                  style={{...styles.button, ...styles.buttonDanger}}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonDangerHover.backgroundColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.buttonDanger.backgroundColor}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>
            You have no posts yet. Create your first post above!
          </p>
        )}
      </div>
    </div>
  );
};

export default Market;