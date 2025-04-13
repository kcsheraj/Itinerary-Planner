// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import Navbar from "../Navbar/Navbar";
import ItineraryIcon from "./ItineraryIcon";
import { itineraryService, shareService } from "../../services/api"; // Import shareService
import useUserStore from "../../store/useUserStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);

  // Fetch itineraries when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
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
        
        // Filter for:
        // 1. Itineraries where user is creator
        // OR
        // 2. Itineraries where user has edit permissions
        const filteredItineraries = [];
        
        for (const itinerary of allItineraries) {
          // Always include if user is creator
          if (itinerary.creatorUsername === user.email || 
              itinerary.creator?.username === user.email) {
            filteredItineraries.push(itinerary);
            continue;
          }
          
          // Check share settings for non-creator itineraries
          try {
            const shareSettings = await shareService.getShareSettings(itinerary._id);
            const userCollaborator = shareSettings.collaborators.find(
              c => c.username === user.email
            );
            
            const hasEditPermission = userCollaborator && 
                (userCollaborator.permission === "admin" || 
                 userCollaborator.permission === "write");
            
            if (hasEditPermission) {
              filteredItineraries.push(itinerary);
            }
          } catch (error) {
            console.error(`Error checking permissions for itinerary ${itinerary._id}:`, error);
          }
        }
        
        setItineraries(filteredItineraries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [user]);

  const handleNewItinerary = async () => {
    try {
      const newItinerary = {
        title: "New Itinerary",
        description: "Description of the new itinerary",
        activities: [],
        creatorUsername: user.email, // Store the creator's email as username
      };

      const createdItinerary = await itineraryService.createItinerary(
        newItinerary
      );

      // ✅ Add the new itinerary to the state & navigate
      setItineraries((prev) => [...prev, createdItinerary]);
      navigate(`/itinerary/${createdItinerary._id}`);
    } catch (error) {
      console.error("Error creating itinerary:", error);
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
                <ItineraryIcon
                  key={trip._id}
                  id={trip._id}
                  initialEmoji={trip.emoji || "🗺️"} // Default emoji
                  initialTitle={trip.title}
                  onDelete={() => handleDelete(trip._id)}
                />
              ))
            ) : (
              <div className="col-span-3 text-xl text-gray-600 my-8">
                No editable itineraries found. Create a new one to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;