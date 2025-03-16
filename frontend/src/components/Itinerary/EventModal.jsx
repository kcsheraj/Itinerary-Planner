import React from 'react';
import './EventModal.css';

function EventModal({ show, event, onClose }) {
  if (!show) {
    return null;
  }

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
      return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-icon-container" style={{ backgroundColor: event.backgroundColor }}>
            <span className="modal-icon">{event.icon}</span>
          </div>
          <h2 className="modal-title">{event.title}</h2>
        </div>
        
        <div className="modal-content">
          <div className="info-section">
            <div className="info-row">
              <div className="info-label">Date:</div>
              <div className="info-value">{event.date || 'Jan 1, 2025'}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Start Time:</div>
              <div className="info-value">{format12HourTime(event.time)}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">End Time:</div>
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
          
          {event.address && (
            <div className="address-section">
              <h3>Location</h3>
              <p className="address">{event.address}</p>
              <div className="map-container">
                <iframe
                  title="Event Location"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(event.address)}`}
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
        
        <div className="modal-footer">
          <button className="edit-button">Edit Event</button>
          <button className="delete-button">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;