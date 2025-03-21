import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { isAdminLoggedIn, getAdminStore } from '../../../services/adminAuthService';
import './Sales.css';

// Mock data for sales
const mockSalesData = [
  { id: '1', date: '2025-03-01', totalSales: 15000, orderCount: 25, topCategory: 'Electronics', store: 'varnam' },
  { id: '2', date: '2025-03-02', totalSales: 12500, orderCount: 20, topCategory: 'Fashion', store: 'varnam' },
  { id: '3', date: '2025-03-03', totalSales: 18000, orderCount: 30, topCategory: 'Home & Kitchen', store: 'varnam' },
  { id: '4', date: '2025-03-04', totalSales: 9500, orderCount: 15, topCategory: 'Electronics', store: 'varnam' },
  { id: '5', date: '2025-03-05', totalSales: 22000, orderCount: 35, topCategory: 'Fashion', store: 'varnam' },
  { id: '6', date: '2025-03-06', totalSales: 17500, orderCount: 28, topCategory: 'Books', store: 'varnam' },
  { id: '7', date: '2025-03-07', totalSales: 20000, orderCount: 32, topCategory: 'Electronics', store: 'varnam' },
  { id: '8', date: '2025-03-08', totalSales: 13000, orderCount: 22, topCategory: 'Home & Kitchen', store: 'siragugal' },
  { id: '9', date: '2025-03-09', totalSales: 11000, orderCount: 18, topCategory: 'Fashion', store: 'siragugal' },
  { id: '10', date: '2025-03-10', totalSales: 16000, orderCount: 26, topCategory: 'Electronics', store: 'siragugal' },
  { id: '11', date: '2025-03-11', totalSales: 14500, orderCount: 24, topCategory: 'Books', store: 'vaagai' },
  { id: '12', date: '2025-03-12', totalSales: 19000, orderCount: 31, topCategory: 'Fashion', store: 'vaagai' },
  { id: '13', date: '2025-03-13', totalSales: 21000, orderCount: 34, topCategory: 'Electronics', store: 'vaagai' },
  { id: '14', date: '2025-03-14', totalSales: 18500, orderCount: 29, topCategory: 'Home & Kitchen', store: 'vaagai' },
];

// Mock data for product sales
const mockProductSales = [
  { id: '1', productName: 'Smartphone X', category: 'Electronics', unitsSold: 45, revenue: 45000, store: 'varnam' },
  { id: '2', productName: 'Designer Jeans', category: 'Fashion', unitsSold: 38, revenue: 19000, store: 'varnam' },
  { id: '3', productName: 'Coffee Maker', category: 'Home & Kitchen', unitsSold: 30, revenue: 15000, store: 'varnam' },
  { id: '4', productName: 'Bestseller Novel', category: 'Books', unitsSold: 60, revenue: 12000, store: 'varnam' },
  { id: '5', productName: 'Wireless Earbuds', category: 'Electronics', unitsSold: 50, revenue: 25000, store: 'varnam' },
  { id: '6', productName: 'Summer Dress', category: 'Fashion', unitsSold: 42, revenue: 21000, store: 'siragugal' },
  { id: '7', productName: 'Blender', category: 'Home & Kitchen', unitsSold: 25, revenue: 12500, store: 'siragugal' },
  { id: '8', productName: 'Cookbook', category: 'Books', unitsSold: 35, revenue: 7000, store: 'vaagai' },
];

const Sales = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminStore, setAdminStore] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const isLoggedIn = await isAdminLoggedIn();
        if (!isLoggedIn) {
          navigate('/admin/login');
          return;
        }
        
        // Get admin's store
        const store = getAdminStore();
        if (store) {
          setAdminStore(store);
          
          // Filter sales data by store
          const storeSalesData = mockSalesData.filter(sale => sale.store === store);
          setSalesData(storeSalesData);
          
          // Filter product sales by store
          const storeProductSales = mockProductSales.filter(product => product.store === store);
          setProductSales(storeProductSales);
          
          // Calculate total revenue and orders
          const revenue = storeSalesData.reduce((sum, sale) => sum + sale.totalSales, 0);
          const orders = storeSalesData.reduce((sum, sale) => sum + sale.orderCount, 0);
          
          setTotalRevenue(revenue);
          setTotalOrders(orders);
          setAverageOrderValue(orders > 0 ? revenue / orders : 0);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Authentication failed. Please log in again.');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate]);

  // Filter sales data based on date range
  const getFilteredSalesData = () => {
    const today = new Date();
    let filteredData = [...salesData];
    
    if (dateRange === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = salesData.filter(sale => new Date(sale.date) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredData = salesData.filter(sale => new Date(sale.date) >= monthAgo);
    } else if (dateRange === 'year') {
      const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredData = salesData.filter(sale => new Date(sale.date) >= yearAgo);
    }
    
    return filteredData;
  };

  // Filter product sales based on category
  const getFilteredProductSales = () => {
    if (!categoryFilter) return productSales;
    return productSales.filter(product => product.category === categoryFilter);
  };

  // Prepare data for sales trend chart
  const salesTrendData = {
    labels: getFilteredSalesData().map(sale => new Date(sale.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Sales (₹)',
        data: getFilteredSalesData().map(sale => sale.totalSales),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
      {
        label: 'Orders',
        data: getFilteredSalesData().map(sale => sale.orderCount),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  // Prepare data for category distribution chart
  const getCategoryData = () => {
    const categories = {};
    getFilteredProductSales().forEach(product => {
      if (categories[product.category]) {
        categories[product.category] += product.revenue;
      } else {
        categories[product.category] = product.revenue;
      }
    });
    
    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
        },
      ],
    };
  };

  // Chart options
  const salesTrendOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales (₹)',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Orders',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Sales by Category',
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h1>Sales Analytics</h1>
        <p>Sales performance for {adminStore.charAt(0).toUpperCase() + adminStore.slice(1)} store</p>
      </div>

      <div className="sales-filters">
        <div className="filter-dropdown">
          <FaCalendarAlt />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 365 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div className="filter-dropdown">
          <FaFilter />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
          </select>
        </div>
        <button className="export-btn">
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="sales-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Average Order Value</h3>
          <p>₹{averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="charts-container">
        <div className="chart-card">
          <h3>Sales Trend</h3>
          <div className="chart-wrapper">
            <Line data={salesTrendData} options={salesTrendOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Category Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={getCategoryData()} options={categoryOptions} />
          </div>
        </div>
      </div>

      <div className="top-products">
        <h3>Top Selling Products</h3>
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredProductSales()
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((product) => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.unitsSold}</td>
                    <td>₹{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sales-by-day">
        <h3>Daily Sales Breakdown</h3>
        <div className="chart-wrapper">
          <Bar 
            data={{
              labels: getFilteredSalesData().map(sale => new Date(sale.date).toLocaleDateString()),
              datasets: [
                {
                  label: 'Daily Sales',
                  data: getFilteredSalesData().map(sale => sale.totalSales),
                  backgroundColor: '#4CAF50',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Sales (₹)',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;
