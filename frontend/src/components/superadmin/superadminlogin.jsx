import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './superadminlogin.css';

const SuperadminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login...'); // Debug log
      const response = await axios.post(
        'http://localhost:5000/api/superadmin/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login response:', response.data); // Debug log

      if (response.data.token) {
        // Clear any existing tokens
        localStorage.clear();
        
        // Store the new token
        localStorage.setItem('token', response.data.token);
        
        console.log('Token stored:', response.data.token); // Debug log
        
        // Store superadmin info if needed
        if (response.data.superadmin) {
          localStorage.setItem('superadmin', JSON.stringify(response.data.superadmin));
        }

        // Navigate to dashboard
        navigate('/superadmin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message); // Debug log
      setError(
        err.response?.data?.message || 'Invalid credentials or server error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-section">
          {/* Placeholder for image */}
        </div>
        <div className="login-form-section">
          <h1 className="brand-title">Varnam Sirugagal Vaagai </h1>
          <h2 className="login-subtitle">Superadmin Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              disabled={isLoading}
            />
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperadminLogin;
