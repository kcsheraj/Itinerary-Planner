import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import CreateItineraryModal from "../Itinerary/CreateItineraryModal";
import EditItineraryModal from "../Itinerary/EditItineraryModal";
import Navbar from "../Navbar/Navbar";

import ItineraryIcon from "./ItineraryIcon";

const Dashboard = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const [itineraries, setItineraries] = useState([
    { title: "Trip to the Big City", emoji: "🏙️", slug: "big-city" },
    { title: "Picnic", emoji: "🍇", slug: "picnic" },
    { title: "Movie Night", emoji: "🍿", slug: "movie-night" },
    { title: "Cherry Blossom Festival", emoji: "🌸", slug: "cherry-blossom" },
    { title: "Happy Hour", emoji: "🥂", slug: "happy-hour" },
    { title: "Beach Trip", emoji: "🏝️", slug: "beach-trip" },
  ]);

  const handleCreate = () => setShowCreateModal(true);

  const handleEdit = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowEditModal(true);
  };

  const filteredItineraries = itineraries.filter((trip) =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItineraryClick = (slug) => {
    navigate(`/aakash/${slug}`); // Update this for dynamic username later
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      <Navbar />

      <div className="w-full max-w-4xl mt-12 mx-auto text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-6 text-green-900">Dashboard</h1>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search itineraries..."
            className="px-4 py-2 rounded-md shadow border border-gray-300 w-full sm:w-1/2"
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredItineraries.map((trip, index) => (
            <ItineraryIcon
              key={index}
              emoji={trip.emoji}
              title={trip.title}
              onClick={() => handleItineraryClick(trip.slug)}
              onEdit={() => handleEdit(trip)}
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
          onClose={() => setShowEditModal(false)}
          setItineraries={setItineraries}
        />
      )}
    </div>
  );
};

export default Dashboard;
