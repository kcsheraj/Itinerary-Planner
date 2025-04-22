// Dashboard.jsx with Create Itinerary Modal and decorative elements
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import Navbar from "../Navbar/Navbar";
import ItineraryIcon from "./ItineraryIcon";
import CreateItineraryModal from "./CreateItineraryModal";
import { itineraryService, shareService } from "../../services/api";
import useUserStore from "../../store/useUserStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  
  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState(null);

  // Create a function to fetch itineraries that can be called from anywhere
  const fetchItineraries = useCallback(async () => {
    try {
      if (!user || !user.email) return;
      setLoading(true);

      // Get both created and shared itineraries
      const myItineraries = await itineraryService.getItineraries();
      const sharedWithMe = await itineraryService.getUserItineraries(user.email);
      
      // Combine both lists (avoiding duplicates)
      const allItineraries = [...myItineraries];
      
      sharedWithMe.forEach(shared => {
        if (!allItineraries.some(existing => existing._id === shared._id)) {
          allItineraries.push(shared);
        }
      });
      
      console.log("All fetched itineraries:", allItineraries);
      
      // Filter for only itineraries where user has edit permissions
      const editableItineraries = [];
      
      for (const itinerary of allItineraries) {
        try {
          // Check share settings
          const shareSettings = await shareService.getShareSettings(itinerary._id);
          
          // Check if user has "write" or "admin" permission
          const userCollaborator = shareSettings.collaborators.find(
            c => c.username === user.email
          );
          
          const hasEditPermission = userCollaborator && 
              (userCollaborator.permission === "admin" || 
               userCollaborator.permission === "write");
          
          // If user can edit, add to the list
          if (hasEditPermission) {
            editableItineraries.push(itinerary);
          }
        } catch (error) {
          console.error(`Error checking permissions for itinerary ${itinerary._id}:`, error);
        }
      }
      
      console.log("Editable itineraries:", editableItineraries);
      setItineraries(editableItineraries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setLoading(false);
    }
  }, [user]);

  // Expose the fetchItineraries function globally
  useEffect(() => {
    window.updateDashboard = fetchItineraries;
    
    return () => {
      delete window.updateDashboard;
    };
  }, [fetchItineraries]);

  // Fetch itineraries when component mounts
  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const handleNewItinerary = () => {
    setCurrentItinerary(null);
    setCreateModalOpen(true);
  };

  const handleEditItinerary = (itinerary) => {
    setCurrentItinerary(itinerary);
    setEditModalOpen(true);
  };

  const handleCreateItinerary = async (itineraryData) => {
    try {
      if (!user?.email) {
        console.error("No user email available");
        return;
      }
  
      const newItinerary = {
        title: itineraryData.title,
        description: "Description of the new itinerary",
        activities: [],
        emoji: itineraryData.emoji,
        color: itineraryData.color,
        textColor: itineraryData.textColor,
        creatorUsername: user.email,
        creator: {
          username: user.email,
          email: user.email
        },
        collaborators: [{
          email: user.email,
          username: user.email,
          permission: "admin"
        }]
      };
  
      // 1. Create the itinerary
      const createdItinerary = await itineraryService.createItinerary(newItinerary);
      console.log("Successfully created itinerary:", createdItinerary);
  
      // 2. Set share settings with user as admin collaborator
      await shareService.saveShareSettings(createdItinerary._id, {
        isPublic: false,
        collaborators: [{
          email: user.email,
          username: user.email,
          permission: "admin"
        }]
      });
  
      // 3. Update local state and close modal
      setItineraries((prev) => [...prev, {
        ...createdItinerary,
        emoji: itineraryData.emoji,
        color: itineraryData.color,
        textColor: itineraryData.textColor
      }]);
      setCreateModalOpen(false);
  
    } catch (error) {
      console.error("Error creating itinerary:", error);
      alert("Failed to create itinerary. Please check console for details.");
    }
  };

  const handleCreateAndOpenItinerary = async (itineraryData) => {
    try {
      if (!user?.email) {
        console.error("No user email available");
        return;
      }
  
      const newItinerary = {
        title: itineraryData.title,
        description: "Description of the new itinerary",
        activities: [],
        emoji: itineraryData.emoji,
        color: itineraryData.color,
        textColor: itineraryData.textColor,
        creatorUsername: user.email,
        creator: {
          username: user.email,
          email: user.email
        },
        collaborators: [{
          email: user.email,
          username: user.email,
          permission: "admin"
        }]
      };
  
      // 1. Create the itinerary
      const createdItinerary = await itineraryService.createItinerary(newItinerary);
  
      // 2. Set share settings with user as admin collaborator
      await shareService.saveShareSettings(createdItinerary._id, {
        isPublic: false,
        collaborators: [{
          email: user.email,
          username: user.email,
          permission: "admin"
        }]
      });
  
      // 3. Close modal and navigate to the new itinerary
      setCreateModalOpen(false);
      navigate(`/itinerary/${createdItinerary._id}`);
  
    } catch (error) {
      console.error("Error creating itinerary:", error);
      alert("Failed to create itinerary. Please check console for details.");
    }
  };

  const handleUpdateItinerary = async (itineraryData) => {
    try {
      if (!currentItinerary || !currentItinerary._id) {
        console.error("No itinerary selected for update");
        return;
      }
      
      console.log("Updating itinerary with data:", itineraryData);
  
      // 1. Update the itinerary
      const updateData = {
        title: itineraryData.title,
        emoji: itineraryData.emoji,
        color: itineraryData.color,
        textColor: itineraryData.textColor
      };
      
      const response = await itineraryService.updateItinerary(
        currentItinerary._id, 
        updateData
      );
      
      console.log("Update response:", response);
  
      // 2. Update local state and close modal
      setItineraries((prev) => 
        prev.map(item => 
          item._id === currentItinerary._id 
            ? {...item, ...updateData} 
            : item
        )
      );
      
      setEditModalOpen(false);
      setCurrentItinerary(null);
  
    } catch (error) {
      console.error("Error updating itinerary:", error);
      alert("Failed to update itinerary. Please check console for details.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (!confirmed) return;

    try {
      await itineraryService.deleteItinerary(id);
      setItineraries(itineraries.filter((trip) => trip._id !== id));
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  return (
    <div className="dashboard-container relative overflow-hidden">
      <Navbar />
      
      {/* Decorative elements */}
      <div className="decorative-shapes">
        <div className="shape circle-1"></div>
        <div className="shape circle-2"></div>
        <div className="shape circle-3"></div>
        <div className="shape triangle-1"></div>
        <div className="shape triangle-2"></div>
        <div className="shape square-1"></div>
        <div className="shape square-2"></div>
        <div className="shape wave-1"></div>
        <div className="shape wave-2"></div>
      </div>

      <div className="dashboard-content w-full max-w-4xl mt-12 mx-auto text-center px-4 md:px-8 lg:px-16 xl:px-24 relative z-10">
        <h1 className="dashboard-title">
          <span className="title-highlight">Dashboard</span>
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleNewItinerary}
            className="go-itinerary-btn"
          >
            <span className="btn-icon">+</span> New Itinerary
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="text-xl text-gray-600 my-8">Loading your itineraries...</div>
          </div>
        ) : (
          <div className="itinerary-grid">
            {itineraries.length > 0 ? (
              itineraries.map((trip) => (
                <div key={trip._id} className="itinerary-card-wrapper relative">
                  <div className="itinerary-card" 
                       style={{
                         backgroundColor: trip.color || "#ffffff",
                         color: trip.textColor || "#000000"
                       }}>
                    <div className="card-content">
                      <div className="itinerary-emoji">{trip.emoji || "🗺️"}</div>
                      <h3 className="itinerary-title">{trip.title}</h3>
                      <div className="card-actions">
                        <button
                          onClick={() => navigate(`/itinerary/${trip._id}`)}
                          className="card-btn view-btn"
                          title="View Itinerary"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditItinerary(trip)}
                          className="card-btn edit-btn"
                          title="Edit Itinerary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip._id)}
                          className="card-btn delete-btn"
                          title="Delete Itinerary"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state col-span-3 text-xl text-gray-600 my-8 p-8 bg-white bg-opacity-70 rounded-xl shadow-lg">
                <div className="empty-icon">📝</div>
                <p>No editable itineraries found. Create a new one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Itinerary Modal */}
      <CreateItineraryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateItinerary}
        onSaveAndOpen={handleCreateAndOpenItinerary}
      />

      {/* Edit Itinerary Modal */}
      <CreateItineraryModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCurrentItinerary(null);
        }}
        onSave={handleUpdateItinerary}
        onSaveAndOpen={(data) => {
          handleUpdateItinerary(data);
          if (currentItinerary && currentItinerary._id) {
            navigate(`/itinerary/${currentItinerary._id}`);
          }
        }}
        initialData={currentItinerary}
      />
    </div>
  );
};

export default Dashboard;