import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Bidding</h3>
          <p>Making Bidding onchian thorugh ICP Blockchain</p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/explore">Explore Bids</Link>
          <Link to="/create-bid">Start Bid</Link>
          <Link to="/">About Us</Link>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <Link to="/">Help Center</Link>
          <Link to="/">Contact Us</Link>
          <Link to="/">Terms of Service</Link>
          <Link to="/  ">Privacy Policy</Link>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: info@Bidding.com</p>
          <p>Phone: +1 234 567 8900</p>
          <p>Address: 123 Business Ave, Suite 100, City, Country</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bidding. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;