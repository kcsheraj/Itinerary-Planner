import React from "react";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import ItineraryIcon from "../Landing/ItineraryIcon";
import { itineraryService } from "../../services/api";
import useUserStore from "../../store/useUserStore";
import "./Social.css";

const Social = () => {
  const user = useUserStore((state) => state.user);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch itineraries when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        if (!user || !user.email) {
          setLoading(false);
          return;
        }

        const data = await itineraryService.getPublicItineraries();
        setItineraries(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [user]);

  return (
    <div className="social-container">
      {/* Decorative elements */}
      <div className="decorative-elements">
        <div className="circle-decoration circle-1"></div>
        <div className="circle-decoration circle-2"></div>
        <div className="circle-decoration circle-3"></div>
        <div className="triangle-decoration triangle-1"></div>
        <div className="triangle-decoration triangle-2"></div>
        <div className="wave-decoration"></div>
      </div>

      <Navbar />
      
      <div className="social-content">
        <div className="social-header-box">
          <h1 className="social-title">Social Page</h1>
          <p className="social-subtitle">Welcome to the Social Page!</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading itineraries...</p>
          </div>
        ) : (
          <div className="itinerary-list">
            {itineraries.length > 0 ? (
              itineraries.map((trip) => (
                <div key={trip._id} className="itinerary-list-item">
                  <ItineraryIcon
                    id={trip._id}
                    initialEmoji={trip.emoji || "🗺️"}
                    initialTitle={trip.title}
                    backgroundColor={trip.color || "#E8F5E9"}
                    textColor={trip.textColor || "#1a1a1a"}
                  />
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No public itineraries found</h3>
                <p>Be the first to share your travel plans with the community!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;