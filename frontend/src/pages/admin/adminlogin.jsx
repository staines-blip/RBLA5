import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminlogin.css';
// admin login module and their parts
const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
// handling the inputchange in the admin module 
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement admin login logic
    console.log('Admin login attempt:', formData);
  };
// from this is going to be the login container 
  return (
    <div className="admin-login-container">
      <div className="stars"></div>
      <div className="mountains">
        <div className="mountain mountain-1"></div>
        <div className="mountain mountain-2"></div>
        <div className="mountain mountain-3"></div>
        <div className="mountain mountain-4"></div>
      </div>
    
      <div className="login-card">
        <div className="header-section">
          <h1>HELLO & WELCOME</h1>
          <p>Welcome to RBLA Admin Portal. Please enter your credentials to access the system.</p>
        </div>

        <div className="login-section">
          <h2>USER LOGIN</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-with-icon">
                <i className="user-icon">👤</i>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-with-icon">
                <i className="password-icon">🔒</i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <div className="remember-section">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </div>
          </form>
        </div>

        <div className="back-to-home">
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
