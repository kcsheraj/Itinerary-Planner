import React from "react";
import { useNavigate } from "react-router-dom";
import "./ItineraryIcon.css"; // Ensure styles are available

const ItineraryIcon = ({ id, initialEmoji, initialTitle, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/itinerary/${id}`); // Navigate to itinerary details
  };

  return (
    <div className="itinerary-card">
      <div className="itinerary-display" onClick={handleClick}>
        <span className="itinerary-emoji">{initialEmoji}</span>
        <p className="itinerary-title">{initialTitle}</p>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="edit-btn" onClick={onEdit}>Edit</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ItineraryIcon;
