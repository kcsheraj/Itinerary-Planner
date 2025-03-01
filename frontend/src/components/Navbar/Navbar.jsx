import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo-container">
          <img src="/Itinerate.png" alt="Itinerate" className="logo-image" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search Your Plans..." className="search-input" />
          <button className="search-button">🔍</button>
        </div>
        <div className="nav-buttons">
          <button className="nav-button dashboard-btn">📊 Dashboard</button>
          <button className="nav-button favorites-btn">⭐ Favorites</button>
          <button className="nav-button social-btn">🔊 Social</button>
          <button className="nav-button profile-btn">👤</button>
        </div>
      </header>
    </div>
  );
}

export default Navbar;