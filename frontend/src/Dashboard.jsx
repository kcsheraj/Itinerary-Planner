import React from "react";

const itineraries = [
  { id: 1, name: "New York 2025", emoji: "🏙️" },
  { id: 2, name: "Picnic", emoji: "🍇" },
  { id: 3, name: "Ocean City", emoji: "🏄‍♂️" },
  { id: 4, name: "Cherry Blossoms", emoji: "🌸" },
  { id: 5, name: "DC On Friday", emoji: "🥂" },
  { id: 6, name: "Hawaii", emoji: "🏝️" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navigation Bar */}
      <nav className="w-full bg-gray-300 p-4 flex justify-between">
        <button className="text-lg">🏠</button>
        <h1 className="text-xl font-bold">Itinerate</h1>
        <div>
          <button className="mr-4">Social</button>
          <button>User123</button>
        </div>
      </nav>

      {/* Dashboard Title & Button */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold">Dashboard Page</h2>
        <button className="mt-4 px-4 py-2 bg-gray-400 text-white rounded">
          New Itinerary +
        </button>
      </div>

      {/* Itinerary Cards */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {itineraries.map((itinerary) => (
          <div
            key={itinerary.id}
            className="bg-gray-200 w-40 h-40 flex flex-col items-center justify-center text-lg font-semibold rounded-lg shadow-md"
          >
            <span className="text-4xl">{itinerary.emoji}</span>
            <p className="mt-2">{itinerary.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
