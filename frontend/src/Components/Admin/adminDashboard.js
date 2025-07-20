import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ComposedChart,
  BarChart, 
  LineChart, 
  PieChart, 
  Bar, 
  Line, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const API_BASE = 'http://localhost:4000/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userView, setUserView] = useState('active');
  const [orderView, setOrderView] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const statsResponse = await axios.get(`${API_BASE}/orders/admin-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsResponse.data);
        
        const ordersResponse = await axios.get(`${API_BASE}/orders/admin-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersResponse.data);
        
        const usersResponse = await axios.get(`${API_BASE}/users/all-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sortedUsers = [...usersResponse.data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsers(sortedUsers);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Process user data for growth chart
  const userGrowthData = useMemo(() => {
    const monthlyData = {};
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          farmers: 0,
          customers: 0
        };
      }
      
      if (user.role === 'farmer') {
        monthlyData[monthYear].farmers++;
      } else if (user.role === 'customer') {
        monthlyData[monthYear].customers++;
      }
    });
    
    const result = Object.entries(monthlyData)
      .map(([name, counts]) => ({
        name,
        farmers: counts.farmers,
        customers: counts.customers
      }))
      .sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA - dateB;
      });

    return result.length > 0 ? result : [
      { name: 'Jan 2023', farmers: 5, customers: 15 },
      { name: 'Feb 2023', farmers: 8, customers: 22 },
      { name: 'Mar 2023', farmers: 12, customers: 30 },
      { name: 'Apr 2023', farmers: 15, customers: 40 },
      { name: 'May 2023', farmers: 20, customers: 50 },
    ];
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBanUser = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? 'banned' : 'active';
      
      await axios.put(`${API_BASE}/users/ban/${userId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => 
        u._id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_BASE}/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (sortConfig.key === 'createdAt') {
          return sortConfig.direction === 'ascending' 
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (orderView !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === orderView);
    }
    if (orderSearch) {
      const searchTerm = orderSearch.toLowerCase();
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm) ||
        (order.userId?.username && order.userId.username.toLowerCase().includes(searchTerm)) ||
        order.paymentMethod.toLowerCase().includes(searchTerm) ||
        order.orderStatus.toLowerCase().includes(searchTerm)
      );
    }
    return filtered;
  }, [orders, orderView, orderSearch]);

  const filteredUsers = sortedUsers.filter(user => 
    user.status === userView && (
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  // Prepare other chart data
  const monthlySalesData = stats?.monthlySales?.map(item => ({
    name: item.month,
    sales: item.totalSales
  })) || [];

  const paymentMethodData = stats?.paymentMethods?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const orderStatusData = stats?.orderStatuses?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const orderCounts = {
    all: orders.length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length
  };

  const userCounts = {
    active: users.filter(u => u.status === 'active').length,
    banned: users.filter(u => u.status === 'banned').length
  };

  if (!user || user.role !== 'admin') return null;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
        }
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #ffffff;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dashboard-header {
          background-color: #1e293b;
          color: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-title {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .header-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .welcome-text {
          font-size: 0.9rem;
          color: #e2e8f0;
        }
        .logout-btn {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .logout-btn:hover {
          background-color: #2563eb;
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .nav-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .nav-button, .user-view-button, .order-view-button {
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
        }
        .nav-button:hover, .user-view-button:hover, .order-view-button:hover {
          color: #1e293b;
          background-color: #f1f5f9;
        }
        .nav-button.active, .user-view-button.active, .order-view-button.active {
          color: #3b82f6;
          background-color: #eff6ff;
          font-weight: 600;
        }
        .user-view-tabs, .order-view-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .search-container {
          margin-bottom: 1.5rem;
        }
        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #3b82f6;
        }
        .stat-title {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .stat-change {
          font-size: 0.75rem;
          color: #10b981;
          display: flex;
          align-items: center;
        }
        .charts-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 1024px) {
          .charts-container {
            grid-template-columns: 1fr;
          }
        }
        .chart-container {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        .content-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .content-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }
        .table-container {
          overflow-x: auto;
          margin-bottom: 2rem;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .data-table th {
          background-color: #f8fafc;
          color: #64748b;
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .data-table th.sortable {
          cursor: pointer;
          user-select: none;
        }
        .data-table th.sortable:hover {
          background-color: #f1f5f9;
        }
        .data-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        .data-table tr:hover {
          background-color: #f8fafc;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .status-processing {
          background-color: #fef3c7;
          color: #92400e;
        }
        .status-shipped {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .status-delivered {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-cancelled {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .status-active {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-banned {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .action-select {
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          border: 1px solid #e2e8f0;
          background-color: white;
          font-size: 0.875rem;
          cursor: pointer;
        }
        .action-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .ban-button {
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .ban-button.ban {
          background-color: #ef4444;
          color: white;
        }
        .ban-button.unban {
          background-color: #10b981;
          color: white;
        }
        .ban-button:hover {
          opacity: 0.9;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        .user-name {
          font-weight: 500;
          color: #1e293b;
        }
        .sort-arrow {
          margin-left: 0.25rem;
          display: inline-block;
        }
        .count-badge {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          background-color: #e2e8f0;
          color: #64748b;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          .main-content {
            padding: 1rem;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .user-view-tabs, .order-view-tabs {
            flex-direction: column;
          }
        }
      `}</style>

      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="header-title">Admin Dashboard</h1>
          <div className="header-user">
            <p className="welcome-text">Welcome, {user.username}</p>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="nav-tabs">
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">Total Revenue</div>
                <div className="stat-value">₱{stats?.totalRevenue?.toLocaleString() || '0'}</div>
                <div className="stat-change">↑ 12% from last month</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Total Orders</div>
                <div className="stat-value">{stats?.totalOrders?.toLocaleString() || '0'}</div>
                <div className="stat-change">↑ 8% from last month</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Total Users</div>
                <div className="stat-value">{stats?.totalUsers?.toLocaleString() || '0'}</div>
                <div className="stat-change">↑ 5% from last month</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Pending Orders</div>
                <div className="stat-value">{stats?.pendingOrders || '0'}</div>
                <div className="stat-change">↑ 2.5% from last month</div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-container">
                <h3 className="chart-title">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3 className="chart-title">Payment Methods</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3 className="chart-title">Order Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3 className="chart-title">User Growth (Farmers vs Customers)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="farmers" 
                      name="Farmers" 
                      fill="#8b5cf6" 
                      barSize={20}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      name="Customers" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="content-card">
            <h2 className="content-title">Order Management</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder={`Search ${orderView === 'all' ? 'all' : orderView} orders...`}
                className="search-input"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>

            <div className="order-view-tabs">
              <button
                className={`order-view-button ${orderView === 'all' ? 'active' : ''}`}
                onClick={() => setOrderView('all')}
              >
                All Orders
                <span className="count-badge">{orderCounts.all}</span>
              </button>
              <button
                className={`order-view-button ${orderView === 'delivered' ? 'active' : ''}`}
                onClick={() => setOrderView('delivered')}
              >
                Delivered
                <span className="count-badge">{orderCounts.delivered}</span>
              </button>
              <button
                className={`order-view-button ${orderView === 'shipped' ? 'active' : ''}`}
                onClick={() => setOrderView('shipped')}
              >
                Shipped
                <span className="count-badge">{orderCounts.shipped}</span>
              </button>
              <button
                className={`order-view-button ${orderView === 'processing' ? 'active' : ''}`}
                onClick={() => setOrderView('processing')}
              >
                Processing
                <span className="count-badge">{orderCounts.processing}</span>
              </button>
              <button
                className={`order-view-button ${orderView === 'cancelled' ? 'active' : ''}`}
                onClick={() => setOrderView('cancelled')}
              >
                Cancelled
                <span className="count-badge">{orderCounts.cancelled}</span>
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.userId?.username || 'N/A'}</td>
                      <td>₱{order.totalAmount?.toLocaleString() || 0}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="action-select"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="content-card">
            <h2 className="content-title">User Management</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder={`Search ${userView} users...`}
                className="search-input"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div className="user-view-tabs">
              <button
                className={`user-view-button ${userView === 'active' ? 'active' : ''}`}
                onClick={() => setUserView('active')}
              >
                Active Users
                <span className="count-badge">{userCounts.active}</span>
              </button>
              <button
                className={`user-view-button ${userView === 'banned' ? 'active' : ''}`}
                onClick={() => setUserView('banned')}
              >
                Banned Users
                <span className="count-badge">{userCounts.banned}</span>
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th 
                      className="sortable" 
                      onClick={() => requestSort('createdAt')}
                    >
                      Joined
                      <span className="sort-arrow">
                        {sortConfig.key === 'createdAt' && (
                          sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                        )}
                      </span>
                    </th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info">
                          {user.profile && (
                            <img 
                              src={user.profile} 
                              alt={user.username} 
                              className="user-avatar"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <span className="user-name">{user.username}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge status-${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.lastLogin ? 
                          new Date(user.lastLogin).toLocaleString() : 
                          'Never'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleBanUser(user._id, user.status)}
                          className={`ban-button ${user.status === 'banned' ? 'unban' : 'ban'}`}
                        >
                          {user.status === 'banned' ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;