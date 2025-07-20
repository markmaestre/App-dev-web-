import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, X, Plus, Minus, CreditCard, MapPin, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'gcash',
    paymentProof: null
  });
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:4000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/api/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'paymentProof') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!formData.shippingAddress.trim()) {
        throw new Error('Shipping address is required');
      }

      if (formData.paymentMethod !== 'cash_on_delivery' && !formData.paymentProof) {
        throw new Error('Payment proof is required for selected payment method');
      }

      const checkoutData = {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        paymentProof: formData.paymentMethod !== 'cash_on_delivery' 
          ? await convertToBase64(formData.paymentProof)
          : null
      };

      const response = await axios.post(
        'http://localhost:4000/api/orders/checkout',
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setShowCheckoutModal(false);
        navigate('/payment-history', { 
          state: { 
            message: 'Order placed successfully!',
            orderId: response.data.order._id 
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Checkout failed. Please try again.');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner-container">
            <div className="spinner primary"></div>
            <div className="spinner secondary"></div>
          </div>
          <div className="loading-text">
            <h3>Loading Your Cart</h3>
            <p>Fetching your shopping cart items...</p>
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠</div>
          <h3>Error Loading Cart</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = cart.items.reduce(
    (total, item) => total + (item.productId.price * item.quantity),
    0
  );

  return (
    <div className="marketplace-container">
      {/* Header Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="header-container">
              <h1 className="hero-title">Your Shopping Cart</h1>
              <div className="cart-icon-container">
               
              </div>
            </div>
            <p className="hero-subtitle">
              Review and manage your items before checkout
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="products-section">
        {cart.items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">🛒</div>
              <h3>Your Cart is Empty</h3>
              <p>Looks like you haven't added any items yet</p>
              <button 
                onClick={() => navigate('/shop')}
                className="clear-filters-btn"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-grid-container">
            <div className="cart-items-container">
              {cart.items.map((item) => (
                <article key={item.productId._id} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={item.productId.image}
                      alt={item.productId.productName}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="image-overlay"></div>
                    
                    <div className="price-badge">
                      ₱{item.productId.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="product-content">
                    <div className="product-info">
                      <h3 className="product-title">
                        {item.productId.productName}
                      </h3>
                      <p className="product-description">
                        {item.productId.description || 'No description available'}
                      </p>
                    </div>
                    
                    <div className="product-meta">
                      <div className="location-badge">
                        <MapPin className="location-icon" size={14} />
                        {item.productId.location || 'No location specified'}
                      </div>
                    </div>
                    
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="item-subtotal">
                      ₱{(item.productId.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="remove-item-btn"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>₱{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping Fee</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>₱{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="checkout-btn"
                >
                  <CreditCard className="mr-2" size={18} />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Complete Your Order</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="modal-close-btn"
              >
                <X size={24} />
              </button>
            </div>
            
            {error && (
              <div className="error-notification">
                {error}
              </div>
            )}
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">
                  Shipping Address<span className="required">*</span>
                </label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Enter your complete shipping address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Payment Method<span className="required">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="gcash">GCash</option>
                  <option value="paymaya">Maya</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>
              
              {formData.paymentMethod !== 'cash_on_delivery' && (
                <div className="form-group">
                  <label className="form-label">
                    Payment Proof<span className="required">*</span>
                  </label>
                  <div className="file-upload-container">
                    {formData.paymentProof ? (
                      <div className="file-preview">
                        <p className="file-name">{formData.paymentProof.name}</p>
                        <button
                          onClick={() => setFormData({...formData, paymentProof: null})}
                          className="change-file-btn"
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          name="paymentProof"
                          onChange={handleInputChange}
                          className="hidden"
                          id="paymentProof"
                          accept="image/*,.pdf"
                          required
                        />
                        <label htmlFor="paymentProof" className="file-upload-label">
                          <div className="file-upload-content">
                            <CreditCard className="upload-icon" size={32} />
                            <p>Upload payment screenshot</p>
                            <p className="file-upload-hint">(JPG, PNG or PDF, max 5MB)</p>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="order-summary-modal">
                <h3 className="summary-modal-title">Order Summary</h3>
                <div className="summary-modal-details">
                  <div className="summary-modal-row">
                    <span>Items ({cart.items.length})</span>
                    <span>₱{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-modal-row">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="summary-modal-divider"></div>
                  <div className="summary-modal-row total">
                    <span>Total</span>
                    <span>₱{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="modal-secondary-btn"
              >
                Back to Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || 
                  !formData.shippingAddress.trim() || 
                  (formData.paymentMethod !== 'cash_on_delivery' && !formData.paymentProof)}
                className={`modal-primary-btn ${
                  checkoutLoading || 
                  !formData.shippingAddress.trim() || 
                  (formData.paymentMethod !== 'cash_on_delivery' && !formData.paymentProof)
                    ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Shared styles from MarketPage */
        .marketplace-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #047857 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: white;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #047857 50%, #0f172a 100%);
          padding: 5rem 1.5rem;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-text {
          text-align: center;
          max-width: 64rem;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: bold;
          background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 50%, #10b981 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-align: center;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 48rem;
          margin-left: auto;
          margin-right: auto;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .cart-icon-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Loading and Error States */
        .loading-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #047857 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-content {
          text-align: center;
        }

        .spinner-container {
          position: relative;
          margin: 0 auto 2rem;
        }

        .spinner {
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner.primary {
          width: 80px;
          height: 80px;
          border: 4px solid #10b981;
          border-top: 4px solid transparent;
        }

        .spinner.secondary {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 64px;
          height: 64px;
          border: 4px solid rgba(148, 163, 184, 0.3);
          border-top: 4px solid transparent;
        }

        .loading-text h3 {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
        }

        .loading-text p {
          color: #cbd5e1;
          margin-bottom: 1.5rem;
        }

        .dots {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
        }

        .dots span {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .error-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #7f1d1d 50%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .error-content {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(239, 68, 68, 0.3);
          max-width: 32rem;
          text-align: center;
        }

        .error-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          color: white;
          animation: pulse 2s ease-in-out infinite;
        }

        .error-content h3 {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
        }

        .error-content p {
          color: #cbd5e1;
          margin-bottom: 2rem;
        }

        .error-content button {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 5rem 1rem;
        }

        .empty-content {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          padding: 4rem;
          border: 1px solid rgba(71, 85, 105, 0.5);
          max-width: 28rem;
          margin: 0 auto;
        }

        .empty-icon {
          width: 6rem;
          height: 6rem;
          background: linear-gradient(135deg, #64748b, #475569);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          font-size: 2.5rem;
        }

        .empty-content h3 {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
        }

        .empty-content p {
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        .clear-filters-btn {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        /* Cart Items */
        .products-section {
          padding: 4rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .cart-grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .cart-grid-container {
            grid-template-columns: 2fr 1fr;
          }
        }

        .cart-items-container {
          display: grid;
          gap: 1.5rem;
        }

        .product-card {
          position: relative;
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid rgba(71, 85, 105, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: grid;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .product-card {
            grid-template-columns: 1fr 2fr;
          }
        }

        .product-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
        }

        .price-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: bold;
          font-size: 1.125rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          z-index: 1;
        }

        .product-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
        }

        .product-description {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-meta {
          margin-bottom: 1.5rem;
        }

        .location-badge {
          background: rgba(71, 85, 105, 0.5);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          color: #cbd5e1;
          font-size: 0.875rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .quantity-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .quantity-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
        }

        .item-subtotal {
          font-weight: bold;
          font-size: 1.125rem;
          margin-bottom: 1rem;
        }

        .remove-item-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(239, 68, 68, 0.2);
          border: none;
          color: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-item-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        /* Order Summary */
        .order-summary {
          position: sticky;
          top: 1rem;
        }

        .summary-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          padding: 1.5rem;
          border: 1px solid rgba(71, 85, 105, 0.5);
        }

        .summary-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: white;
        }

        .summary-details {
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: #cbd5e1;
        }

        .summary-row.total {
          font-weight: bold;
          color: white;
          font-size: 1.125rem;
          margin-top: 1rem;
        }

        .summary-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 1rem 0;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #059669 0%, #047857 50%, #059669 100%);
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkout-btn:hover {
          background: linear-gradient(135deg, #047857 0%, #065f46 50%, #047857 100%);
          transform: translateY(-2px);
        }

        /* Checkout Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-container {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 1.5rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(71, 85, 105, 0.5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modal-close-btn:hover {
          color: white;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .error-notification {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #ef4444;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: white;
        }

        .required {
          color: #ef4444;
          margin-left: 0.25rem;
        }

        .form-textarea,
        .form-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px #10b981;
          border-color: transparent;
        }

        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .file-upload-container {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.2s ease;
        }

        .file-upload-container:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .file-upload-label {
          display: block;
          cursor: pointer;
        }

        .file-upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .upload-icon {
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .file-upload-hint {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .file-name {
          font-size: 0.875rem;
          color: white;
          margin-bottom: 0.5rem;
          word-break: break-all;
          text-align: center;
        }

        .change-file-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .change-file-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .order-summary-modal {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .summary-modal-title {
          font-size: 1.125rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
        }

        .summary-modal-details {
          font-size: 0.875rem;
        }

        .summary-modal-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: #cbd5e1;
        }

        .summary-modal-row.total {
          font-weight: bold;
          color: white;
          margin-top: 0.5rem;
        }

        .summary-modal-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0.75rem 0;
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 1rem;
        }

        .modal-secondary-btn {
          flex: 1;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1rem;
          border-radius: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-primary-btn {
          flex: 1;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-primary-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #047857, #065f46);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5; 
          }
          40% { 
            transform: scale(1);
            opacity: 1; 
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 1rem;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .products-section {
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .product-card {
            grid-template-columns: 1fr;
          }
          
          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;