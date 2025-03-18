import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; // Import the Navbar component

const Dashboard = () => {
  const navigate = useNavigate();

  const handleItineraryRedirect = () => {
    navigate("/itinerary"); // Redirect to itinerary page
  };

  const itineraries = [
    { title: "New York 2025", emoji: "🏙️" },
    { title: "Picnic", emoji: "🍇" },
    { title: "Ocean City", emoji: "🏄" },
    { title: "Cherry Blossoms", emoji: "🌸" },
    { title: "DC On Friday", emoji: "🥂" },
    { title: "Hawaii", emoji: "🏝️" },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      {/* Navbar remains at the top */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="w-full max-w-4xl mt-12 mx-auto text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

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
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105"
            >
              <div className="text-5xl mb-3">{trip.emoji}</div>
              <h3 className="text-xl font-semibold">{trip.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
