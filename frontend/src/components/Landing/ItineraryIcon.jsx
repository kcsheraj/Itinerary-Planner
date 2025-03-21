import React from "react";
import "./ItineraryIcon.css"; // Create this CSS file for styling

const ItineraryIcon = ({ emoji, title }) => {
  return (
    <div className="itinerary-card">
      <div className="itinerary-emoji">{emoji}</div>
      <h3 className="itinerary-title">{title}</h3>
    </div>
  );
};

export default ItineraryIcon;
