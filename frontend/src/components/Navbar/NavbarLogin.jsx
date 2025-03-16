import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function NavbarLogin() {
  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo-container">
          {/* Wrap the logo in a Link component to redirect to the login page */}
          <Link to="/">
            <img src="/Itinerate.png" alt="Itinerate" className="logo-image" />
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/about">
            <button className="nav-button about-btn">About</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default NavbarLogin;
