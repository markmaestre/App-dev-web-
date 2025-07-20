// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   Wallet, 
//   DollarSign, 
//   TrendingUp, 
//   Package, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   ArrowUpRight,
//   X,
//   RefreshCw,
//   Loader
// } from 'lucide-react';

// const WalletPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [walletData, setWalletData] = useState({
//     walletBalance: 0,
//     totalSales: 0,
//     totalItemsSold: 0,
//     sales: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//   const [withdrawLoading, setWithdrawLoading] = useState(false);
//   const [withdrawError, setWithdrawError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const API_BASE = 'http://localhost:4000/api';

//   // Enhanced error handler
//   const handleApiError = (error) => {
//     console.error('API Error:', error);
    
//     if (error.response) {
//       // Server responded with error status code
//       if (error.response.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//         return 'Session expired. Please login again.';
//       }
//       return error.response.data?.message || `Server error: ${error.response.status}`;
//     } else if (error.request) {
//       // No response received
//       return 'Network error. Please check your connection.';
//     } else {
//       // Request setup error
//       return 'Request error. Please try again.';
//     }
//   };

//   // Check auth and fetch initial data
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (!token || !storedUser) {
//       navigate('/login');
//       return;
//     }

//     const parsedUser = JSON.parse(storedUser);
//     setUser(parsedUser);

//     if (parsedUser.role !== 'farmer') {
//       navigate('/dashboard');
//       return;
//     }

//     fetchWalletData();
//   }, [navigate]);

//   // Fetch wallet data
//   const fetchWalletData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${API_BASE}/orders/farmer/sales`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         timeout: 10000
//       });
      
//       // Validate response structure
//       if (!response.data || typeof response.data.walletBalance === 'undefined') {
//         throw new Error('Invalid data format from server');
//       }
      
//       setWalletData(response.data);
//     } catch (err) {
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
      
//       // Reset data but stay on page (unless auth error)
//       if (err.response?.status !== 401) {
//         setWalletData({
//           walletBalance: 0,
//           totalSales: 0,
//           totalItemsSold: 0,
//           sales: []
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle withdrawal
//   const handleWithdraw = async () => {
//     if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
//       setWithdrawError('Please enter a valid amount');
//       return;
//     }

//     const amount = parseFloat(withdrawAmount);
//     if (amount > walletData.walletBalance) {
//       setWithdrawError('Insufficient balance');
//       return;
//     }

//     try {
//       setWithdrawLoading(true);
//       setWithdrawError(null);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(
//         `${API_BASE}/orders/farmer/withdraw`,
//         { amount },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setSuccessMessage(`Withdrawal request of ₱${amount.toFixed(2)} submitted!`);
//       setWalletData(prev => ({
//         ...prev,
//         walletBalance: response.data.newBalance
//       }));
//       setWithdrawAmount('');
//       setShowWithdrawModal(false);
//     } catch (err) {
//       setWithdrawError(handleApiError(err));
//     } finally {
//       setWithdrawLoading(false);
//     }
//   };

//   // Format helpers
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-PH', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-PH', {
//       style: 'currency',
//       currency: 'PHP'
//     }).format(amount);
//   };

//   const getStatusIcon = (status) => {
//     switch (status.toLowerCase()) {
//       case 'delivered':
//         return <CheckCircle className="text-green-500" size={16} />;
//       case 'cancelled':
//         return <XCircle className="text-red-500" size={16} />;
//       default:
//         return <Clock className="text-yellow-500" size={16} />;
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <Loader className="animate-spin text-blue-500" size={48} />
//         <p className="mt-4 text-lg text-gray-600">Loading your wallet data...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
//           <div className="flex items-center">
//             <XCircle className="mr-2" size={20} />
//             <strong>Error:</strong>
//           </div>
//           <p className="mt-2">{error}</p>
//           <button
//             onClick={fetchWalletData}
//             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center"
//           >
//             <RefreshCw className="mr-2" size={16} />
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Tailwind CSS (can be moved to your main CSS file) */}
//       <style jsx>{`
//         .card-hover:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
//         }
//         .transition-all {
//           transition: all 0.3s ease;
//         }
//       `}</style>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
//           <span>{successMessage}</span>
//           <button 
//             className="absolute top-0 right-0 px-4 py-3"
//             onClick={() => setSuccessMessage(null)}
//           >
//             <X size={18} />
//           </button>
//         </div>
//       )}

//       {/* Wallet Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {/* Balance Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 card-hover transition-all">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">Wallet Balance</h3>
//             <Wallet className="text-blue-500" size={24} />
//           </div>
//           <p className="text-3xl font-bold text-gray-800 mb-2">
//             {formatCurrency(walletData.walletBalance)}
//           </p>
//           <button
//             onClick={() => setShowWithdrawModal(true)}
//             className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
//           >
//             <ArrowUpRight size={18} />
//             Withdraw Funds
//           </button>
//         </div>

//         {/* Sales Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 card-hover transition-all">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
//             <TrendingUp className="text-green-500" size={24} />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {formatCurrency(walletData.totalSales)}
//           </p>
//           <p className="mt-2 text-sm text-gray-500">
//             All-time earnings from sales
//           </p>
//         </div>

//         {/* Items Sold Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 card-hover transition-all">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">Items Sold</h3>
//             <Package className="text-purple-500" size={24} />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {walletData.totalItemsSold}
//           </p>
//           <p className="mt-2 text-sm text-gray-500">
//             Total products sold
//           </p>
//         </div>
//       </div>

//       {/* Sales History Section */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//             <DollarSign className="text-green-500" size={20} />
//             Sales History
//           </h2>
//           <button 
//             onClick={fetchWalletData}
//             className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
//           >
//             <RefreshCw size={16} />
//             Refresh
//           </button>
//         </div>

//         {walletData.sales.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <Package className="mx-auto mb-4 text-gray-300" size={48} />
//             <p className="text-lg">No sales history yet</p>
//             <p className="text-sm mt-1">Your sales will appear here</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Qty
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {walletData.sales.map((sale, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
//                       #{sale.orderId.substring(0, 8)}...
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {sale.productName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(sale.orderDate)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {sale.quantity}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
//                       {formatCurrency(sale.total)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex items-center gap-2">
//                         {getStatusIcon(sale.status)}
//                         <span className="capitalize">{sale.status}</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Withdraw Modal */}
//       {showWithdrawModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="text-xl font-semibold text-gray-800">Withdraw Funds</h3>
//               <button 
//                 onClick={() => {
//                   setShowWithdrawModal(false);
//                   setWithdrawError(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Amount to Withdraw
//                 </label>
//                 <div className="relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <span className="text-gray-500">₱</span>
//                   </div>
//                   <input
//                     type="number"
//                     value={withdrawAmount}
//                     onChange={(e) => setWithdrawAmount(e.target.value)}
//                     className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                   />
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <span className="text-gray-500">PHP</span>
//                   </div>
//                 </div>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Available: {formatCurrency(walletData.walletBalance)}
//                 </p>
//               </div>

//               {withdrawError && (
//                 <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
//                   {withdrawError}
//                 </div>
//               )}

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setShowWithdrawModal(false);
//                     setWithdrawError(null);
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleWithdraw}
//                   disabled={withdrawLoading}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 >
//                   {withdrawLoading ? (
//                     <>
//                       <Loader className="animate-spin mr-2" size={16} />
//                       Processing...
//                     </>
//                   ) : (
//                     'Withdraw'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WalletPage;