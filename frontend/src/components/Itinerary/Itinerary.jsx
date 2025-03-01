import React, { useState, useEffect } from 'react';
import './Itinerary.css';
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
  
  return (
    <div className="app-container">
      <div className="header-wrapper">
        <header className="header">
          <div className="logo-container">
            <img src="/Itinerate.png" alt="Itinerate" className="logo-image" />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search Your Plans..." className="search-input" />
            <button className="search-button">🔍</button>
          </div>
          <div className="nav-buttons">
            <button className="nav-button dashboard-btn">📊 Dashboard</button>
            <button className="nav-button favorites-btn">⭐ Favorites</button>
            <button className="nav-button social-btn">🔊 Social</button>
            <button className="nav-button profile-btn">👤</button>
          </div>
        </header>
      </div>

      <main className="main-content">
        <div className="plan-header">
          <h1 className="plan-title">JAPAN 2025</h1>
          <div className="action-buttons">
            <button className="action-button edit-plan-btn">EDIT PLAN</button>
            <button className="action-button share-btn">Share With Others!</button>
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
            {activities.map((activity, index) => (
              <div className="timeline-item" key={index}>
                <div className="date-label">
                  <div className="date-time">
                    {formatTimeDisplay(activity.time || "3:05")}
                  </div>
                  <div className="date-day">Jan 1</div>
                </div>
                <div className={`item-bubble ${activity.bubbleClass || "home-bubble"}`} 
                    style={activity.backgroundColor ? {backgroundColor: activity.backgroundColor} : {}}>
                  <span className="item-icon">{activity.icon}</span>
                  <div className="item-title">{activity.title}</div>
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
              cost: 0,
              backgroundColor: "#E3F2FD"
            })}>+ Add Activity</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Itinerary;