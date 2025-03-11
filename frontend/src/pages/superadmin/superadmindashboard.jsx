import React, { useState, lazy, Suspense } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { FaTachometerAlt, FaUsers, FaBuilding, FaUserShield, FaBox, FaUserFriends, FaStore, FaChartBar, FaSignOutAlt } from "react-icons/fa";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './superadmindashboard.css';

const Workers = lazy(() => import('../../pages/superadmin/workers'));
const Units = lazy(() => import('../../pages/superadmin/Units'));
const CustomerManager = lazy(() => import('../../pages/superadmin/customermanager'));
const AdminRegistration = lazy(() => import('../../pages/superadmin/adminregistration'));

// Sample data for charts
const monthlyData = [
  { name: 'Jan', value: 1.5 },
  { name: 'Feb', value: 2 },
  { name: 'Mar', value: 2.5 },
  { name: 'Apr', value: 2.3 },
  { name: 'May', value: 2.8 },
  { name: 'Jun', value: 3.5 },
  { name: 'Jul', value: 2.5 },
  { name: 'Aug', value: 3.2 },
  { name: 'Sep', value: 4.5 },
  { name: 'Oct', value: 3.8 },
  { name: 'Nov', value: 3.2 },
  { name: 'Dec', value: 2.8 },
];

const deviceData = [
  { name: 'Desktop', value: 92.8 },
  { name: 'Mobile', value: 6.1 },
  { name: 'Tablet', value: 1.1 },
];

const DashboardHome = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [date, setDate] = useState(new Date());

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <div className="period-selector">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">492
            <span className="trend positive">↑ 17% of target</span>
          </div>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={monthlyData.slice(-7)}>
                <Area type="monotone" dataKey="value" stroke="#2196f3" fill="#2196f3" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">87k
            <span className="trend positive">↑ 12% of target</span>
          </div>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={monthlyData.slice(-7)}>
                <Line type="monotone" dataKey="value" stroke="#4caf50" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="stat-value">$12,540
            <span className="trend negative">↓ 2% of target</span>
          </div>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={monthlyData.slice(-7)}>
                <Area type="monotone" dataKey="value" stroke="#f44336" fill="#f44336" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card visitors-chart">
          <h3>Visitors Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#2196f3" fill="#2196f3" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card calendar-card">
          <h3>Calendar</h3>
          <Calendar
            onChange={setDate}
            value={date}
            className="dashboard-calendar"
          />
        </div>
      </div>

      <div className="chart-card devices-chart">
        <h3>Device Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={deviceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#2196f3"
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <nav className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>Super Admin</h2>
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <ul className="sidebar-links">
          <li><button className={selectedSection === 'home' ? 'active' : ''} onClick={() => setSelectedSection('home')}><FaTachometerAlt /> Dashboard</button></li>
          <li><button className={selectedSection === 'workers' ? 'active' : ''} onClick={() => setSelectedSection('workers')}><FaUsers /> Workers</button></li>
          <li><button className={selectedSection === 'units' ? 'active' : ''} onClick={() => setSelectedSection('units')}><FaBuilding /> Units</button></li>
          <li><button className={selectedSection === 'admin' ? 'active' : ''} onClick={() => setSelectedSection('admin')}><FaUserShield /> Admins</button></li>
          <li><button disabled><FaBox /> Products</button></li>
          <li><button className={selectedSection === 'customers' ? 'active' : ''} onClick={() => setSelectedSection('customers')}><FaUserFriends /> Customers</button></li>
          <li><button disabled><FaStore /> Vendors</button></li>
          <li><button disabled><FaChartBar /> Reports</button></li>
          <li><button className="logout-button" onClick={handleLogout}><FaSignOutAlt /> Log out</button></li>
        </ul>
      </nav>

      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {selectedSection === 'home' && <DashboardHome />}
          {selectedSection === 'workers' && <Workers />}
          {selectedSection === 'units' && <Units />}
          {selectedSection === 'customers' && <CustomerManager />}
          {selectedSection === 'admin' && <AdminRegistration />}
        </Suspense>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;