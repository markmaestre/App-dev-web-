import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/market';

const Market = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    description: '',
    price: '',
    location: '',
    availableQuantity: '',
    contactNumber: '',
    image: null,
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const token = localStorage.getItem('token'); // Make sure this is set after login

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

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
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editingPostId) {
        await axios.put(`${API_BASE}/${editingPostId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingPostId(null);
      } else {
        await axios.post(API_BASE, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        productName: '',
        description: '',
        price: '',
        location: '',
        availableQuantity: '',
        contactNumber: '',
        image: null,
      });

      fetchPosts();
    } catch (err) {
      console.error('Error submitting post:', err);
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
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        await axios.delete(`${API_BASE}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <div className="market-container">
      <h2>{editingPostId ? 'Edit Post' : 'Create Market Post'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="productName" placeholder="Product Name" value={form.productName} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="availableQuantity" placeholder="Available Quantity" value={form.availableQuantity} onChange={handleChange} />
        <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} />
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
        <button type="submit">{editingPostId ? 'Update' : 'Create'}</button>
      </form>

      <hr />

      <h2>Market Posts</h2>
      <div className="market-posts">
        {posts.map((post) => (
          <div key={post._id} className="market-post">
            {post.image && <img src={post.image} alt={post.productName} width="150" />}
            <h3>{post.productName}</h3>
            <p>{post.description}</p>
            <p><strong>₱{post.price}</strong> - {post.location}</p>
            <p><strong>Quantity:</strong> {post.availableQuantity}</p>
            <p><strong>Contact:</strong> {post.contactNumber}</p>
            <p><em>Posted by: {post.userId?.username || 'Unknown'}</em></p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;

