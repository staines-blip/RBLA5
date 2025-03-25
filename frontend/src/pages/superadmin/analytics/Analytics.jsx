import React from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

const Analytics = () => {
  // Sample data - replace with real data from your backend
  const monthlyData = [
    { month: 'Jan', sales: 4000, users: 240, orders: 150 },
    { month: 'Feb', sales: 3000, users: 198, orders: 120 },
    { month: 'Mar', sales: 5000, users: 300, orders: 180 },
    { month: 'Apr', sales: 2780, users: 208, orders: 140 },
    { month: 'May', sales: 1890, users: 250, orders: 160 },
    { month: 'Jun', sales: 2390, users: 280, orders: 175 }
  ];

  return (
    <div className="analytics-container">
      <h1>Data Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        <div className="chart-card">
          <h2>Monthly Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Order Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
