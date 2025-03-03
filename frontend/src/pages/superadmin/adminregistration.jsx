import React, { useState } from 'react';
import { createAdmin } from '../../services/adminapi';
import './adminregistration.css';

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    aadharNumber: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    // Validate Aadhar number
    if (formData.aadharNumber.length !== 12 || !/^\d+$/.test(formData.aadharNumber)) {
      setError("Please enter a valid 12-digit Aadhar number");
      return;
    }
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...adminData } = formData;
      const response = await createAdmin(adminData);
      setSuccess('Admin registered successfully!');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        aadharNumber: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to register admin');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Registration</h1>
        <p>Create your store admin account</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form id="adminForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="required">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Enter your full name" 
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="required">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber" className="required">Phone Number</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber" 
              placeholder="Enter your phone number" 
              required
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username" className="required">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Choose a username" 
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="aadharNumber" className="required">Aadhar Card Number</label>
          <input 
            type="text" 
            id="aadharNumber" 
            name="aadharNumber" 
            placeholder="Enter your 12-digit Aadhar number" 
            required
            pattern="[0-9]{12}"
            value={formData.aadharNumber}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="storeName" className="required">Store Name</label>
          <select
            id="storeName"
            name="storeName"
            required
            value={formData.storeName}
            onChange={handleChange}
          >
            <option value="">Select a store</option>
            <option value="varnam">Varnam</option>
            <option value="siragugal">Siragugal</option>
            <option value="vaagai">Vaagai</option>
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password" className="required">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="required">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password" 
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Register Admin</button>
      </form>
    </div>
  );
};

export default AdminRegistration;