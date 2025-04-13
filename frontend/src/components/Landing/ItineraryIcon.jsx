<<<<<<< HEAD
const ItineraryIcon = ({ emoji, title, onClick, onEdit }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md px-6 py-4 cursor-pointer relative group transition duration-200 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Edit Button (top-right) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevents triggering onClick for the whole card
          onEdit();
        }}
        className="absolute top-2 right-2 text-sm text-green-700 hover:text-green-900 opacity-0 group-hover:opacity-100 transition"
        title="Edit"
      >
        ✏️
      </button>

      <div className="text-4xl mb-2">{emoji || "📍"}</div>
      <div className="font-medium text-green-800">{title}</div>
=======
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
>>>>>>> origin/development
    </div>
  );
};

export default ItineraryIcon;
