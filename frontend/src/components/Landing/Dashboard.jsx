import { useNavigate } from "react-router-dom";
import "../../Dashboard.css"; // Adjust the path if needed
import Navbar from "../Navbar/Navbar"; // Import the Navbar component
import ItineraryIcon from "./ItineraryIcon"; // ✅ Import the new component

const Dashboard = () => {
  const navigate = useNavigate();

  const handleItineraryRedirect = () => {
    navigate("/itinerary"); // Redirect to itinerary page
  };

  const itineraries = [
    { title: "Trip to the Big City", emoji: "🏙️" },
    { title: "Picnic", emoji: "🍇" },
    { title: "Movie Night", emoji: "🍿" },
    { title: "Cherry Blossom Festival", emoji: "🌸" },
    { title: "Happy Hour", emoji: "🥂" },
    { title: "Beach Trip", emoji: "🏝️" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      {/* Navbar remains at the top */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="w-full max-w-4xl mt-12 mx-auto text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-6 text-green-900">Dashboard</h1>

        {/* Go to Itinerary Button */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleItineraryRedirect}
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
          >
            Go to Itinerary
          </button>
        </div>

        {/* Itinerary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {itineraries.map((trip, index) => (
            <ItineraryIcon key={index} emoji={trip.emoji} title={trip.title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
