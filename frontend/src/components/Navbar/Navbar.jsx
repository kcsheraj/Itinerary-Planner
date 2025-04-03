import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    clearUser();
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo-container" onClick={() => navigate("/")}>
          <img
            src="/Itinerate-removebg-preview.png"
            alt="Itinerate"
            className="logo-image"
          />
        </div>
        <div className="nav-buttons">
          <button
            className="nav-button dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className="nav-button social-btn"
            onClick={() => navigate("/social")} // ✅ Added navigation to Social Page
          >
            🔊 Social
          </button>

          {/* Profile Button with Dropdown */}
          <div className="relative">
            <button
              className="nav-button profile-btn flex items-center gap-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>👤</span>
              <span>{user ? user.displayName || user.email : "Guest"}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white shadow-md rounded-md text-sm">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-1 text-gray-700 hover:bg-gray-100 transition duration-150"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
