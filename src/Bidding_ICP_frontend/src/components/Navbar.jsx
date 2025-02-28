import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaPlus, FaBars, FaGavel, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Navbar.css';
import Signup from './Signup';

function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/">
            <FaGavel /> BidMaster
          </Link>
        </motion.div>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <motion.div whileHover={{ y: -2 }}>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <FaHome /> <span>Home</span>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }}>
            <Link 
              to="/explore" 
              className={`nav-link ${isActive('/explore') ? 'active' : ''}`}
            >
              <FaSearch /> <span>Explore</span>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }}>
            <Link 
              to="/create-bid" 
              className={`nav-link ${isActive('/create-bid') ? 'active' : ''}`}
            >
              <FaPlus /> <span>Create Bid</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }}>
            <Signup />
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }}>
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              <FaUser />
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="nav-avatar"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;