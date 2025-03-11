import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, isAdminLoggedIn } from '../../services/adminAuthService';
import './adminlogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add Material Icons font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);

    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await isAdminLoggedIn();
        if (isLoggedIn) {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginAdmin(formData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-content">
        <div className="left-section">
          <div className="brand-section">
            <img src="/logo.png" alt="RBLA Logo" className="logo" />
            <h1>RBLA Admin Portal</h1>
            <p className="brand-description">
              Rescue Bonded Labour Association (RBLA) is dedicated to identifying, rescuing, and rehabilitating bonded laborers across India. Through our tireless efforts, we work to break the chains of modern slavery and restore dignity to vulnerable workers.
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="login-section">
            <h2>ADMIN LOGIN</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="input-with-icon">
                  <span className="material-icons">person_outline</span>
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
                  <span className="material-icons">lock_outline</span>
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
                <button type="submit" className="login-button" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
