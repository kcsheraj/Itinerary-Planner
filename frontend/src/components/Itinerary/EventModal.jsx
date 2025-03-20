import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EventModal.css';

// Import place picker utilities
import { 
  loadGoogleMapsAPI, 
  initializeMap, 
  initPlacesAutocomplete, 
  updateMapWithPlace,
  geocodeAddress
} from './googleapiutil';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function EventModal({ show, event, onClose, isEditMode = false, onUpdate, onDelete }) {
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [previewMapVisible, setPreviewMapVisible] = useState(false);

  // State for edit form
  const [editForm, setEditForm] = useState({
    title: '',
    icon: '',
    time: '',
    duration: 60,
    cost: 0,
    date: new Date(),
    address: '',
    description: '',
    bubbleClass: ''
  });
  
  // Track local edit mode state
  const [editModeLocal, setEditModeLocal] = useState(isEditMode);
  
  // Initialize Google Maps and Places Autocomplete
  useEffect(() => {
    if (show && !mapLoaded) {
      loadGoogleMapsAPI(googleMapsApiKey, () => {
        setMapLoaded(true);
      });
    }
  }, [show, mapLoaded]);
  
  // Setup Google Places Autocomplete when map is loaded
  useEffect(() => {
    if (mapLoaded && addressInputRef.current && !autocompleteRef.current) {
      // Initialize the map if the element exists
      if (!mapRef.current && document.getElementById('preview-map')) {
        const { map, marker } = initializeMap(document.getElementById('preview-map'), {
          draggableMarker: true
        });
        
        mapRef.current = map;
        markerRef.current = marker;
        
        // Add marker drag event to update address
        if (marker) {
          marker.addListener('dragend', () => {
            const position = marker.getPosition();
            
            // Reverse geocode the position to get address
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setEditForm({
                  ...editForm,
                  address: results[0].formatted_address
                });
              }
            });
          });
        }
      }
      
      // Initialize Places Autocomplete
      autocompleteRef.current = initPlacesAutocomplete(addressInputRef.current);
      
      if (autocompleteRef.current) {
        // Listen for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
            return;
          }
          
          // Update map with place
          if (mapRef.current && markerRef.current) {
            updateMapWithPlace(mapRef.current, markerRef.current, place);
          }
          
          // Update form with selected address
          setEditForm({
            ...editForm,
            address: place.formatted_address
          });
          
          // Show the map preview
          setPreviewMapVisible(true);
        });
      }
    }
    
    // Cleanup
    return () => {
      autocompleteRef.current = null;
    };
  }, [mapLoaded, editForm]);

  // Update map when location changes
  useEffect(() => {
    if (mapLoaded && mapRef.current && editForm.address && event?.address !== editForm.address) {
      // Try to geocode the address to update the map
      geocodeAddress(editForm.address, (result, error) => {
        if (!error && result) {
          const location = result.geometry.location;
          mapRef.current.setCenter(location);
          markerRef.current.setPosition(location);
          mapRef.current.setZoom(16);
          setPreviewMapVisible(true);
        }
      });
    }
  }, [mapLoaded, editForm.address, event?.address]);

  // Initialize form with event data when the event changes
  useEffect(() => {
    if (event) {
      // Parse date string to Date object if needed
      let dateValue;
      if (event.date) {
        try {
          dateValue = new Date(event.date);
          if (isNaN(dateValue.getTime())) {
            // If invalid date, use current date
            dateValue = new Date();
          }
        } catch (e) {
          dateValue = new Date();
        }
      } else {
        dateValue = new Date();
      }

      setEditForm({
        id: event.id,
        title: event.title || '',
        icon: event.icon || '📍',
        time: event.time || '12:00',
        duration: event.duration || 60,
        cost: event.cost || 0,
        date: dateValue,
        address: event.address || '',
        description: event.description || '',
        bubbleClass: event.bubbleClass || 'airport-bubble'
      });
    }
  }, [event]);

  // Handle focus on address input
  const handleAddressFocus = () => {
    if (editForm.address && mapLoaded && mapRef.current) {
      setPreviewMapVisible(true);
    }
  };

  if (!show || !event) {
    return null;
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for cost and duration to ensure they're numbers
    if (name === 'cost' || name === 'duration') {
      const numValue = parseFloat(value);
      setEditForm({
        ...editForm,
        [name]: isNaN(numValue) ? 0 : numValue
      });
    } else if (name === 'address') {
      setEditForm({
        ...editForm,
        address: value
      });
      
      // Show map preview if there's a valid address
      if (value && value.length > 3) {
        setPreviewMapVisible(true);
      }
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  // Handle date change from DatePicker
  const handleDateChange = (date) => {
    setEditForm({
      ...editForm,
      date: date
    });
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    if (!date) return 'Not specified';
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let displayDate;
    
    if (date instanceof Date) {
      displayDate = date;
    } else {
      try {
        displayDate = new Date(date);
        if (isNaN(displayDate.getTime())) {
          return date; // Return as string if invalid date
        }
      } catch (e) {
        return date; // Return as string if parsing fails
      }
    }
    
    return `${months[displayDate.getMonth()]} ${displayDate.getDate()}, ${displayDate.getFullYear()}`;
  };

  // Handle icon selection
  const handleIconSelect = (icon) => {
    setEditForm({
      ...editForm,
      icon
    });
  };

  // Handle color selection
  const handleColorSelect = (bubbleClass) => {
    setEditForm({
      ...editForm,
      bubbleClass
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format date back to string format for API
    const formattedSubmission = {
      ...editForm,
      date: formatDateForDisplay(editForm.date)
    };
    
    onUpdate(formattedSubmission);
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  // Ensure time is in 12-hour format
  const format12HourTime = (timeStr) => {
    if (!timeStr) return 'Not specified';
    
    // If it's already in 12-hour format with AM/PM, return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr;
    }
    
    // Handle 24-hour format
    const timeParts = timeStr.split(':');
    if (timeParts.length === 2) {
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      return `${hours}:${minutes} ${period}`;
    }
    
    // If format is unexpected, return as is
    return timeStr;
  };

  // Format duration in a readable format
  const formatDuration = (minutes) => {
    if (!minutes) return 'Not specified';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Calculate end time if available (always returning in 12-hour format)
  const getEndTime = () => {
    if (!event.time || !event.duration) return 'Not specified';
    
    // Parse the start time
    const timeStr = event.time;
    let hours, minutes, period;
    
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      // 12-hour format
      const parts = timeStr.split(' ');
      period = parts[1];
      const timeParts = parts[0].split(':');
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
      
      // Convert to 24-hour for calculation
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    } else {
      // 24-hour format
      const timeParts = timeStr.split(':');
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }
    
    // Add duration
    const totalMinutes = hours * 60 + minutes + parseInt(event.duration, 10);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    // Convert back to 12-hour format
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const end12Hours = endHours % 12 || 12;
    
    return `${end12Hours}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
  };

  // Icons for selection
  const iconOptions = ["🏠", "🚕", "🏢", "✈️", "🏨", "🍽️", "🎭", "🏛️", "🛍️", "📍", "⛱️", "🏞️", "🚆", "🚇", "🚂", "⛵"];
  
  // Color options for events
  const colorOptions = [
    { name: "Blue", value: "airport-bubble", color: "#E3F2FD" },
    { name: "Green", value: "home-bubble", color: "#E8F5E9" },
    { name: "Red", value: "uber-bubble", color: "#FFEBEE" },
    { name: "Purple", value: "purple-bubble", color: "#EDE7F6" },
    { name: "Orange", value: "orange-bubble", color: "#FFF3E0" },
    { name: "Yellow", value: "yellow-bubble", color: "#FFFDE7" }
  ];

  // Helper function to get color by class name
  function getColorByClass(className) {
    const colorOption = colorOptions.find(opt => opt.value === className);
    return colorOption ? colorOption.color : "#E3F2FD"; // Default to blue if not found
  }

  // Render the edit form
  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-section">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editForm.title}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <div className="date-picker-container">
              <DatePicker
                selected={editForm.date}
                onChange={handleDateChange}
                dateFormat="MMM d, yyyy"
                className="form-control date-picker"
                id="date"
                wrapperClassName="date-picker-wrapper"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Start Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={editForm.time}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration (min)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={editForm.duration}
              onChange={handleInputChange}
              min="0"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cost">Cost ($)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={editForm.cost}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Location</label>
          <div className="address-autocomplete-container">
            <input
              type="text"
              id="address"
              name="address"
              value={editForm.address}
              onChange={handleInputChange}
              onFocus={handleAddressFocus}
              className="form-control"
              placeholder="Enter address"
              autoComplete="off"
              ref={addressInputRef}
            />
            {previewMapVisible && mapLoaded && (
              <div className="address-map-preview">
                <div id="preview-map" className="preview-map"></div>
                <div className="preview-map-instructions">Drag marker to adjust location</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={editForm.description}
            onChange={handleInputChange}
            className="form-control"
            rows="2"
            placeholder="Add details about this event"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Icon</label>
            <div className="icon-picker">
              {iconOptions.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  className={`icon-option ${editForm.icon === icon ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {colorOptions.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  className={`color-option ${editForm.bubbleClass === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => handleColorSelect(color.value)}
                  title={color.name}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="edit-form-footer">
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="delete-button" onClick={handleDelete}>
          Delete
        </button>
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );

  // Render the view mode
  const renderViewMode = () => (
    <div className="view-mode-container">
      <div className="modal-header">
        <div className="modal-icon-container" style={{ backgroundColor: getColorByClass(event.bubbleClass) }}>
          <span className="modal-icon">{event.icon}</span>
        </div>
        <h2 className="modal-title">{event.title}</h2>
      </div>
      
      <div className="modal-content">
        <div className="event-details-layout">
          <div className="event-details-left">
            <div className="info-section">
              <div className="info-row">
                <div className="info-label">Date:</div>
                <div className="info-value">{event.date || 'Jan 1, 2025'}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Start:</div>
                <div className="info-value">{format12HourTime(event.time)}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">End:</div>
                <div className="info-value">{getEndTime()}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Duration:</div>
                <div className="info-value">{formatDuration(event.duration)}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Cost:</div>
                <div className="info-value">{typeof event.cost === 'number' 
                  ? `$${event.cost.toFixed(2)}` 
                  : event.cost || '$0.00'}</div>
              </div>
            </div>
          </div>
          
          <div className="event-details-right">
            {event.address && (
              <div className="address-section">
                <h3>Location</h3>
                <p className="address">{event.address}</p>
                <div className="map-container">
                  <iframe
                    title="Event Location"
                    width="100%"
                    height="160"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(event.address)}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {event.description && (
              <div className="description-section">
                <h3>Description</h3>
                <p className="description">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        <button className="delete-button" onClick={handleDelete}>Delete</button>
        <button className="edit-button" onClick={() => setEditModeLocal(true)}>Edit</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {editModeLocal ? renderEditForm() : renderViewMode()}
      </div>
    </div>
  );
}

export default EventModal;