
import React, { useState } from 'react';
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
  
  const handleAddActivity = (newActivity) => {
    const updatedActivities = addActivity(activities, newActivity);
    setActivities(updatedActivities);
  };
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">🗺️</div>
          <div className="logo-text">Itinerate 👍</div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search Your Plans..." className="search-input" />
        </div>
        <div className="nav-buttons">
          <button className="nav-button social-btn">🔊 Social</button>
          <button className="nav-button profile-btn">👤</button>
        </div>
      </header>

      <main className="main-content">
        <div className="plan-header">
          <h1 className="plan-title">JAPAN 2025</h1>
          <div className="action-buttons">
            <button className="action-button edit-plan-btn">EDIT PLAN</button>
            <button className="action-button share-btn">Share With Others!</button>
            <button className="action-button checklist-btn">Checklist</button>
          </div>
        </div>

        <div className="timeline-section">
          <div className="timeline-header">
            <h2 className="timeline-title">TIMELINE</h2>
            <div className="timeline-date">1/1/25</div>
          </div>
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="item-bubble home-bubble">
                <div className="item-icon">🏠</div>
                <div className="item-title">Leave Home</div>
                <div className="cost">$0.00</div>
                <div className="time">1/1/25 3:05PM</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="item-bubble uber-bubble">
                <div className="item-icon">🚕</div>
                <div className="item-title">Uber To Airport</div>
                <div className="cost">$30.00</div>
                <div className="time">3:15PM</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="item-bubble airport-bubble">
                <div className="item-icon">🏢</div>
                <div className="item-title">Arrive At Airport</div>
              </div>
            </div>
          </div>
          <div className="add-button-container">
            <button className="add-activity-btn">+ Add Activity</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Itinerary;