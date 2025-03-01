import React, { useState, useEffect } from 'react';
import './Itinerary.css';
import Navbar from "../Navbar/Navbar";
import EventModal from './EventModal';
import ShareModal from './ShareModal';
import { 
  formatCurrency, 
  formatTime, 
  calculateDuration,
  sampleItineraryData,
  addActivity,
  removeActivity,
  updateActivity,
  calculateTotalCost
} from './ItineraryUtils';

function Itinerary() {
  const [itinerary, setItinerary] = useState(sampleItineraryData);
  const [activities, setActivities] = useState(sampleItineraryData.activities);
  const [totalCost, setTotalCost] = useState(0);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Calculate total cost whenever activities change
  useEffect(() => {
    const costs = activities.map(activity => {
      // Parse the cost string to a number, handling dollar sign
      const costValue = parseFloat(activity.cost?.toString().replace('$', '')) || 0;
      return costValue;
    });
    
    const total = costs.reduce((sum, cost) => sum + cost, 0);
    setTotalCost(total);
  }, [activities]);

  // Format time properly (handle 24h format conversion to 12h format)
  const formatTimeDisplay = (timeStr) => {
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

  const handleAddActivity = (newActivity) => {
    const updatedActivities = addActivity(activities, newActivity);
    setActivities(updatedActivities);
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleShareButtonClick = () => {
    setShowShareModal(true);
  };
  
  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };
  
  const closeShareModal = () => {
    setShowShareModal(false);
  };
  
  // Format duration display for the timeline item
  const formatDurationDisplay = (minutes) => {
    if (!minutes) return "";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };
  
  // Sample enhanced activities with more details
  const enhancedActivities = activities.map(activity => {
    // Add placeholder data for demonstration purposes
    return {
      ...activity,
      date: "January 1, 2025",
      duration: activity.duration || (
        activity.title === "Leave Home" ? 30 : 
        activity.title === "Uber To Airport" ? 45 : 
        activity.title === "Arrive At Airport" ? 120 : 
        60  // Default duration
      ),
      address: activity.address || (
        activity.title === "Leave Home" ? "123 Home Street, Hometown" :
        activity.title === "Uber To Airport" ? "Route to SFO Airport" : 
        activity.title === "Arrive At Airport" ? "San Francisco International Airport, CA" : 
        "Location not specified"
      ),
      description: activity.description || (
        activity.title === "Leave Home" ? "Depart from home with all luggage and travel documents." :
        activity.title === "Uber To Airport" ? "Uber ride to the airport. Estimated travel time: 45 minutes." : 
        activity.title === "Arrive At Airport" ? "Arrive at SFO Terminal 2. Check-in at Japan Airlines counter 3 hours before departure." : 
        "No additional details available."
      )
    };
  });
  
  return (
    <div className="app-container">
      {/* Replace the old header with the Navbar component */}
      <Navbar />

      <main className="main-content">
        <div className="plan-header">
          <h1 className="plan-title">JAPAN 2025</h1>
          <div className="action-buttons">
            <button className="action-button edit-plan-btn">EDIT PLAN</button>
            <button 
              className="action-button share-btn"
              onClick={handleShareButtonClick}
            >
              Share With Others!
            </button>
            <button className="action-button checklist-btn">Checklist</button>
          </div>
        </div>

        {/* Total Cost Summary */}
        <div className="cost-summary">
          <div className="cost-summary-content">
            <h3>Total Trip Cost</h3>
            <div className="total-cost-value">${totalCost.toFixed(2)}</div>
          </div>
        </div>

        <div className="timeline-section">
          <div className="timeline-header">
            <h2>TIMELINE</h2>
            <div>1/1/25</div>
          </div>
          
          <div className="timeline-container">
            {enhancedActivities.map((activity, index) => (
              <div className="timeline-item" key={index}>
                <div 
                  className="date-label"
                  onClick={() => handleEventClick(activity)}
                >
                  <div className="date-time">
                    {formatTimeDisplay(activity.time || "3:05")}
                  </div>
                  <div className="date-day">Jan 1</div>
                </div>
                <div 
                  className={`item-bubble ${activity.bubbleClass || "home-bubble"}`} 
                  style={activity.backgroundColor ? {backgroundColor: activity.backgroundColor} : {}}
                  onClick={() => handleEventClick(activity)}
                >
                  <span className="item-icon">{activity.icon}</span>
                  <div className="item-title">{activity.title}</div>
                  <div className="duration">{formatDurationDisplay(activity.duration)}</div>
                  <div className="cost">
                    {typeof activity.cost === 'number' 
                      ? `$${activity.cost.toFixed(2)}` 
                      : activity.cost || '$0.00'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="add-button-container">
            <button className="add-activity-btn" onClick={() => handleAddActivity({
              title: "New Activity",
              icon: "📍",
              time: "4:30",
              duration: 60,
              cost: 0,
              backgroundColor: "#E3F2FD"
            })}>+ Add Activity</button>
          </div>
        </div>
      </main>
      
      {/* Event Detail Modal */}
      <EventModal 
        show={showEventModal} 
        event={selectedEvent} 
        onClose={closeEventModal} 
      />
      
      {/* Share Modal */}
      <ShareModal 
        show={showShareModal}
        onClose={closeShareModal}
        itineraryTitle="JAPAN 2025"
      />
    </div>
  );
}

export default Itinerary;