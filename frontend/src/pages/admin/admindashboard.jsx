import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admindashboard.css";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { FaTachometerAlt, FaShoppingCart, FaBox, FaUsers, FaMoneyBillWave, FaChartLine, FaStar, FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import { logoutAdmin, isAdminLoggedIn } from "../../services/adminAuthService";
import Products from './products/Products';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardHome = () => {
  const [revenue, setRevenue] = useState(50000);
  const [monthlySales, setMonthlySales] = useState(1200);
  const [orders, setOrders] = useState(340);
  const [users, setUsers] = useState(1500);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [50, 70, 80, 90, 100, 120, 150, 200, 180, 170, 190, 210],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ["Electronics", "Fashion", "Home & Kitchen", "Books"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="stats">
        <div className="card">Revenue: ${revenue}</div>
        <div className="card">Monthly Sales: {monthlySales}</div>
        <div className="card">Orders: {orders}</div>
        <div className="card">Users: {users}</div>
      </div>
      <div className="charts">
        <div className="chart-card">
          <h3>Sales Trend</h3>
          <Line data={salesData} />
        </div>
        <div className="chart-card">
          <h3>Category Sales</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        const isLoggedIn = await isAdminLoggedIn();
        if (!isLoggedIn) {
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login on error
      navigate('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <ul className="sidebar-links">
          <li><button className={selectedSection === 'home' ? 'active' : ''} onClick={() => setSelectedSection('home')}><FaTachometerAlt /> Dashboard</button></li>
          <li><button disabled className="disabled-button"><FaShoppingCart /> Orders</button></li>
          <li><button className={selectedSection === 'products' ? 'active' : ''} onClick={() => setSelectedSection('products')}><FaBox /> Products</button></li>
          <li><button disabled className="disabled-button"><FaUsers /> Customers</button></li>
          <li><button disabled className="disabled-button"><FaMoneyBillWave /> Payments</button></li>
          <li><button disabled className="disabled-button"><FaChartLine /> Sales</button></li>
          <li><button disabled className="disabled-button"><FaStar /> Reviews</button></li>
          <li><button disabled className="disabled-button"><FaUserFriends /> Workers</button></li>
          <li><button className="logout-button" onClick={handleLogout}><FaSignOutAlt /> Log out</button></li>
        </ul>
      </nav>

      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        {selectedSection === 'home' ? (
          <DashboardHome />
        ) : selectedSection === 'products' ? (
          <Products />
        ) : null}
      </main>
    </div>
  );
};

export default AdminDashboard;
