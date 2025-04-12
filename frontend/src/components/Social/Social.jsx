import React from "react";
import Navbar from "../Navbar/Navbar"; // Import the Navbar component

import { useEffect, useState } from "react";
import ItineraryIcon from "../Landing/ItineraryIcon";
import { itineraryService } from "../../services/api"; // ✅ Import API service
import useUserStore from "../../store/useUserStore"; // Import Zustand store

const Social = () => {
  const user = useUserStore((state) => state.user);
  const [itineraries, setItineraries] = useState([]);

  // Fetch itineraries when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        if (!user || !user.email) return;

        const data = await itineraryService.getPublicItineraries();
        setItineraries(data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-4xl mt-12 mx-auto text-center text-white px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-4">Social Page</h1>
        <p className="text-lg">
          Welcome to the Social Page! More features coming soon.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {itineraries.map((trip) => (
            <ItineraryIcon
              key={trip._id}
              id={trip._id}
              initialEmoji={trip.emoji || "📌"} // Default emoji
              initialTitle={trip.title}
              onDelete={() => handleDelete(trip._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Social;
