import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';

const UserLogin = () => {
  const navigate = useNavigate();
/* this is the user admin login file*/
  const handleAdminLogin = () => {
    navigate('/admin/login');
  };
/* this is the user handling the admin  file*/
  const handleSuperAdminLogin = () => {
    navigate('/superadmin/login');
  };

  return (
    <div className="user-login-container">
      <div className="login-card">
        <div className="business-logo">
          <img src="/logo.png" alt="RBLA Logo" />
          <h2>RBLA</h2>
          <p className="organization-desc">
            Rescue Bonded Labour Association (RBLA) is dedicated to identifying, rescuing, and rehabilitating bonded laborers across India. 
            Through our tireless efforts, we work to break the chains of modern slavery and restore dignity to vulnerable workers.
            Join us in our mission to create a world free from bonded labor.
          </p>
        </div>

        <div className="welcome-section">
          <h1>WELCOME</h1>
          <p>Please select your login type to continue</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="form-actions">
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
        </div>

        <div className="login-type-buttons">
          <button 
            className="type-button admin-btn"
            onClick={handleAdminLogin}
          >
            Login as Admin
          </button>
          <button 
            className="type-button superadmin-btn"
            onClick={handleSuperAdminLogin}
          >
            Login as Superadmin
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
