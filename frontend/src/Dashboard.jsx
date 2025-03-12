import React from "react";
import "./Dashboard.css"; // Import CSS file for styling

const itineraries = [
  { id: 1, name: "New York 2025", emoji: "🏙️" },
  { id: 2, name: "Picnic", emoji: "🍇" },
  { id: 3, name: "Ocean City", emoji: "🏄‍♂️" },
  { id: 4, name: "Cherry Blossoms", emoji: "🌸" },
  { id: 5, name: "DC On Friday", emoji: "🥂" },
  { id: 6, name: "Hawaii", emoji: "🏝️" },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <button>🏠</button>
        <h1>Itinerate</h1>
        <div>
          <button className="nav-button">Social</button>
          <button className="nav-button">User123</button>
        </div>
      </nav>

      {/* Dashboard Title & Button */}
      <div className="dashboard-header">
        <h2>Dashboard Page</h2>
        <button className="new-itinerary-btn">New Itinerary +</button>
      </div>

      {/* Itinerary Cards */}
      <div className="grid-container">
        {itineraries.map((itinerary) => (
          <div key={itinerary.id} className="itinerary-card">
            <span className="emoji">{itinerary.emoji}</span>
            <p>{itinerary.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
