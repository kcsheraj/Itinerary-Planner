import React, { useState } from "react";
import "./CreateItineraryModal.css";

const EMOJI_OPTIONS = [
  "🗺️", "✈️", "🏝️", "🏔️", "🏙️", "🚗", "🚆", "🚢", "🏕️", "🏖️", 
  "🗽", "🏰", "🌄", "🌅", "🌇", "🌉", "🌋", "🏞️", "🎢", "🏨"
];

const COLOR_OPTIONS = [
  { name: "Blue", value: "#E3F2FD", textColor: "#1565C0" },
  { name: "Green", value: "#E8F5E9", textColor: "#2E7D32" },
  { name: "Purple", value: "#F3E5F5", textColor: "#7B1FA2" },
  { name: "Pink", value: "#FCE4EC", textColor: "#C2185B" },
  { name: "Orange", value: "#FFF3E0", textColor: "#EF6C00" },
  { name: "Teal", value: "#E0F2F1", textColor: "#00796B" },
  { name: "Red", value: "#FFEBEE", textColor: "#C62828" },
  { name: "Yellow", value: "#FFFDE7", textColor: "#F9A825" }
];

const CreateItineraryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onSaveAndOpen,
  initialData = null
}) => {
  // Initialize state with initial data if provided (for editing)
  const [title, setTitle] = useState(initialData?.title || "New Itinerary");
  const [emoji, setEmoji] = useState(initialData?.emoji || "🗺️");
  const [color, setColor] = useState(initialData?.color || COLOR_OPTIONS[0].value);
  const [textColor, setTextColor] = useState(initialData?.textColor || COLOR_OPTIONS[0].textColor);

  if (!isOpen) return null;

  const handleEmojiSelect = (selectedEmoji) => {
    setEmoji(selectedEmoji);
  };

  const handleColorSelect = (colorObj) => {
    setColor(colorObj.value);
    setTextColor(colorObj.textColor);
  };

  const handleSubmit = (openAfterSave = false) => {
    const itineraryData = {
      title,
      emoji,
      color,
      textColor
    };
    
    if (openAfterSave) {
      onSaveAndOpen(itineraryData);
    } else {
      onSave(itineraryData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-itinerary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "Edit Itinerary" : "Create New Itinerary"}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Preview Section */}
          <div className="itinerary-preview" style={{ backgroundColor: color }}>
            <div className="preview-emoji">{emoji}</div>
            <div className="preview-title" style={{ color: textColor }}>{title}</div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="itinerary-title">Title:</label>
              <input 
                type="text" 
                id="itinerary-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="title-input"
              />
            </div>

            <div className="form-group">
              <label>Select Emoji:</label>
              <div className="emoji-selector">
                {EMOJI_OPTIONS.map((option) => (
                  <div 
                    key={option} 
                    className={`emoji-option ${emoji === option ? 'selected' : ''}`}
                    onClick={() => handleEmojiSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Select Color:</label>
              <div className="color-selector">
                {COLOR_OPTIONS.map((option) => (
                  <div 
                    key={option.name} 
                    className={`color-option ${color === option.value ? 'selected' : ''}`}
                    style={{ backgroundColor: option.value, color: option.textColor }}
                    onClick={() => handleColorSelect(option)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <div className="save-buttons">
            <button className="save-button" onClick={() => handleSubmit(false)}>
              Save
            </button>
            <button className="save-open-button" onClick={() => handleSubmit(true)}>
              Save & Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItineraryModal;