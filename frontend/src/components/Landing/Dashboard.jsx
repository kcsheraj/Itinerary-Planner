<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import { fetchItineraries } from "../../services/itineraryService";
import CreateItineraryModal from "../Itinerary/CreateItineraryModal";
import EditItineraryModal from "../Itinerary/EditItineraryModal";
import Navbar from "../Navbar/Navbar";
import ItineraryIcon from "./ItineraryIcon";
=======
//Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import Navbar from "../Navbar/Navbar";
import ItineraryIcon from "./ItineraryIcon";
import { itineraryService } from "../../services/api"; // ✅ Import API service
import useUserStore from "../../store/useUserStore"; // Import Zustand store
import Navbar from "../Navbar/Navbar";
import ItineraryIcon from "./ItineraryIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const user = useUserStore((state) => state.user);

<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);

  useEffect(() => {
    fetchItineraries()
      .then((data) => {
        console.log("Fetched from backend:", data); // 🔍 Add this line
        setItineraries(data);
        setFilteredItineraries(data);
      })
      .catch((err) => console.error("Failed to load itineraries", err));
  }, []);

  const handleCreate = () => setShowCreateModal(true);

  const handleEdit = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowEditModal(true);
  };

  const handleItineraryClick = (slug) => {
    navigate(`/aakash/${slug}`); // Replace "aakash" with dynamic user later
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const lower = value.toLowerCase();
    const filtered = itineraries.filter((trip) =>
      trip.title.toLowerCase().includes(lower)
    );
    setFilteredItineraries(filtered);
=======
  // Fetch itineraries when component mounts
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
        description: "Description of the new itinerary",
        activities: [],
        creatorUsername: user.email, // Store the creator's username
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
>>>>>>> origin/development
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      <Navbar />

      <div className="w-full max-w-4xl mt-12 mx-auto text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-6 text-green-900">Dashboard</h1>

<<<<<<< HEAD
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search itineraries..."
            className="px-4 py-2 rounded-md shadow border border-gray-300 w-full sm:w-1/2"
            value={searchTerm}
            onChange={handleSearch}
          />

          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + New Itinerary
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItineraries.map((trip) => (
            <ItineraryIcon
              key={trip._id}
              emoji={trip.emoji}
              title={trip.title}
              onClick={() => handleItineraryClick(trip.slug)}
              onEdit={() => handleEdit(trip)}
=======
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
              initialEmoji={trip.emoji || "🗺️"} // Default emoji
              initialTitle={trip.title}
              onDelete={() => handleDelete(trip._id)}
>>>>>>> origin/development
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateItineraryModal
          onClose={() => setShowCreateModal(false)}
          itineraries={itineraries}
          setItineraries={setItineraries}
        />
      )}
      {showEditModal && selectedItinerary && (
        <EditItineraryModal
          itinerary={selectedItinerary}
          onClose={() => {
            setSelectedItinerary(null);
            setShowEditModal(false);
          }}
          setItineraries={setItineraries}
        />
      )}
    </div>
  );
};

export default Dashboard;
