import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FashionForward from '../components/FashionForward/FashionForward';
import SellerStories from '../components/SellerStories/SellerStories';
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // Define navigate

  return (
    <div className="page-container">
      <FashionForward />
      <SellerStories />
      
      <section className="bulk-orders">
        <div className="bulk-orders-content">
          <h1>Place a bulk order with us</h1>
          <div className="underline"></div>
          <p>
            We partner with store owners, corporate clients, event companies, or others 
            interested in wholesale buying. Each order will be fully customized to fit your needs.
          </p>
          {/* Button linked to ContactUs page */}
          <button className="bulk-orders-btn" onClick={() => navigate('/contactus')}>
            Get In Touch
          </button>
          <button className="bulk-btn" onClick={() => navigate('/bulkorders')}>
            Learn More
          </button>
        </div>
        <div className="bulk-orders-image"></div>
      </section>
    </div>
  );
};

export default Home;
