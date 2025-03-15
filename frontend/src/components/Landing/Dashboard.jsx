import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Welcome, {user ? user.displayName || user.email : "User"}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <button
        onClick={handleItineraryRedirect}
        className="ml-4 p-2 bg-green-500 text-white rounded"
      >
        Go to Itinerary
      </button>
    </div>
  );
};

export default Dashboard;
