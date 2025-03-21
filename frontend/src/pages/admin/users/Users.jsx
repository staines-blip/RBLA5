import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { isAdminLoggedIn, getAdminStore } from '../../../services/adminAuthService';
import './Users.css';

// This will be replaced with actual API calls
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', registeredDate: '2025-01-15', lastOrder: '2025-03-10', totalOrders: 8, store: 'varnam' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '8765432109', registeredDate: '2025-01-20', lastOrder: '2025-03-15', totalOrders: 5, store: 'varnam' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', phone: '7654321098', registeredDate: '2025-02-05', lastOrder: '2025-03-18', totalOrders: 3, store: 'varnam' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '6543210987', registeredDate: '2025-02-10', lastOrder: '2025-03-01', totalOrders: 2, store: 'siragugal' },
  { id: '5', name: 'Michael Brown', email: 'michael@example.com', phone: '5432109876', registeredDate: '2025-02-15', lastOrder: '2025-03-05', totalOrders: 4, store: 'siragugal' },
  { id: '6', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '4321098765', registeredDate: '2025-02-20', lastOrder: '2025-02-28', totalOrders: 1, store: 'vaagai' },
  { id: '7', name: 'David Taylor', email: 'david@example.com', phone: '3210987654', registeredDate: '2025-03-01', lastOrder: '2025-03-12', totalOrders: 6, store: 'vaagai' },
];

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminStore, setAdminStore] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'registeredDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
          // In a real implementation, you would fetch users from the backend
          // For now, we'll filter the mock data by store
          const storeUsers = mockUsers.filter(user => user.store === store);
          setUsers(storeUsers);
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

  // Sort users based on sortConfig
  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter users based on search term
  const filteredUsers = sortedUsers.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.phone.includes(searchTerm);
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users Management</h1>
        <p>Manage users for {adminStore.charAt(0).toUpperCase() + adminStore.slice(1)} store</p>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>New Users (Last 30 Days)</h3>
          <p>{users.filter(user => new Date(user.registeredDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{users.filter(user => new Date(user.lastOrder) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)).length}</p>
        </div>
      </div>

      <div className="users-filters">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {currentUsers.length === 0 ? (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')}>
                    Name
                    {sortConfig.key === 'name' && (
                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </th>
                  <th onClick={() => requestSort('email')}>
                    Email
                    {sortConfig.key === 'email' && (
                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </th>
                  <th onClick={() => requestSort('phone')}>
                    Phone
                    {sortConfig.key === 'phone' && (
                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </th>
                  <th onClick={() => requestSort('registeredDate')}>
                    Registered Date
                    {sortConfig.key === 'registeredDate' && (
                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </th>
                  <th onClick={() => requestSort('totalOrders')}>
                    Orders
                    {sortConfig.key === 'totalOrders' && (
                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
                    <td>{user.totalOrders}</td>
                    <td className="actions">
                      <button 
                        className="action-btn view-btn" 
                        onClick={() => handleViewUser(user)}
                        title="View User"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit User"
                        disabled
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete User"
                        disabled
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {isViewModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedUser.name}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedUser.phone}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Registered:</span>
                <span className="detail-value">{new Date(selectedUser.registeredDate).toLocaleDateString()}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Last Order:</span>
                <span className="detail-value">{new Date(selectedUser.lastOrder).toLocaleDateString()}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Total Orders:</span>
                <span className="detail-value">{selectedUser.totalOrders}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Store:</span>
                <span className="detail-value">{selectedUser.store.charAt(0).toUpperCase() + selectedUser.store.slice(1)}</span>
              </div>
              
              <div className="user-orders">
                <h3>Recent Orders</h3>
                <p className="placeholder-text">User's recent orders would be displayed here in a real implementation.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn secondary-btn" onClick={handleCloseModal}>Close</button>
              <button className="btn primary-btn" disabled>Edit User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
