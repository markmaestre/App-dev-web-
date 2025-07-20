import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  Truck, 
  Package, 
  CalendarDays, 
  CreditCard,
  ArrowLeft,
  Search
} from 'lucide-react';

const SuccessOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:4000/api/orders/history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const successfulOrders = response.data.filter(order => 
        order.paymentStatus === 'paid' && order.orderStatus !== 'pending'
      );
      
      setOrders(successfulOrders);
      setFilteredOrders(successfulOrders);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load successful orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const result = orders.filter(order => 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(result);
  }, [orders, searchTerm]);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'shipped':
        return { 
          icon: <Truck className="text-purple-500" size={18} />, 
          color: 'bg-purple-500',
          label: 'Shipped' 
        };
      case 'delivered':
        return { 
          icon: <Package className="text-blue-500" size={18} />, 
          color: 'bg-blue-500',
          label: 'Delivered' 
        };
      default:
        return { 
          icon: <CheckCircle className="text-green-500" size={18} />, 
          color: 'bg-green-500',
          label: 'Completed' 
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <h3>Loading Successful Orders</h3>
            <p>Fetching your completed orders...</p>
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
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      {/* Header Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="header-container">
              <div className="hero-title-container">
                <h1 className="hero-title">Successful Orders</h1>
              </div>
              <div className="cart-icon-container">
          
              </div>
            </div>
         
          </div>
        </div>
      </header>

      <main className="products-section">
       
        <div className="search-bar mb-6">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">📦</div>
              <h3>No Successful Orders</h3>
              <p>
                {searchTerm 
                  ? "No orders match your search" 
                  : "You don't have any completed orders yet"}
              </p>
              {searchTerm ? (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="clear-filters-btn"
                >
                  Clear Search
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/payment-history')}
                  className="clear-filters-btn"
                >
                  View Payment History
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="orders-container">
            {filteredOrders.map((order) => {
              const status = getStatusDetails(order.orderStatus);
              
              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <CreditCard className="mr-2" size={18} />
                      Order #{order._id.substring(0, 8).toUpperCase()}
                    </div>
                    <div className={`status-badge ${status.color}`}>
                      {status.icon}
                      <span className="status-text">{status.label}</span>
                    </div>
                  </div>

                  <div className="order-date">
                    <CalendarDays className="mr-2" size={16} />
                    {formatDate(order.createdAt)}
                  </div>

                  <div className="order-items">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="item-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                        <div className="item-details">
                          <h3 className="item-name">{item.productName}</h3>
                          <p className="item-price">₱{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="item-subtotal">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="additional-items">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="payment-method">
                      <span className="footer-label">Payment Method:</span>
                      <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div className="total-amount">
                      <span className="footer-label">Total Amount:</span>
                      <span className="amount">₱{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.paymentProof && (
                    <div className="payment-proof">
                      <span className="proof-label">Payment Proof:</span>
                      <a 
                        href={order.paymentProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="proof-image-container"
                      >
                        <img
                          src={order.paymentProof}
                          alt="Payment proof"
                          className="proof-image"
                        />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx>{`
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
          position: relative;
        }

        .hero-title-container {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .cart-icon-container {
          margin-left: auto;
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

        .clear-filters-btn:hover {
          background: linear-gradient(135deg, #047857, #065f46);
          transform: scale(1.05);
        }

        /* Search Bar */
        .search-bar {
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #cbd5e1;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem 0.75rem 3rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: #cbd5e1;
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #10b981;
          border-color: transparent;
          background: rgba(255, 255, 255, 0.25);
        }

        /* Orders List */
        .products-section {
          padding: 4rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .orders-container {
          display: grid;
          gap: 1.5rem;
        }

        .order-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 1px solid rgba(71, 85, 105, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .order-card:hover {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: translateY(-5px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .order-id {
          font-size: 1.125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.1);
        }

        .status-text {
          font-size: 0.875rem;
        }

        .order-date {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        .order-items {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .item-price {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .item-subtotal {
          font-weight: 600;
        }

        .additional-items {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          margin-bottom: 1rem;
        }

        .footer-label {
          display: block;
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .payment-method {
          text-transform: capitalize;
        }

        .total-amount {
          text-align: right;
        }

        .amount {
          font-weight: 600;
          font-size: 1.125rem;
        }

        .payment-proof {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .proof-label {
          display: block;
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .proof-image-container {
          display: inline-block;
        }

        .proof-image {
          max-width: 150px;
          max-height: 150px;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
        }

        .proof-image:hover {
          border-color: #10b981;
          transform: scale(1.05);
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

          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .order-footer {
            flex-direction: column;
            gap: 1rem;
          }

          .total-amount {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
          }

          .hero-title-container {
            position: static;
            transform: none;
            order: -1;
          }

          .cart-icon-container {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessOrders;