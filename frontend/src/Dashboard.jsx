import React from "react";
import "../Dashboard.css"; // Keep using your existing styles

const itineraries = [
  { title: "New York 2025", image: "/images/nyc.png" },
  { title: "Picnic", image: "/images/picnic.png" },
  { title: "Ocean City", image: "/images/ocean.png" },
  { title: "Cherry Blossoms", image: "/images/cherry.png" },
  { title: "DC On Friday", image: "/images/dc.png" },
  { title: "Hawaii", image: "/images/hawaii.png" },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navbar stays unchanged */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="new-itinerary-btn">New Itinerary +</button>
      </header>

      {/* "Go to Itinerary" button */}
      <div className="center-btn">
        <button className="go-itinerary-btn">Go to Itinerary</button>
      </div>

      {/* Itinerary Grid */}
      <div className="itinerary-grid">
        {itineraries.map((trip, index) => (
          <div key={index} className="itinerary-card">
            <img src={trip.image} alt={trip.title} className="itinerary-img" />
            <h3>{trip.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
