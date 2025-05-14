import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaSearch, FaBell, FaBook, FaUsers } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <FaGraduationCap className="brand-icon" />
            <span>EduSocial</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/plans" className="nav-link">
              <FaBook className="nav-icon" />
              <span>Learning Plans</span>
            </Link>
            <Link to="/communities" className="nav-link">
              <FaUsers className="nav-icon" />
              <span>Communities</span>
            </Link>
          </div>
          
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for educational content..." 
              className="search-input"
            />
          </div>
          
          <div className="nav-right">
            <div className="user-avatar">
              <div className="avatar">G</div>
              <span className="username">Guest</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;