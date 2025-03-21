import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus, FaUserCog } from 'react-icons/fa';
import { isAdminLoggedIn, getAdminStore } from '../../../services/adminAuthService';
import './Workers.css';

// Mock data for workers
const mockWorkers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '9876543210', role: 'Manager', joinDate: '2024-01-15', status: 'Active', store: 'varnam' },
  { id: '2', name: 'Emma Johnson', email: 'emma@example.com', phone: '8765432109', role: 'Sales Associate', joinDate: '2024-02-10', status: 'Active', store: 'varnam' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '7654321098', role: 'Inventory Clerk', joinDate: '2024-03-05', status: 'Active', store: 'varnam' },
  { id: '4', name: 'Sarah Davis', email: 'sarah@example.com', phone: '6543210987', role: 'Cashier', joinDate: '2024-03-15', status: 'Inactive', store: 'varnam' },
  { id: '5', name: 'Robert Wilson', email: 'robert@example.com', phone: '5432109876', role: 'Sales Associate', joinDate: '2024-04-01', status: 'Active', store: 'varnam' },
  { id: '6', name: 'Jennifer Taylor', email: 'jennifer@example.com', phone: '4321098765', role: 'Manager', joinDate: '2024-01-20', status: 'Active', store: 'siragugal' },
  { id: '7', name: 'David Anderson', email: 'david@example.com', phone: '3210987654', role: 'Cashier', joinDate: '2024-02-15', status: 'Active', store: 'siragugal' },
  { id: '8', name: 'Lisa Thomas', email: 'lisa@example.com', phone: '2109876543', role: 'Sales Associate', joinDate: '2024-03-10', status: 'Inactive', store: 'vaagai' },
];

const Workers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminStore, setAdminStore] = useState('');
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Sales Associate',
    status: 'Active'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(5);

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
          
          // Filter workers by store
          const storeWorkers = mockWorkers.filter(worker => worker.store === store);
          setWorkers(storeWorkers);
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

  // Filter workers based on search term, role filter, and status filter
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.phone.includes(searchTerm);
    const matchesRole = roleFilter === '' || worker.role === roleFilter;
    const matchesStatus = statusFilter === '' || worker.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get current workers for pagination
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view worker details
  const handleViewWorker = (worker) => {
    setSelectedWorker(worker);
    setIsViewModalOpen(true);
  };

  // Handle add new worker
  const handleAddWorker = () => {
    setIsAddModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitWorker = () => {
    // In a real implementation, this would send the new worker data to the backend
    const newWorkerData = {
      id: (workers.length + 1).toString(),
      ...newWorker,
      joinDate: new Date().toISOString().split('T')[0],
      store: adminStore
    };
    
    setWorkers([...workers, newWorkerData]);
    setIsAddModalOpen(false);
    setNewWorker({
      name: '',
      email: '',
      phone: '',
      role: 'Sales Associate',
      status: 'Active'
    });
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedWorker(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading workers data...</p>
      </div>
    );
  }

  return (
    <div className="workers-container">
      <div className="workers-header">
        <h1>Workers Management</h1>
        <p>Manage store staff for {adminStore.charAt(0).toUpperCase() + adminStore.slice(1)} store</p>
      </div>

      <div className="workers-stats">
        <div className="stat-card">
          <h3>Total Workers</h3>
          <p>{workers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Workers</h3>
          <p>{workers.filter(worker => worker.status === 'Active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Managers</h3>
          <p>{workers.filter(worker => worker.role === 'Manager').length}</p>
        </div>
        <div className="stat-card">
          <h3>Sales Associates</h3>
          <p>{workers.filter(worker => worker.role === 'Sales Associate').length}</p>
        </div>
      </div>

      <div className="workers-actions">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <div className="filter-dropdown">
            <FaUserCog />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Manager">Manager</option>
              <option value="Sales Associate">Sales Associate</option>
              <option value="Cashier">Cashier</option>
              <option value="Inventory Clerk">Inventory Clerk</option>
            </select>
          </div>
          <div className="filter-dropdown">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button className="add-worker-btn" onClick={handleAddWorker}>
          <FaPlus /> Add Worker
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {currentWorkers.length === 0 ? (
        <div className="no-workers">
          <p>No workers found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="workers-table-container">
            <table className="workers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWorkers.map((worker) => (
                  <tr key={worker.id}>
                    <td>{worker.name}</td>
                    <td>{worker.role}</td>
                    <td>{worker.email}</td>
                    <td>{worker.phone}</td>
                    <td>{new Date(worker.joinDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${worker.status.toLowerCase()}`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="action-btn view-btn" 
                        onClick={() => handleViewWorker(worker)}
                        title="View Worker"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Worker"
                        disabled
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Worker"
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
            {Array.from({ length: Math.ceil(filteredWorkers.length / workersPerPage) }, (_, i) => (
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

      {/* View Worker Modal */}
      {isViewModalOpen && selectedWorker && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Worker Details</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="worker-detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedWorker.name}</span>
              </div>
              <div className="worker-detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedWorker.email}</span>
              </div>
              <div className="worker-detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedWorker.phone}</span>
              </div>
              <div className="worker-detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{selectedWorker.role}</span>
              </div>
              <div className="worker-detail-row">
                <span className="detail-label">Join Date:</span>
                <span className="detail-value">{new Date(selectedWorker.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="worker-detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${selectedWorker.status.toLowerCase()}`}>
                  {selectedWorker.status}
                </span>
              </div>
              <div className="worker-detail-row">
                <span className="detail-label">Store:</span>
                <span className="detail-value">{selectedWorker.store.charAt(0).toUpperCase() + selectedWorker.store.slice(1)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn secondary-btn" onClick={handleCloseModal}>Close</button>
              <button className="btn primary-btn" disabled>Edit Worker</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Worker</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newWorker.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newWorker.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newWorker.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={newWorker.role}
                  onChange={handleInputChange}
                >
                  <option value="Manager">Manager</option>
                  <option value="Sales Associate">Sales Associate</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Inventory Clerk">Inventory Clerk</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newWorker.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn secondary-btn" onClick={handleCloseModal}>Cancel</button>
              <button 
                className="btn primary-btn" 
                onClick={handleSubmitWorker}
                disabled={!newWorker.name || !newWorker.email || !newWorker.phone}
              >
                Add Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;
