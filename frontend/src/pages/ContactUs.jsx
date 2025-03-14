import React from 'react';
import './ContactUs.css';
import ContactImage from '../components/Assets/v6.png'; // Replace with the actual path to your image
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa'; // Using react-icons for social media icons

const ContactUs = () => {
  return (
    <section className="contact-us">
      <div className="contact-us-left">
        <h1>Contact</h1>
        <div className="underline"></div>
        <p>
          We’d love to help you with an order, for general customer service
          enquiries or product questions. The best time to reach us is Mon - Sat
          9:00 am - 6:00 pm (Indian Standard Time).
        </p>
        <div className="contact-details">
          <h3>Email</h3>
          <a href="mailto:contact@varnamsiragugalvaaigai.com">
            contact@varnamsiragugalvaaigai.com
          </a>
        </div>
        <div className="contact-details phone-numbers">
          <div className="phone">
            <h3>Calling from India</h3>
            <a href="tel:+91931227797">+91 931227797</a>
          </div>
          <div className="phone">
            <h3>Calling from Outside India</h3>
            <a href="tel:+91931227797">+91 931227797</a>
          </div>
        </div>
        <div className="social-icons">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
      <div
        className="contact-us-right"
        style={{ backgroundImage: `url(${ContactImage})` }}
      ></div>
    </section>
  );
};

export default ContactUs;