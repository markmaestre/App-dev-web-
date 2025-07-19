import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, X, Plus, Minus, CreditCard } from 'lucide-react';

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
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get only the base64 part
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

      // Validate form
      if (!formData.shippingAddress.trim()) {
        throw new Error('Shipping address is required');
      }

      if (formData.paymentMethod !== 'cash_on_delivery' && !formData.paymentProof) {
        throw new Error('Payment proof is required for selected payment method');
      }

      // Prepare data
      const checkoutData = {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        paymentProof: formData.paymentMethod !== 'cash_on_delivery' 
          ? await convertToBase64(formData.paymentProof)
          : null
      };

      // Submit order
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
        navigate('/orders/history', { 
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
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
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-2" /> Your Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div 
                  key={item.productId._id} 
                  className="border rounded-lg p-4 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="md:w-1/4 mb-4 md:mb-0 flex-shrink-0">
                    <img
                      src={item.productId.image}
                      alt={item.productId.productName}
                      className="w-full h-40 object-contain rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  <div className="md:w-3/4 md:pl-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold line-clamp-2">
                          {item.productId.productName}
                        </h2>
                        <button
                          onClick={() => removeItem(item.productId._id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          aria-label="Remove item"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <p className="text-gray-600 mt-1">₱{item.productId.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300 transition-colors"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="bg-gray-100 px-4 py-1 text-center min-w-[40px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="mt-2 font-medium">
                        Subtotal: ₱{(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 bg-white shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span>₱{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₱{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors"
                >
                  <CreditCard className="mr-2" /> Proceed to Checkout
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Modal */}
          {showCheckoutModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Complete Your Order</h2>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Shipping Address<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    placeholder="Enter your complete shipping address including postal code"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Payment Method<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="gcash">GCash</option>
                    <option value="paymaya">Maya</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                </div>
                
                {formData.paymentMethod !== 'cash_on_delivery' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Payment Proof<span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {formData.paymentProof ? (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            {formData.paymentProof.name}
                          </p>
                          <button
                            onClick={() => setFormData({...formData, paymentProof: null})}
                            className="text-red-500 text-sm mt-1 hover:text-red-700"
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
                          <label
                            htmlFor="paymentProof"
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <CreditCard className="text-gray-400 mb-2" size={32} />
                              <p className="text-sm text-gray-600">
                                Upload screenshot of your payment
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                (JPG, PNG, or PDF, max 5MB)
                              </p>
                              <button
                                type="button"
                                className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm transition-colors"
                              >
                                Select File
                              </button>
                            </div>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-2">Order Summary</h3>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Items ({cart.items.length})</span>
                    <span>₱{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₱{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || 
                      !formData.shippingAddress.trim() || 
                      (formData.paymentMethod !== 'cash_on_delivery' && !formData.paymentProof)}
                    className={`flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors ${
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
        </>
      )}
    </div>
  );
};

export default CartPage;