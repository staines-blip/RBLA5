import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/adminAuthService';
import './adminlogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await loginAdmin(formData);
      console.log('Login successful:', response);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2>ADMIN LOGIN</h2>
          {error && <p className="error-message">{error}</p>}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
