import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaUsers } from 'react-icons/fa';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CommunityCard from '../components/CommunityCard';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await api.getAllCommunities();
        setCommunities(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="loading">Loading communities...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="communities-page">
      <Navbar />
      
      <div className="container">
        <div className="communities-header">
          <h1>Communities</h1>
          <p>Join communities to connect with like-minded learners</p>
          
          <div className="communities-search">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <Link to="/communities/new" className="btn btn-primary">
              <FaPlus /> Create Community
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="error-container">
            <div className="error">{error}</div>
          </div>
        )}
        
        {filteredCommunities.length === 0 ? (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No communities found</h3>
            <p>Be the first to create a community!</p>
            <Link to="/communities/new" className="btn btn-primary">
              Create Community
            </Link>
          </div>
        ) : (
          <div className="communities-grid">
            {filteredCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;