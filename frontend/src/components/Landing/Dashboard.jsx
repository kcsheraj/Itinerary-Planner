import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; // Import the Navbar component

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to login page
  };

  const handleItineraryRedirect = () => {
    navigate("/itinerary"); // Redirect to itinerary page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} /> {/* Pass the user object to Navbar */}
      <div className="flex-grow flex items-center justify-center text-white text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-4xl p-4">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={handleItineraryRedirect}
              className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
            >
              Go to Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
