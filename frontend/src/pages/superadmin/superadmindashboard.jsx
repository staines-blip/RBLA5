import React, { useState, lazy, Suspense, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';
import { FaTachometerAlt, FaUsers, FaBox, FaUserShield, FaShoppingCart, FaCreditCard, FaComments, FaChartLine, FaSignOutAlt } from "react-icons/fa";
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './superadmindashboard.css';
import { useNavigate } from 'react-router-dom';

const Workers = lazy(() => import('../../pages/superadmin/workers'));
const AdminRegistration = lazy(() => import('../../pages/superadmin/adminregistration'));
const ProductList = lazy(() => import('../../pages/superadmin/products'));
const Orders = lazy(() => import('../../pages/superadmin/orders/Orders'));
const Payments = lazy(() => import('./payments/payments'));
const Reviews = lazy(() => import('./reviews/reviews'));
const SalesReport = lazy(() => import('./sales/SalesReports'));

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DashboardHome = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      date: '2025-03-22',
      title: 'Retake Stock Count',
      description: 'Complete inventory check and update stock records',
      type: 'inventory'
    },
    {
      date: '2025-03-25',
      title: 'Monthly Sales Review',
      description: 'Review sales performance and set targets',
      type: 'meeting'
    },
    {
      date: '2025-03-28',
      title: 'New Product Launch',
      description: 'Launch spring collection items',
      type: 'product'
    }
  ]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    salesByCategory: [],
    orderStatusStats: [],
    revenueByMonth: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('superadminToken');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [ordersRes, usersRes, revenueRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/api/superadmin/orders?limit=5`, { headers }),
          axios.get(`${API_URL}/api/superadmin/customers`, { headers }),
          axios.get(`${API_URL}/api/superadmin/sales/revenue`, { headers }),
          axios.get(`${API_URL}/api/superadmin/sales/products`, { headers })
        ]);

        setDashboardData({
          totalUsers: usersRes.data.total || 0,
          totalOrders: ordersRes.data.total || 0,
          totalRevenue: revenueRes.data.reduce((sum, item) => sum + item.totalRevenue, 0),
          recentOrders: ordersRes.data.orders || [],
          topProducts: productsRes.data || [],
          salesByCategory: productsRes.data.reduce((acc, product) => {
            const category = acc.find(c => c.name === product.category);
            if (category) {
              category.value += product.totalRevenue;
            } else {
              acc.push({ name: product.category, value: product.totalRevenue });
            }
            return acc;
          }, []),
          orderStatusStats: ordersRes.data.statusStats || [],
          revenueByMonth: revenueRes.data || []
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Calendar tile content
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const eventForDate = events.find(event => event.date === dateStr);
      
      if (eventForDate) {
        return (
          <div className="calendar-event-indicator">
            <div className={`event-dot ${eventForDate.type}`} />
          </div>
        );
      }
    }
    return null;
  };

  // Handle tile hover
  const handleTileHover = (event, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const eventForDate = events.find(e => e.date === dateStr);
    
    if (eventForDate) {
      const tileRect = event.currentTarget.getBoundingClientRect();
      const calendarRect = event.currentTarget.closest('.calendar-wrapper').getBoundingClientRect();
      
      setTooltipPosition({
        left: tileRect.right - calendarRect.left,
        top: tileRect.top - calendarRect.top + (tileRect.height / 2)
      });
      setHoveredDate(dateStr);
    } else {
      setHoveredDate(null);
    }
  };

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <div className="period-selector">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">
            {dashboardData.totalUsers.toLocaleString()}
            <span className="trend positive">↑ {((dashboardData.totalUsers / 1000) * 100).toFixed(1)}% growth</span>
          </div>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={dashboardData.revenueByMonth.slice(-7)}>
                <Area type="monotone" dataKey="totalRevenue" stroke="#2196f3" fill="#2196f3" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">
            {dashboardData.totalOrders.toLocaleString()}
            <span className="trend positive">↑ {((dashboardData.totalOrders / 10000) * 100).toFixed(1)}% increase</span>
          </div>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={dashboardData.revenueByMonth.slice(-7)}>
                <Line type="monotone" dataKey="orderCount" stroke="#4caf50" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">
            ₹{dashboardData.totalRevenue.toLocaleString()}
            <span className={`trend ${dashboardData.totalRevenue > 1000000 ? 'positive' : 'negative'}`}>
              {dashboardData.totalRevenue > 1000000 ? '↑' : '↓'} {((dashboardData.totalRevenue / 1000000) * 100).toFixed(1)}% of target
            </span>
          </div>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={dashboardData.revenueByMonth.slice(-7)}>
                <Area type="monotone" dataKey="totalRevenue" stroke="#f44336" fill="#f44336" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card revenue-chart">
          <h3>Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="totalRevenue" name="Revenue" stroke="#2196f3" fill="#2196f3" fillOpacity={0.2} />
              <Area type="monotone" dataKey="averageOrderValue" name="Avg Order Value" stroke="#4caf50" fill="#4caf50" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card order-status-chart">
          <h3>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.orderStatusStats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {dashboardData.orderStatusStats.map((entry, index) => (
                  <Cell key={index} fill={['#2196f3', '#4caf50', '#ff9800', '#f44336'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card top-products-chart">
          <h3>Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.topProducts.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenue" name="Revenue" fill="#2196f3" />
              <Bar dataKey="totalQuantity" name="Units Sold" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card calendar-card">
          <h3>Calendar</h3>
          <div className="calendar-wrapper">
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={getTileContent}
              onClickDay={(value, event) => handleTileHover(event, value)}
              onMouseOver={(value, event) => handleTileHover(event, value)}
              onMouseOut={() => setHoveredDate(null)}
              className="react-calendar"
            />
          </div>
          {hoveredDate && (
            <div 
              className="event-tooltip" 
              style={{ 
                left: `${tooltipPosition.left}px`,
                top: `${tooltipPosition.top}px`
              }}
            >
              {events
                .filter(event => event.date === hoveredDate)
                .map((event, index) => (
                  <div key={index} className="event-tooltip-content">
                    <div className={`event-type-indicator ${event.type}`} />
                    <div>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="chart-card recent-orders">
          <h3>Recent Orders</h3>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.user.name}</td>
                    <td>₹{order.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuperAdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('superadminToken');
    navigate('/login');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardHome />;
      case 'workers':
        return <Workers />;
      case 'admins':
        return <AdminRegistration />;
      case 'products':
        return <ProductList />;
      case 'orders':
        return <Orders />;
      case 'payments':
        return <Payments />;
      case 'reviews':
        return <Reviews />;
      case 'sales':
        return <SalesReport />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Super Admin</h2>
        </div>
        <nav className="sidebar-links">
          <button 
            className={activeComponent === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveComponent('dashboard')}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button 
            className={activeComponent === 'admins' ? 'active' : ''} 
            onClick={() => setActiveComponent('admins')}
          >
            <FaUserShield /> Admins
          </button>
          <button 
            className={activeComponent === 'products' ? 'active' : ''} 
            onClick={() => setActiveComponent('products')}
          >
            <FaBox /> Products
          </button>
          <button 
            className={activeComponent === 'orders' ? 'active' : ''} 
            onClick={() => setActiveComponent('orders')}
          >
            <FaShoppingCart /> Orders
          </button>
          <button 
            className={activeComponent === 'payments' ? 'active' : ''} 
            onClick={() => setActiveComponent('payments')}
          >
            <FaCreditCard /> Payments
          </button>
          <button 
            className={activeComponent === 'reviews' ? 'active' : ''} 
            onClick={() => setActiveComponent('reviews')}
          >
            <FaComments /> Reviews
          </button>
          <button 
            className={activeComponent === 'workers' ? 'active' : ''} 
            onClick={() => setActiveComponent('workers')}
          >
            <FaUsers /> Workers
          </button>
          <button 
            className={activeComponent === 'sales' ? 'active' : ''} 
            onClick={() => setActiveComponent('sales')}
          >
            <FaChartLine /> Sales Report
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
      <div className="main-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {renderComponent()}
        </Suspense>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;