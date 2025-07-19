import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Package, Check, X, Clock } from 'lucide-react';

const PaymentHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment history');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <Check className="text-green-500" />;
      case 'failed':
        return <X className="text-red-500" />;
      default:
        return <Clock className="text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading payment history...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <CreditCard className="mr-2" /> Payment History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">You haven't made any orders yet</p>
          <button
            onClick={() => navigate('/market')}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold">Order #{order._id.toString().substring(18, 24)}</h2>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(order.paymentStatus)}
                  <span className="ml-2 capitalize">{order.paymentStatus}</span>
                </div>
              </div>
              
              <div className="my-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center py-2">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        ₱{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Payment Method:</p>
                  <p className="capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount:</p>
                  <p className="font-bold">₱{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              {order.paymentProof && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Payment Proof:</p>
                  <img
                    src={order.paymentProof}
                    alt="Payment proof"
                    className="w-32 h-32 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;