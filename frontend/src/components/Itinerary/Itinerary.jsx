import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; 
import EventModal from "./EventModal";
import ShareModal from "./ShareModal";
import ChecklistModal from "./ChecklistModal";
import Navbar from "../Navbar/Navbar";
import { itineraryService, checklistService, shareService } from "../../services/api";
import useUserStore from "../../store/useUserStore";


const Itinerary = () => {
  const { id } = useParams();
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
  const [userPermission, setUserPermission] = useState(null);

  // Activities state
  const [activities, setActivities] = useState([]);
  const [groupedActivities, setGroupedActivities] = useState({});
  const [activeDates, setActiveDates] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const [isEditingImageUrl, setIsEditingImageUrl] = useState(false);

  // Helper function to check if user can edit
  const canEdit = userPermission === "write" || userPermission === "admin";
  
  // Helper function to check if user is admin
  const isAdmin = userPermission === "admin";

  

  // Get the current user
  // Improved getCurrentUser function for Itinerary.jsx
const getCurrentUser = () => {
  // Get the user from the useUserStore hook if available
  // This is the most reliable method since it's maintained by your app state
  const user = useUserStore.getState().user;
  if (user && (user.email || user.username)) {
    console.log("User identified from useUserStore:", user.email || user.username);
    return user.email || user.username;
  }
  
  // Try localStorage methods as fallback
  try {
    // Check for a user object in localStorage directly
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData && (userData.email || userData.username)) {
          console.log("User identified from localStorage user:", userData.email || userData.username);
          return userData.email || userData.username;
        }
      } catch (e) {
        console.error("Error parsing user JSON from localStorage:", e);
      }
    }
    
    // Check for a Firebase user object
    const firebaseUserStr = localStorage.getItem('firebaseUser');
    if (firebaseUserStr) {
      try {
        const firebaseUser = JSON.parse(firebaseUserStr);
        if (firebaseUser && (firebaseUser.email || firebaseUser.displayName)) {
          console.log("User identified from Firebase user:", firebaseUser.email || firebaseUser.displayName);
          return firebaseUser.email || firebaseUser.displayName;
        }
      } catch (e) {
        console.error("Error parsing Firebase user JSON:", e);
      }
    }
    
    // Check for individual username or email entries
    const username = localStorage.getItem('username');
    if (username) {
      console.log("User identified from localStorage username:", username);
      return username;
    }
    
    const email = localStorage.getItem('email');
    if (email) {
      console.log("User identified from localStorage email:", email);
      return email;
    }
    
    // If we couldn't identify the user from any of these methods,
    // log a warning and return a default value
    console.warn("Could not identify current user from any source");
    return 'unknown-user';
  } catch (err) {
    console.error("Error in getCurrentUser function:", err);
    return 'error-identifying-user';
  }
};

  // Load or create itinerary on component mount
  useEffect(() => {
    const loadItinerary = async () => {
      try {
        setLoading(true);

        // Get the itinerary by ID
        const itinerary = await itineraryService.getItinerary(id);
        setItineraryId(itinerary._id);
        setItineraryTitle(itinerary.title);
        setItineraryDescription(itinerary.description || "");
        setActivities(itinerary.activities || []);
        setImageUrl(itinerary.imageUrl || "");
        
        // Set admin permission by default for the creator
        const currentUser = getCurrentUser();
        if (itinerary.creator && itinerary.creator.username === currentUser) {
          setUserPermission("admin");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading itinerary:", err);
        setError("Failed to load itinerary data. Please try again.");
        setLoading(false);
      }
    };

    loadItinerary();
  }, [id]);

  // Check user permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (!itineraryId) return;
      
      try {
        // Get the current user
        const currentUser = getCurrentUser();
        console.log("Current user:", currentUser);
        
        if (!currentUser) {
          console.warn("No current user found, setting permission to no-access");
          setUserPermission("no-access");
          return;
        }
        
        // Get share settings
        const shareSettings = await shareService.getShareSettings(itineraryId);
        console.log("Share settings:", shareSettings);
        
        // Check if user is a collaborator
        const userCollaborator = shareSettings.collaborators.find(
          c => c.username === currentUser
        );
        console.log("User collaborator:", userCollaborator);
        
        if (userCollaborator) {
          // User is a collaborator, set permission from their role
          setUserPermission(userCollaborator.permission);
          console.log("Setting permission to:", userCollaborator.permission);
        } else if (shareSettings.isPublic) {
          // Public itinerary but not a collaborator = read-only
          setUserPermission("public-read");
          console.log("Setting permission to: public-read");
        } else {
          // Private itinerary and not a collaborator = no access
          setUserPermission("no-access");
          console.log("Setting permission to: no-access");
        }
      } catch (err) {
        console.error("Error checking permissions:", err);
        setError("Failed to verify access permissions");
      }
    };
    
    checkPermissions();
  }, [itineraryId]);

  // Save changes to title and description
  useEffect(() => {
    const saveItineraryDetails = async () => {
      if (!itineraryId || loading || !canEdit) return;

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

    const timeoutId = setTimeout(() => {
      saveItineraryDetails();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [itineraryId, itineraryTitle, itineraryDescription, loading, canEdit]);

  // Save activities whenever they change
  useEffect(() => {
    const saveActivities = async () => {
      if (!itineraryId || loading || !canEdit) return;

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

    const timeoutId = setTimeout(() => {
      saveActivities();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [itineraryId, activities, loading, canEdit]);

  // Parse and format dates for consistent comparison
  const formatDateForGrouping = useCallback((dateStr) => {
    if (!dateStr) return "Unknown Date";

    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }, []);

  // Helper function to convert time to minutes for sorting
  const timeToMinutes = useCallback((timeStr) => {
    if (!timeStr) return 0;

    let hours, minutes;

    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      const [timePart, period] = timeStr.split(" ");
      [hours, minutes] = timePart.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    } else {
      [hours, minutes] = timeStr.split(":").map(Number);
    }

    return hours * 60 + (minutes || 0);
  }, []);

  // Group activities by date and sort within each date
  useEffect(() => {
    const groups = {};
    activities.forEach((activity) => {
      const dateKey = formatDateForGrouping(activity.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    Object.keys(groups).forEach((date) => {
      groups[date].sort(
        (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
      );
    });

    const sortedDates = Object.keys(groups).sort((a, b) => {
      try {
        return new Date(a) - new Date(b);
      } catch {
        return 0;
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
      if (!itineraryId || loading || !canEdit) return;

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
  }, [itineraryId, itineraryTitle, itineraryDescription, imageUrl, loading, canEdit]);

  // Event handlers
  const handleActivityClick = (activity) => {
    setSelectedEvent({ ...activity });
    setEditMode(false);
    setShowEventModal(true);
  };

  const handleAddActivity = () => {
    if (!canEdit) return;
    
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
    if (!canEdit) return;
    
    e.stopPropagation();
    setSelectedEvent({ ...activity });
    setEditMode(true);
    setShowEventModal(true);
  };

  const handleUpdateActivity = (updatedActivity) => {
    if (!canEdit) return;
    
    const originalActivity = activities.find(
      (a) => a.id === updatedActivity.id
    );
    const hasDateChanged = originalActivity.date !== updatedActivity.date;
    const hasTimeChanged = originalActivity.time !== updatedActivity.time;

    const updatedActivities = activities.map((activity) =>
      activity.id === updatedActivity.id ? updatedActivity : activity
    );

    setActivities(updatedActivities);
    setShowEventModal(false);

    if (hasDateChanged || hasTimeChanged) {
      console.log(
        `Activity updated: Date changed: ${hasDateChanged}, Time changed: ${hasTimeChanged}`
      );
    }
  };

  const handleDeleteActivity = (activityId) => {
    if (!canEdit) return;
    
    const updatedActivities = activities.filter(
      (activity) => activity.id !== activityId
    );
    setActivities(updatedActivities);
    setShowEventModal(false);
  };

  const handleTitleClick = () => {
    if (!canEdit) return;
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
    // Call updateDashboard directly here to ensure title changes sync immediately
    if (window.updateDashboard) {
      setTimeout(() => window.updateDashboard(), 500); // Small delay to ensure API update completes
    }
  };

  const handleDescriptionClick = () => {
    if (!canEdit) return;
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

    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr;
    }

    const timeParts = timeStr.split(":");
    if (timeParts.length === 2) {
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const period = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      return `${hours}:${minutes} ${period}`;
    }

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
      const parts = dateStr.split(" ");
      if (parts.length >= 2) {
        return `${parts[0].substring(0, 3)} ${parts[1].replace(",", "")}`;
      }
      return "Jan 1";
    } catch (e) {
      return "Jan 1";
    }
  };

  // Function to add current user to share settings
  const addSelfAsCollaborator = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      console.log("Adding self as collaborator:", currentUser);
      
      // Get current share settings
      const shareSettings = await shareService.getShareSettings(itineraryId);
      
      // Check if already a collaborator
      const isAlreadyCollaborator = shareSettings.collaborators.some(
        c => c.username === currentUser
      );
      
      if (isAlreadyCollaborator) {
        console.log("Already a collaborator");
        return;
      }
      
      // Add self as admin
      const updatedCollaborators = [
        ...shareSettings.collaborators,
        {
          username: currentUser,
          permission: "admin",
        }
      ];
      
      // Save updated settings
      await shareService.saveShareSettings(itineraryId, {
        ...shareSettings,
        collaborators: updatedCollaborators,
      });
      
      console.log("Added self as admin collaborator");
      setUserPermission("admin");
      
    } catch (err) {
      console.error("Error adding self as collaborator:", err);
    }
  };

  // Add self as collaborator when itinerary is loaded
  useEffect(() => {
    if (itineraryId && userPermission === "no-access") {
      addSelfAsCollaborator();
    }
  }, [itineraryId, userPermission]);
  
  // Improved handleCopyItinerary function for Itinerary.jsx
const handleCopyItinerary = async () => {
  try {
    // Get current user information - prioritize useUserStore first
    let currentUser = null;
    
    // First try from useUserStore (most reliable if available)
    const userFromStore = useUserStore.getState().user;
    if (userFromStore && (userFromStore.email || userFromStore.username)) {
      currentUser = userFromStore.email || userFromStore.username;
      console.log("Creating copy with user from store:", currentUser);
    } else {
      // Fall back to the getCurrentUser helper function
      currentUser = getCurrentUser();
      console.log("Creating copy with user from getCurrentUser:", currentUser);
    }
    
    // Validate we have a valid user identifier
    if (!currentUser || currentUser === 'unknown-user' || currentUser === 'error-identifying-user' || currentUser === 'default-user') {
      console.error("Cannot create copy: Invalid user identity:", currentUser);
      alert("Cannot create a copy: Unable to identify your user account. Please try logging out and back in.");
      return;
    }
  
    // Set up the new itinerary data
    const itineraryCopy = {
      title: `Copy of ${itineraryTitle}`,
      description: itineraryDescription,
      activities: JSON.parse(JSON.stringify(activities)),
      imageUrl: imageUrl,
      creatorUsername: currentUser,
      creator: {
        username: currentUser,
        email: currentUser
      },
      collaborators: [{
        email: currentUser,
        username: currentUser,
        permission: "admin"
      }]
    };
    
    console.log("Creating itinerary copy with data:", itineraryCopy);
  
    // 1. Create the new itinerary
    const createdCopy = await itineraryService.createItinerary(itineraryCopy);
    console.log("Successfully created itinerary copy:", createdCopy);
  
    // 2. Set share settings with current user as admin collaborator
    const shareSettings = {
      isPublic: false,
      collaborators: [{
        email: currentUser,
        username: currentUser,
        permission: "admin"
      }]
    };
    
    console.log("Setting share settings:", shareSettings);
    await shareService.saveShareSettings(createdCopy._id, shareSettings);
    console.log("Successfully saved share settings");
  
    // 3. Refresh dashboard data if the function is available
    if (typeof window.updateDashboard === 'function') {
      console.log("Refreshing dashboard");
      await window.updateDashboard();
    } else {
      console.warn("window.updateDashboard function not available");
    }
  
    // 4. Redirect to the new itinerary
    console.log("Redirecting to new itinerary:", createdCopy._id);
    window.location.href = `/itinerary/${createdCopy._id}`;
  
  } catch (err) {
    console.error("Error creating itinerary copy:", err);
    alert("Failed to create a copy of the itinerary. Please try again.");
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

  // Show access denied if user doesn't have permission
  if (userPermission === "no-access") {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="error-container">
            <h2>Access Denied</h2>
            <p>You don't have permission to view this itinerary.</p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={addSelfAsCollaborator}
                className="action-button share-btn"
              >
                Add Self as Collaborator
              </button>
              <button
                onClick={() => {
                  // Override permission temporarily to allow share dialog to open
                  setUserPermission("admin");
                  setTimeout(() => setShowShareModal(true), 100);
                }}
                className="action-button share-btn"
                style={{ marginLeft: "10px" }}
              >
                Share Settings
              </button>
            </div>
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
              {canEdit && <span className="edit-icon-small">✏️</span>}
            </h1>
          )}

          <div className="action-buttons">
            {/* Only show Share button for admins */}
            {isAdmin && (
              <button
                className="action-button share-btn"
                onClick={() => setShowShareModal(true)}
              >
                Share
              </button>
            )}
            
            {/* Show Checklist for everyone (read-only or edit) */}
            <button
              className="action-button checklist-btn"
              onClick={() => setShowChecklistModal(true)}
            >
              Checklist
            </button>
            
            {/* Add Copy button for view-only users */}
            {(userPermission === "read" || userPermission === "public-read") && (
              <button
                className="action-button copy-btn"
                onClick={handleCopyItinerary}
                style={{ 
                  backgroundColor: "#4CAF50",
                  marginLeft: "10px"
                }}
              >
                Make My Copy
              </button>
            )}
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
              {canEdit && <span className="edit-icon-small">✏️</span>}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
          {isEditingImageUrl && canEdit ? (
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
              onClick={canEdit ? () => setIsEditingImageUrl(true) : undefined}
              style={{
                position: "relative",
                borderRadius: "0.75rem",
                overflow: "hidden",
                border: imageUrl ? "none" : "2px dashed #ccc",
                cursor: canEdit ? "pointer" : "default",
                backgroundColor: imageUrl ? "transparent" : "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                transition: "all 0.3s ease",
              }}
            >{imageUrl ? (
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
            ) : canEdit ? (
              <div style={{ textAlign: "center", color: "#999" }}>
                <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                  Click to add an image URL
                </p>
                <span style={{ fontSize: "1.5rem" }}>🖼️</span>
              </div>
            ) : null}
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
        <div className="duration">
          {formatDurationDisplay(activity.duration)}
        </div>
        <div className="cost">
          $
          {typeof activity.cost === "number"
            ? activity.cost.toFixed(2)
            : "0.00"}
        </div>
        {canEdit && (
          <div
            className="edit-icon"
            onClick={(e) => handleEditActivity(activity, e)}
          >
            ✏️
          </div>
        )}
      </div>
    </div>

    {/* Description on the right side */}
    <div className="timeline-right">
      <div className="event-description-container">
        {/* Activity title now above the location */}
        <h3 className="activity-title">{activity.title || "New Activity"}</h3>
        
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

        {canEdit && (
          <div className="add-button-container">
            <button className="add-activity-btn" onClick={handleAddActivity}>
              Add Activity
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Event Modal */}
    {showEventModal && selectedEvent && (
      <EventModal
        show={showEventModal}
        event={selectedEvent}
        onClose={() => setShowEventModal(false)}
        isEditMode={editMode && canEdit}
        onUpdate={handleUpdateActivity}
        onDelete={handleDeleteActivity}
        readOnly={!canEdit}
      />
    )}

    {/* Share Modal */}
    <ShareModal
      show={showShareModal}
      onClose={() => setShowShareModal(false)}
      itineraryTitle={itineraryTitle}
      itineraryId={itineraryId}
      onSave={(updatedSettings) => {
        // After saving share settings, check if user added themselves
        // and update their permission if needed
        const currentUser = getCurrentUser();
        const selfUser = updatedSettings.collaborators.find(
          c => c.username === currentUser
        );
        if (selfUser) {
          setUserPermission(selfUser.permission);
        }
      }}
    />

    {/* Checklist Modal */}
    <ChecklistModal
      show={showChecklistModal}
      onClose={() => setShowChecklistModal(false)}
      tripTitle={itineraryTitle}
      itineraryId={itineraryId}
      readOnly={!canEdit}
    />
  </div>
);
};

export default Itinerary;