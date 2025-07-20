// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ShoppingCart, Star, MapPin } from 'lucide-react';

// const MarketPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/market');
//         setProducts(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const addToCart = async (productId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         // Redirect to login if not authenticated
//         window.location.href = '/login';
//         return;
//       }

//       await axios.post(
//         'http://localhost:4000/api/cart',
//         { productId, quantity: 1 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       alert('Product added to cart!');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add to cart');
//     }
//   };

//   if (loading) return <div>Loading products...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Market Products</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map(product => (
//           <div key={product._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
//             {product.image && (
//               <img 
//                 src={product.image} 
//                 alt={product.productName}
//                 className="w-full h-48 object-cover"
//               />
//             )}
//             <div className="p-4">
//               <div className="flex justify-between items-start">
//                 <h3 className="text-lg font-semibold">{product.productName}</h3>
//                 <span className="text-green-600 font-bold">₱{product.price}</span>
//               </div>
              
//               <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              
//               <div className="flex items-center mt-2 text-sm text-gray-500">
//                 <MapPin size={14} className="mr-1" />
//                 {product.location}
//               </div>
              
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
//                   {product.availableQuantity} available
//                 </span>
                
//                 <button
//                   onClick={() => addToCart(product._id)}
//                   className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                 >
//                   <ShoppingCart size={16} className="mr-1" />
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MarketPage;








import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, MapPin, Search, Filter } from 'lucide-react';

const MarketPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/market');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      await axios.post(
        'http://localhost:4000/api/cart',
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      showNotification('Product added to cart!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high': return parseFloat(b.price) - parseFloat(a.price);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return a.productName.localeCompare(b.productName);
    }
  });

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner-container">
            <div className="spinner primary"></div>
            <div className="spinner secondary"></div>
          </div>
          <div className="loading-text">
            <h3>Loading Marketplace</h3>
            <p>Fetching the latest products for you...</p>
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
          <h3>Connection Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry Connection
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
            <h1 className="hero-title">Market Products</h1>
            <p className="hero-subtitle">
              Discover exceptional products from trusted sellers. Quality guaranteed, freshness delivered.
            </p>
            
            {/* Search and Filter Bar */}
            <div className="search-bar">
              <div className="filter-grid">
                <div className="search-input-container">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="select-container">
                  <Filter className="select-icon" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="select-container">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Products Grid */}
      <main className="products-section">
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <article 
              key={product._id}
              className="product-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="product-image-container">
                {product.image && (
                  <img 
                    src={product.image}
                    alt={product.productName}
                    className="product-image"
                  />
                )}
                <div className="image-overlay"></div>
                
                {/* Price Badge */}
                <div className="price-badge">
                  ₱{product.price}
                </div>
                
                {/* Rating Badge */}
                {product.rating && (
                  <div className="rating-badge">
                    <Star className="star-icon" size={12} fill="currentColor" />
                    {product.rating}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="product-content">
                <div className="product-info">
                  <h3 className="product-title">
                    {product.productName}
                  </h3>
                  <p className="product-description">
                    {product.description}
                  </p>
                </div>
                
                {/* Location and Stock */}
                <div className="product-meta">
                  <div className="location-badge">
                    <MapPin className="location-icon" size={14} />
                    {product.location}
                  </div>
                  <div className="stock-info">
                    {product.availableQuantity} available
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product._id)}
                  className="add-to-cart-btn"
                >
                  <ShoppingCart className="cart-icon" size={16} />
                  <span className="btn-text">Add to Cart</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </article>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">🔍</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your search terms or filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </main>
      
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .marketplace-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #047857 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Loading Styles */
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

        .dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Error Styles */
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

        .error-content button:hover {
          background: linear-gradient(135deg, #047857, #065f46);
          transform: scale(1.05);
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
          font-size: clamp(3rem, 8vw, 6rem);
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

        .search-bar {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .search-input-container,
        .select-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon,
        .select-icon {
          position: absolute;
          left: 1rem;
          color: #cbd5e1;
          z-index: 1;
        }

        .search-input,
        .filter-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .search-input {
          padding-left: 3rem;
        }

        .select-container .filter-select {
          padding-left: 3rem;
        }

        .search-input::placeholder {
          color: #cbd5e1;
        }

        .search-input:focus,
        .filter-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px #10b981;
          border-color: transparent;
          background: rgba(255, 255, 255, 0.25);
        }

        .filter-select option {
          background: #1e293b;
          color: white;
        }

        /* Products Section */
        .products-section {
          padding: 4rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .product-card {
          position: relative;
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid rgba(71, 85, 105, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .product-card:hover {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: translateY(-12px) rotateY(2deg);
        }

        .product-image-container {
          position: relative;
          height: 16rem;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
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
        }

        .rating-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          color: #fbbf24;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .product-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }

        .product-card:hover .product-title {
          color: #a7f3d0;
        }

        .product-description {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .location-badge {
          background: rgba(71, 85, 105, 0.5);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          color: #cbd5e1;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stock-info {
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .add-to-cart-btn {
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, #059669 0%, #047857 50%, #059669 100%);
          color: white;
          font-weight: bold;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn:hover {
          background: linear-gradient(135deg, #047857 0%, #065f46 50%, #047857 100%);
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(5, 150, 105, 0.3);
        }

        .add-to-cart-btn:active {
          transform: scale(0.98);
        }

        .btn-text {
          position: relative;
          z-index: 10;
        }

        .btn-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .add-to-cart-btn:hover .btn-shine {
          opacity: 1;
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

        /* Cart Notification */
        :global(.cart-notification) {
          position: fixed;
          top: 1rem;
          right: 1rem;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 9999;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :global(.cart-notification.success) {
          background: linear-gradient(135deg, #059669, #047857);
        }

        :global(.cart-notification.error) {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        :global(.cart-notification.show) {
          transform: translateX(0);
        }

        :global(.notification-content) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          color: white;
          font-weight: 600;
        }

        :global(.notification-icon) {
          width: 1.5rem;
          height: 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
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
          
          .filter-grid {
            grid-template-columns: 1fr;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }
          
          .products-section {
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .search-bar {
            padding: 1rem;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MarketPage;