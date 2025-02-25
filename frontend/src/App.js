import React from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importing components
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/admin/adminlogin';
import SuperAdminLogin from './components/superadmin/superadminlogin';
import Dashboard from './pages/superadmin/superadmindashboard';
import Workers from './pages/superadmin/workers';
import CustomerManager from './pages/superadmin/customermanager';

axios.defaults.baseURL = 'http://localhost:5000';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Set UserLogin as the landing page */}
          <Route path="/" element={<UserLogin />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Superadmin routes */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route path="/superadmin/dashboard" element={<Dashboard />} />
          <Route path="/superadmin/admins" element={<div>Admins Page</div>} />
          <Route path="/superadmin/customers" element={<CustomerManager />} />
          <Route path="/superadmin/products" element={<div>Products Page</div>} />
          <Route path="/superadmin/units" element={<div>Units Page</div>} />
          <Route path="/superadmin/workers" element={<Workers />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
