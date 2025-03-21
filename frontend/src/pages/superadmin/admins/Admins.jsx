import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import AdminRegistration from '../adminregistration';
import './admins.css';

const Admins = () => {
  return (
    <div className="admins-container">
      <div className="admins-header">
        <h1>Admin Management</h1>
        <p>Create and manage admin accounts for store management</p>
      </div>
      
      <div className="admins-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUserShield />
          </div>
          <div className="stat-info">
            <h3>Admin Registration</h3>
            <p>Create new admin accounts</p>
          </div>
        </div>
      </div>
      
      <div className="admins-content">
        <AdminRegistration />
      </div>
    </div>
  );
};

export default Admins;
