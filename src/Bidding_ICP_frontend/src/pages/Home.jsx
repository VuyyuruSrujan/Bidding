import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGavel, 
  FaFire, 
  FaClock, 
  FaDollarSign, 
  FaShieldAlt, 
  FaBolt, 
  FaGem,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Home.css';

function Home() {
  const [bids] = useState([
    {
      id: 1,
      title: 'Vintage Watch Collection',
      description: 'Rare collection of vintage watches',
      currentBid: 1500,
      endTime: '2024-03-20',
      creator: 'Jane Smith',
      image: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 2,
      title: 'Gaming Console Bundle',
      description: 'Latest gaming console with games',
      currentBid: 800,
      endTime: '2024-03-25',
      creator: 'Mike Johnson',
      image: 'https://picsum.photos/400/300?random=2'
    }
  ]);

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Secure Bidding',
      description: 'Advanced security measures to protect your transactions'
    },
    {
      icon: <FaBolt />,
      title: 'Real-time Updates',
      description: 'Instant notifications for bid status and auction updates'
    },
    {
      icon: <FaGem />,
      title: 'Premium Items',
      description: 'Curated selection of high-quality items for auction'
    }
  ];

  return (
    <div className="home">
      <div className="animated-bg"></div>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome to BidMaster
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover unique items and participate in exciting auctions. 
            Join our community of buyers and sellers today!
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/create-bid" className="hero-btn primary">
              <FaGavel /> Start Auction
            </Link>
            <Link to="/profile" className="hero-btn secondary">
              <FaFire /> Explore Bids
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Auctions Section */}
      <section className="auctions">
        <h2 className="section-title">
          <FaFire /> Hot Auctions
        </h2>
        <div className="bids-grid">
          {bids.map((bid) => (
            <motion.div
              key={bid.id}
              className="bid-card"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src={bid.image} alt={bid.title} className="bid-image" />
              <div className="bid-content">
                <h3>{bid.title}</h3>
                <p>{bid.description}</p>
                
                <div className="bid-info">
                  <span>
                    <FaDollarSign /> Current Bid: ${bid.currentBid}
                  </span>
                  <span>
                    <FaClock /> Ends: {new Date(bid.endTime).toLocaleDateString()}
                  </span>
                </div>
                
                <Link to={`/bid/${bid.id}`} className="btn">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About BidMaster</h3>
            <p>Your trusted platform for online auctions. Discover, bid, and win unique items.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/create-bid">Start Auction</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/">How It Works</Link></li>
              <li><Link to="/">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

export default Home;