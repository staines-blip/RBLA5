import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import about1 from "../Assets/about1.png";
import about2 from "../Assets/about2.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-stories">
        <div className="footer-stories-left">
          <div className="seller-story">
            <img src={about1} alt="Seller Stories" />
            <div className="story-content">
              <h3>Seller Stories</h3>
              <p>Discover the artisans behind our handcrafted products</p>
              <Link to="/AboutPage" className="story-link">Meet Our Kreators →</Link>
            </div>
          </div>
        </div>
        <div className="footer-stories-right">
          <div className="crafting-story">
            <img src={about2} alt="Crafting Stories" />
            <div className="story-content">
              <h3>Crafting Stories</h3>
              <p>Shaping lives at each turn</p>
              <Link to="/Gallery" className="story-link">View Gallery →</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/AboutPage">About RBLA</Link></li>
            <li><Link to="/ProductPage">Products</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press Releases</Link></li>
            <li><Link to="/ReturnOrder">Returns Centre</Link></li>
            <li><Link to="/ContactUs">Help</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/towels">Towels</Link></li>
            <li><Link to="/bedsheets">Bedsheets</Link></li>
            <li><Link to="/napkins">Napkins</Link></li>
            <li><Link to="/bags">Bags</Link></li>
            <li><Link to="/cupcoaster">Cup Coasters</Link></li>
            <li><Link to="/paperfiles">Paper Files</Link></li>
            <li><Link to="/bamboo">Bamboo Products</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect with us</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="YouTube">YouTube</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <div className="footer-logo">
            <img src={logo} alt="RBLA Logo" />
          </div>
          <div className="footer-country">
            <button>English</button>
            <button>India</button>
          </div>
        </div>
        <Link to="/UserLogin" className="superadmin-link">super/admin login</Link>
      </div>
    </footer>
  );
};

export default Footer;
