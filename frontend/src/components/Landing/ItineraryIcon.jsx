import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { itineraryService } from "../../services/api";

const ItineraryIcon = ({ 
  id, 
  initialEmoji = "🗺️", 
  initialTitle = "Untitled Trip",
  backgroundColor = "#E3F2FD", 
  textColor = "#1565C0", 
  onDelete,
  onEdit 
}) => {
  const [emoji, setEmoji] = useState(initialEmoji);
  const [title, setTitle] = useState(initialTitle);
  const [bgColor, setBgColor] = useState(backgroundColor);
  const [txtColor, setTxtColor] = useState(textColor);
  
  console.log("ItineraryIcon initial props:", {
    id,
    initialEmoji,
    initialTitle,
    backgroundColor,
    textColor
  });
  
  // Fetch the latest itinerary data to ensure all fields are up to date
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const itinerary = await itineraryService.getItinerary(id);
        if (itinerary) {
          console.log("Fetched itinerary data:", itinerary);
          setTitle(itinerary.title || initialTitle);
          setEmoji(itinerary.emoji || initialEmoji);
          setBgColor(itinerary.color || backgroundColor);
          setTxtColor(itinerary.textColor || textColor);
        }
      } catch (error) {
        console.error("Error fetching latest itinerary data:", error);
      }
    };
    
    fetchLatestData();
  }, [id, initialTitle, initialEmoji, backgroundColor, textColor]);
  
  // Update state whenever props change
  useEffect(() => {
    if (initialTitle !== title) setTitle(initialTitle);
    if (initialEmoji !== emoji) setEmoji(initialEmoji);
    if (backgroundColor !== bgColor) setBgColor(backgroundColor);
    if (textColor !== txtColor) setTxtColor(textColor);
  }, [initialTitle, initialEmoji, backgroundColor, textColor, title, emoji, bgColor, txtColor]);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Link
      to={`/itinerary/${id}`}
      className="block relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
      style={{ textDecoration: 'none' }}
    >
      <div 
        className="emoji-header p-4 flex justify-center items-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="p-4">
        <h3 
          className="text-lg font-semibold truncate"
          style={{ color: txtColor }}
        >
          {title}
        </h3>
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full opacity-80 hover:opacity-100"
      >
        ×
      </button>
    </Link>
  );
};

export default ItineraryIcon;