import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Login admin
export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.token) {
      // Clear any existing tokens
      localStorage.clear();
      
      // Store the new token
      localStorage.setItem('adminToken', response.data.token);
      
      // Store admin info
      if (response.data.admin) {
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
      }
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to login';
  }
};

// Get current admin
export const getCurrentAdmin = () => {
  const admin = localStorage.getItem('admin');
  return admin ? JSON.parse(admin) : null;
};

// Check if admin is logged in
export const isAdminLoggedIn = () => {
  return !!localStorage.getItem('adminToken');
};

// Logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('admin');
};
