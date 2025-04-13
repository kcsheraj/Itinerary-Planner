import React from "react";
import { Link } from "react-router-dom";

function NavbarLogin() {
  return (
    <div className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      <header className="flex justify-between items-center px-6 py-4">
        <div className="logo-container">
          <Link to="/">
            <img
              src="/Itinerate-removebg-preview.png"
              alt="Wandr Logo"
              className="h-10"
            />
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/about">
            <button className="text-green-900 font-semibold hover:underline">
              About
            </button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default NavbarLogin;
