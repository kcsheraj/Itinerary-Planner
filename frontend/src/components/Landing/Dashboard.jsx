//Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import { itineraryService } from "../../services/api"; // ✅ Import API service
import useUserStore from "../../store/useUserStore"; // Import Zustand store
import EditItineraryModal from "../Itinerary/EditItineraryModal";
import Navbar from "../Navbar/Navbar";
import ItineraryIcon from "./ItineraryIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        if (!user || !user.email) return;
        const data = await itineraryService.getUserItineraries(user.email);
        setItineraries(data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, [user]);

  const handleNewItinerary = async () => {
    try {
      const newItinerary = {
        title: "New Itinerary",
        emoji: "🗺️",
        description: "Description of the new itinerary",
        activities: [],
        creatorUsername: user.email,
      };

      const createdItinerary = await itineraryService.createItinerary(newItinerary);
      setItineraries((prev) =>
        prev.map((item) => (item._id === itinerary._id ? updatedItinerary : item))
      );
      
      navigate(`/itinerary/${createdItinerary._id}`);
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this itinerary?");
    if (!confirmed) return;

    try {
      await itineraryService.deleteItinerary(id);
      setItineraries(itineraries.filter((trip) => trip._id !== id));
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  const handleEdit = (itinerary) => {
    setEditingItinerary(itinerary);
  };

  const closeEditModal = () => {
    setEditingItinerary(null);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {itineraries.map((trip) => (
            <ItineraryIcon
              key={trip._id}
              id={trip._id}
              initialEmoji={trip.emoji || "🗺️"}
              initialTitle={trip.title}
              onEdit={() => handleEdit(trip)}
              onDelete={() => handleDelete(trip._id)}
            />
          ))}
        </div>
      </div>

      {editingItinerary && (
        <EditItineraryModal
          itinerary={editingItinerary}
          onClose={closeEditModal}
          setItineraries={setItineraries}
        />
      )}
    </div>
  );
};

export default Dashboard;
