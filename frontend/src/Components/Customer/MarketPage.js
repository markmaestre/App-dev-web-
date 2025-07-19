import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, MapPin } from 'lucide-react';

const MarketPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      alert('Product added to cart!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Market Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <span className="text-green-600 font-bold">₱{product.price}</span>
              </div>
              
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin size={14} className="mr-1" />
                {product.location}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {product.availableQuantity} available
                </span>
                
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPage;