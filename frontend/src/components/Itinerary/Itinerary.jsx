import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; // Import useParams hoo
import EventModal from "./EventModal";
import ShareModal from "./ShareModal";
import ChecklistModal from "./ChecklistModal";
import Navbar from "../Navbar/Navbar";
import { itineraryService, checklistService } from "../../services/api";

const Itinerary = () => {
  const { id } = useParams(); // Use useParams to get the `id` from the URL
  // State for the itinerary data
  const [itineraryId, setItineraryId] = useState(null);
  const [itineraryTitle, setItineraryTitle] = useState("My Itinerary");
  const [itineraryDescription, setItineraryDescription] = useState(
    "Description of the trip"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Activities state
  const [activities, setActivities] = useState([]);
  const [groupedActivities, setGroupedActivities] = useState({});
  const [activeDates, setActiveDates] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const [isEditingImageUrl, setIsEditingImageUrl] = useState(false);

  // Load or create itinerary on component mount
  useEffect(() => {
    const loadItinerary = async () => {
      try {
        setLoading(true);

        // Use the first itinerary if any exist
        const itinerary = await itineraryService.getItinerary(id);
        setItineraryId(itinerary._id);
        setItineraryTitle(itinerary.title);
        setItineraryDescription(itinerary.description || "");
        setActivities(itinerary.activities || []);
        console.log("Loaded itinerary:", itinerary);

        setImageUrl(itinerary.imageUrl || "");

        setLoading(false);
      } catch (err) {
        console.error("Error loading itinerary:", err);
        setError("Failed to load itinerary data. Please try again.");
        setLoading(false);
      }
    };

    loadItinerary();
  }, []);

  // Save changes to title and description
  useEffect(() => {
    const saveItineraryDetails = async () => {
      if (!itineraryId || loading) return; // Skip if we don't have an ID yet or still loading

      try {
        await itineraryService.updateItinerary(itineraryId, {
          title: itineraryTitle,
          description: itineraryDescription,
        });
        console.log("Saved itinerary details");
      } catch (err) {
        console.error("Error saving itinerary details:", err);
        setError("Failed to save changes to title/description");
      }
    };

    // Use a debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      saveItineraryDetails();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [itineraryId, itineraryTitle, itineraryDescription, loading]);

  // Save activities whenever they change
  useEffect(() => {
    const saveActivities = async () => {
      if (!itineraryId || loading) return; // Skip if we don't have an ID yet or still loading

      try {
        await itineraryService.updateItinerary(itineraryId, {
          activities: activities,
        });
        console.log("Saved activities");
      } catch (err) {
        console.error("Error saving activities:", err);
        setError("Failed to save changes to activities");
      }
    };

    // Use a debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      saveActivities();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [itineraryId, activities, loading]);

  // Parse and format dates for consistent comparison
  const formatDateForGrouping = useCallback((dateStr) => {
    if (!dateStr) return "Unknown Date";

    try {
      // Try to parse the date
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Return a consistent format for grouping
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateStr; // If parsing fails, use the original string
    } catch (e) {
      return dateStr;
    }
  }, []);

  // Helper function to convert time to minutes for sorting
  const timeToMinutes = useCallback((timeStr) => {
    if (!timeStr) return 0;

    let hours, minutes;

    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      // Handle 12-hour format
      const [timePart, period] = timeStr.split(" ");
      [hours, minutes] = timePart.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    } else {
      // Handle 24-hour format
      [hours, minutes] = timeStr.split(":").map(Number);
    }

    return hours * 60 + (minutes || 0);
  }, []);

  // Group activities by date and sort within each date
  useEffect(() => {
    // Group by date
    const groups = {};
    activities.forEach((activity) => {
      const dateKey = formatDateForGrouping(activity.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    // Sort activities within each date group by time
    Object.keys(groups).forEach((date) => {
      groups[date].sort(
        (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
      );
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(groups).sort((a, b) => {
      try {
        return new Date(a) - new Date(b);
      } catch {
        return 0; // If date parsing fails, keep original order
      }
    });

    setGroupedActivities(groups);
    setActiveDates(sortedDates);
  }, [activities, formatDateForGrouping, timeToMinutes]);

  // Calculate total cost whenever activities change
  useEffect(() => {
    const total = activities.reduce((sum, activity) => {
      const cost =
        typeof activity.cost === "number"
          ? activity.cost
          : typeof activity.cost === "string"
          ? parseFloat(activity.cost.replace("$", "")) || 0
          : 0;
      return sum + cost;
    }, 0);

    setTotalCost(total);
  }, [activities]);

  useEffect(() => {
    const saveItineraryDetails = async () => {
      if (!itineraryId || loading) return;

      try {
        await itineraryService.updateItinerary(itineraryId, {
          title: itineraryTitle,
          description: itineraryDescription,
          imageUrl: imageUrl,
        });
        console.log("Saved itinerary details");
      } catch (err) {
        console.error("Error saving itinerary details:", err);
        setError("Failed to save changes to title/description/image");
      }
    };

    const timeoutId = setTimeout(saveItineraryDetails, 1000);
    return () => clearTimeout(timeoutId);
  }, [itineraryId, itineraryTitle, itineraryDescription, imageUrl, loading]);

  // Event handlers
  const handleActivityClick = (activity) => {
    setSelectedEvent({ ...activity });
    setEditMode(false);
    setShowEventModal(true);
  };

  const handleAddActivity = () => {
    const newActivity = {
      id: `act${Date.now()}`,
      title: "New Activity",
      icon: "📍",
      time: "12:00",
      duration: 60,
      cost: 0,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      backgroundColor: "#E3F2FD",
      bubbleClass: "airport-bubble",
      address: "Location to be specified",
      description: "Description to be added",
    };

    setActivities([...activities, newActivity]);
    setSelectedEvent({ ...newActivity });
    setEditMode(true);
    setShowEventModal(true);
  };

  const handleEditActivity = (activity, e) => {
    e.stopPropagation();
    setSelectedEvent({ ...activity }); // Create a copy to avoid reference issues
    setEditMode(true);
    setShowEventModal(true);
  };

  const handleUpdateActivity = (updatedActivity) => {
    // First, check if the date or time has changed
    const originalActivity = activities.find(
      (a) => a.id === updatedActivity.id
    );
    const hasDateChanged = originalActivity.date !== updatedActivity.date;
    const hasTimeChanged = originalActivity.time !== updatedActivity.time;

    // Update the activity in the list
    const updatedActivities = activities.map((activity) =>
      activity.id === updatedActivity.id ? updatedActivity : activity
    );

    setActivities(updatedActivities);
    setShowEventModal(false);

    // If we need to check the result of the update
    if (hasDateChanged || hasTimeChanged) {
      console.log(
        `Activity updated: Date changed: ${hasDateChanged}, Time changed: ${hasTimeChanged}`
      );
    }
  };

  const handleDeleteActivity = (activityId) => {
    const updatedActivities = activities.filter(
      (activity) => activity.id !== activityId
    );
    setActivities(updatedActivities);
    setShowEventModal(false);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = (e) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
    }
  };

  const handleTitleChange = (e) => {
    setItineraryTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (e) => {
    setItineraryDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
  };

  // Format time display (12-hour format)
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return "12:00 PM";

    // If it's already in 12-hour format with AM/PM, return as is
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr;
    }

    // Handle 24-hour format
    const timeParts = timeStr.split(":");
    if (timeParts.length === 2) {
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const period = hours >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12

      return `${hours}:${minutes} ${period}`;
    }

    // If format is unexpected, return as is
    return timeStr;
  };

  // Format duration display
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

  // Format date display for the day label
  const formatDateDay = (dateStr) => {
    if (!dateStr) return "Jan 1";

    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      // If it's already in "Month Day" format, try to parse it
      const parts = dateStr.split(" ");
      if (parts.length >= 2) {
        return `${parts[0].substring(0, 3)} ${parts[1].replace(",", "")}`;
      }
      return "Jan 1"; // Default fallback
    } catch (e) {
      return "Jan 1"; // Default fallback
    }
  };

  // Show loading indicator
  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="loading-container">
            <p>Loading your itinerary...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="error-container">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="action-button share-btn"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {/* Header with editable title */}
        <div className="plan-header">
          {isEditingTitle ? (
            <input
              type="text"
              value={itineraryTitle}
              onChange={handleTitleChange}
              onKeyPress={handleTitleSave}
              onBlur={handleTitleBlur}
              className="editable-title-input"
              autoFocus
            />
          ) : (
            <h1 className="plan-title" onClick={handleTitleClick}>
              {itineraryTitle}
              <span className="edit-icon-small">✏️</span>
            </h1>
          )}

          <div className="action-buttons">
            <button
              className="action-button share-btn"
              onClick={() => setShowShareModal(true)}
            >
              Share
            </button>
            <button
              className="action-button checklist-btn"
              onClick={() => setShowChecklistModal(true)}
            >
              Checklist
            </button>
          </div>
        </div>

        {/* Itinerary Description */}
        <div className="itinerary-description-container">
          {isEditingDescription ? (
            <textarea
              value={itineraryDescription}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              className="description-textarea"
              rows={2}
              autoFocus
            />
          ) : (
            <p
              className="itinerary-description"
              onClick={handleDescriptionClick}
            >
              {itineraryDescription}
              <span className="edit-icon-small">✏️</span>
            </p>
          )}
        </div>

        {/* Image URL */}
        <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
          {isEditingImageUrl ? (
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onBlur={() => setIsEditingImageUrl(false)}
                placeholder="Paste an image URL (e.g. https://...)"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  fontSize: "1rem",
                }}
                autoFocus
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditingImageUrl(true)}
              style={{
                position: "relative",
                borderRadius: "0.75rem",
                overflow: "hidden",
                border: imageUrl ? "none" : "2px dashed #ccc",
                cursor: "pointer",
                backgroundColor: imageUrl ? "transparent" : "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                transition: "all 0.3s ease",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Itinerary Cover"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#999" }}>
                  <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                    Click to add an image URL
                  </p>
                  <span style={{ fontSize: "1.5rem" }}>🖼️</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <div className="cost-summary">
          <div className="cost-summary-content">
            <h3>Total Trip Cost</h3>
            <div className="total-cost-value">${totalCost.toFixed(2)}</div>
          </div>
        </div>

        {/* Timeline Section with Compact Layout */}
        <div className="timeline-section">
          <div className="timeline-header">
            <h2>TIMELINE</h2>
            <div>
              {activeDates.length > 0 ? formatDateDay(activeDates[0]) : "Jan 1"}
            </div>
          </div>

          <div className="timeline-container">
            {activeDates.map((dateKey) => (
              <div key={dateKey} className="date-group">
                <div className="date-divider">
                  <div className="date-label-text">{dateKey}</div>
                </div>

                {groupedActivities[dateKey].map((activity, activityIndex) => (
                  <div className="timeline-item compact-view" key={activity.id}>
                    <div className="timeline-left">
                      <div className="date-label">
                        <div className="date-time">
                          {formatTimeDisplay(activity.time)}
                        </div>
                        <div className="date-day">
                          {formatDateDay(activity.date)}
                        </div>
                      </div>
                      <div
                        className={`item-bubble ${activity.bubbleClass}`}
                        onClick={() => handleActivityClick(activity)}
                      >
                        <span className="item-icon">{activity.icon}</span>
                        <div className="item-title">{activity.title}</div>
                        <div className="duration">
                          {formatDurationDisplay(activity.duration)}
                        </div>
                        <div className="cost">
                          $
                          {typeof activity.cost === "number"
                            ? activity.cost.toFixed(2)
                            : "0.00"}
                        </div>
                        <div
                          className="edit-icon"
                          onClick={(e) => handleEditActivity(activity, e)}
                        >
                          ✏️
                        </div>
                      </div>
                    </div>

                    {/* Description on the right side */}
                    <div className="timeline-right">
                      <div className="event-description-container">
                        {activity.address && (
                          <div className="event-address">
                            {activity.address}
                          </div>
                        )}
                        {activity.description && (
                          <div className="event-description">
                            {activity.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="add-button-container">
            <button className="add-activity-btn" onClick={handleAddActivity}>
              Add Activity
            </button>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <EventModal
          show={showEventModal}
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          isEditMode={editMode}
          onUpdate={handleUpdateActivity}
          onDelete={handleDeleteActivity}
        />
      )}

      {/* Share Modal */}
      {/* Share Modal */}
      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        itineraryTitle={itineraryTitle}
        itineraryId={itineraryId}
      />

      {/* Checklist Modal */}
      <ChecklistModal
        show={showChecklistModal}
        onClose={() => setShowChecklistModal(false)}
        tripTitle={itineraryTitle}
        itineraryId={itineraryId}
      />
    </div>
  );
};

export default Itinerary;
