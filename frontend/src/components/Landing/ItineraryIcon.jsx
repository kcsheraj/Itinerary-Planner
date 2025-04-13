import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItineraryIcon.css"; // Ensure styles are available

const ItineraryIcon = ({ id, initialEmoji, initialTitle, onDelete, onEdit}) => {
  const [emoji, setEmoji] = useState(initialEmoji);
  const [title, setTitle] = useState(initialTitle);
  //const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isEditing) {
      navigate(`/itinerary/${id}`); // Navigate to itinerary details
    }
  };

  return (
    <div className="itinerary-card">
      <div className="itinerary-display" onClick={handleClick}>
        <span className="itinerary-emoji">{emoji}</span>
        <p className="itinerary-title">{title}</p>
      </div>
  <button className="edit-btn" onClick={onEdit}>Edit</button> {/* Triggers modal */}
  <button className="delete-btn" onClick={onDelete}>Delete</button>
    </div>
  );
};

export default ItineraryIcon;
