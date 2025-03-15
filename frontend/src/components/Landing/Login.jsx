import React, { useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add axios import

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && window.location.pathname === "/") {
        navigate("/dashboard", { replace: true }); // Redirect only if on login page
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      // Use the signInWithPopup method to login with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Get the logged-in user
      console.log(user);

      // Send user data to backend to add to MongoDB
      const { displayName, email } = user;
      const userData = { username: displayName, email };

      // Make a POST request to add the user to MongoDB
      const response = await axios.post(
        "http://localhost:5001/api/add-user",
        userData
      );

      console.log(response.data); // Handle response from backend if needed

      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-green-500 p-10 px-12 rounded-lg shadow-lg space-y-6">
        <div className="flex justify-center">
          <img
            alt="Itinerary Logo"
            src="/Itinerate.png" // Path to your image in the public folder
            className="h-16 w-auto" // Adjust size as needed
          />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
