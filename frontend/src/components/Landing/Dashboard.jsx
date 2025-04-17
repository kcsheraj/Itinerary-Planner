// Dashboard.jsx with Create Itinerary Modal
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

  // Expose the fetchItineraries function globally so it can be called from other components
  useEffect(() => {
    // Add the function to the window object so it can be accessed globally
    window.updateDashboard = fetchItineraries;
    
    // Cleanup function to remove the global reference when component unmounts
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
    <div className="min-h-screen flex flex-col bg-green-100">
      <Navbar />

      <div className="w-full max-w-4xl mt-12 mx-auto text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-6 text-green-900">Dashboard</h1>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleNewItinerary}
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
          >
            New Itinerary
          </button>
        </div>

        {loading ? (
          <div className="text-xl text-gray-600 my-8">Loading your itineraries...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {itineraries.length > 0 ? (
              itineraries.map((trip) => (
                <div key={trip._id} className="relative">
                  <ItineraryIcon
                    id={trip._id}
                    initialEmoji={trip.emoji || "🗺️"}
                    initialTitle={trip.title}
                    backgroundColor={trip.color}
                    textColor={trip.textColor}
                    onDelete={() => handleDelete(trip._id)}
                  />
                  <button
                    onClick={() => handleEditItinerary(trip)}
                    className="absolute bottom-2 left-2 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-green-50"
                    title="Edit Itinerary"
                  >
                    ✏️
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-xl text-gray-600 my-8">
                No editable itineraries found. Create a new one to get started!
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
