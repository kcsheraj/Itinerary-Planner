import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItineraryIcon.css"; // Ensure styles are available

const ItineraryIcon = ({ id, initialEmoji, initialTitle, onDelete }) => {
  const [emoji, setEmoji] = useState(initialEmoji);
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isEditing) {
      navigate(`/itinerary/${id}`); // Navigate to itinerary details
    }
  };

  return (
    <div className="itinerary-card">
      {isEditing ? (
        <>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="itinerary-emoji-input"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="itinerary-title-input"
          />
          <button className="save-btn" onClick={() => setIsEditing(false)}>
            Save
          </button>
          <button className="delete-btn" onClick={onDelete}>
            Delete
          </button>
        </>
      ) : (
        <>
          <div className="itinerary-display" onClick={handleClick}>
            <span className="itinerary-emoji">{emoji}</span>
            <p className="itinerary-title">{title}</p>
          </div>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default ItineraryIcon;
