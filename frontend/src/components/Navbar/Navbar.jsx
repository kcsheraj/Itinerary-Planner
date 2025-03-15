import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "./Navbar.css";

function Navbar({ user, handleLogout }) {
  const navigate = useNavigate(); // Initialize navigate
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown state

  // Function to navigate to the dashboard
  const handleDashboardRedirect = () => {
    navigate("/dashboard"); // Redirect to the dashboard page
  };

  // Function to navigate to the home page (Wander logo)
  const handleHomeRedirect = () => {
    navigate("/"); // Redirect to home page or landing page
  };

  // Toggle the dropdown menu for profile
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo-container" onClick={handleHomeRedirect}>
          <img src="/Itinerate.png" alt="Itinerate" className="logo-image" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Your Plans..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        <div className="nav-buttons">
          <button
            className="nav-button dashboard-btn"
            onClick={handleDashboardRedirect} // Attach the redirect function to the button
          >
            📊 Dashboard
          </button>
          <button className="nav-button favorites-btn">⭐ Favorites</button>
          <button className="nav-button social-btn">🔊 Social</button>
          <div
            className="nav-button profile-btn flex items-center gap-2"
            onClick={toggleDropdown} // Toggle dropdown when profile icon is clicked
          >
            <span>👤</span>
            <span>{user ? user.displayName || user.email : "Guest"}</span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Navbar;
