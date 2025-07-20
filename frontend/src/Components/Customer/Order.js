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
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SuccessOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
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
      
      // Filter for successfully paid and non-pending orders
      const successfulOrders = response.data.filter(order => 
        order.paymentStatus === 'paid' && order.orderStatus !== 'pending'
      );
      
      setOrders(successfulOrders);
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
    // Filter orders based on search term
    const result = orders.filter(order => 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when search changes
  }, [orders, searchTerm]);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'shipped':
        return { 
          icon: <Truck className="mr-1" />, 
          color: 'bg-purple-100 text-purple-800',
          label: 'Shipped' 
        };
      case 'delivered':
        return { 
          icon: <Package className="mr-1" />, 
          color: 'bg-blue-100 text-blue-800',
          label: 'Delivered' 
        };
      default:
        return { 
          icon: <CheckCircle className="mr-1" />, 
          color: 'bg-green-100 text-green-800',
          label: 'Completed' 
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <CheckCircle className="mr-2" /> Successful Orders
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search successful orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? (
            <>
              <p className="text-lg mb-2">No successful orders match your search</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-green-600 hover:underline"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="text-lg mb-4">You don't have any successful orders yet</p>
              <button
                onClick={() => navigate('/payment-history')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                go to Payment History
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentOrders.map((order) => {
              const status = getStatusDetails(order.orderStatus);
              
              return (
                <div 
                  key={order._id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                    <div>
                      <h3 className="font-semibold">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CalendarDays className="mr-1" size={14} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} flex items-center`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <img 
                          src={item.image} 
                          alt={item.productName} 
                          className="w-12 h-12 object-cover rounded mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                        <div className="flex-grow">
                          <p className="font-medium line-clamp-1">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            ₱{item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500 mt-1">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Payment method</p>
                      <p className="font-medium capitalize">
                        {order.paymentMethod.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total amount</p>
                      <p className="font-bold text-lg">₱{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {order.paymentProof && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-2">Payment Proof:</p>
                      <a 
                        href={order.paymentProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={order.paymentProof}
                          alt="Payment proof"
                          className="w-32 h-32 object-contain border rounded hover:border-green-500 transition-colors"
                        />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-10 h-10 rounded-full ${currentPage === number ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuccessOrders;