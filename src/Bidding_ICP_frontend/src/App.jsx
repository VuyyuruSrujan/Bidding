import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import CreateBid from './pages/CreateBid';
import BidDetails from './pages/BidDetails';
import ExploreBids from './pages/ExploreBids';
import Home from './pages/Home';
import './App.css';
import Footer from './pages/Footer';

function App() {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  });

  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/create-bid" element={<CreateBid user={user} />} />
            <Route path="/bid/:id" element={<BidDetails user={user} />} />
            <Route path="/explore" element={<ExploreBids />} />
            <Route path="/navbar" element={<Navbar />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App
