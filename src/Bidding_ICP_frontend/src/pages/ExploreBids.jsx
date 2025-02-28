import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaClock, FaUser, FaMoneyBill } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './ExploreBids.css';
import { Bidding_ICP_backend } from '../../../declarations/Bidding_ICP_backend';

function ExploreBids() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [all_biddings, setAllBiddings] = useState([]);
  const [filteredBiddings, setFilteredBiddings] = useState([]);

  useEffect(() => {
    get_all_biddings();
  }, []);

  useEffect(() => {
    filterBiddings();
  }, [searchTerm, selectedCategory, priceRange, all_biddings]);

  async function bufferToBase64(buffer) {
    const base64url = await new Promise((r) => {
      const reader = new FileReader();
      reader.onload = () => r(reader.result);
      reader.readAsDataURL(new Blob([buffer]));
    });
    return base64url.slice(base64url.indexOf(',') + 1);
  }

  async function get_all_biddings() {
    const ans = await Bidding_ICP_backend.get_biddings();
    console.log('all biddings:', ans);
    if (ans) {
      const convertedBids = await Promise.all(
        ans.map(async (bid) => {
          const base64Image = await bufferToBase64(bid.image);
          return { ...bid, imageUrl: `data:image/jpeg;base64,${base64Image}` };
        })
      );
      setAllBiddings(convertedBids);
    }
  }

  function filterBiddings() {
    let filtered = all_biddings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((bid) =>
        bid.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((bid) => bid.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter((bid) => {
        const price = Number(bid.starting_bid);
        if (priceRange === 'low') return price < 50;
        if (priceRange === 'medium') return price >= 50 && price < 200;
        if (priceRange === 'high') return price >= 200;
        return true;
      });
    }

    setFilteredBiddings(filtered);
  }

  return (
    <div className="explore-bids">
      <div className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for bids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
          </button>
        </div>

        <motion.div
          className="filters"
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        >
          <div className="filter-group">
            <h3>Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              <option value="art">Art</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="price-select"
            >
              <option value="all">All Prices</option>
              <option value="low">Below 50 ICP</option>
              <option value="medium">50 - 200 ICP</option>
              <option value="high">Above 200 ICP</option>
            </select>
          </div>
        </motion.div>
      </div>

      <div className="bids-grid">
        {filteredBiddings.length > 0 ? (
          filteredBiddings.map((bid) => (
            <motion.div
              key={bid.bidding_id}
              className="bid-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <img src={bid.imageUrl} alt="bid image" className="bid-image" />
              <div className="bid-content">
                <h3>{bid.title}</h3>
                <p className="bid-description">{bid.description}</p>

                <div className="bid-info">
                  <span className="current-bid">
                    <FaMoneyBill /> {Number(bid.starting_bid)} ICP
                  </span>
                  <span className="end-time">
                    <FaClock /> {new Date(Date.parse(bid.end_date)).toLocaleDateString()}
                  </span>
                </div>

                <div className="bid-creator">
                  <span>
                    <FaUser /> {(bid.prin).toString() || 'Unknown User'}
                  </span>
                </div>

                <Link to={`/bid/${bid.bidding_id}`} className="view-btn">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results">
            <h2>No bids found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreBids;
