import React, { useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add axios import
import NavbarLogin from "../Navbar/NavbarLogin"; // Import the new Navbar component

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
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex flex-col">
      <NavbarLogin /> {/* Updated Navbar component */}
      <div className="flex-grow flex items-center justify-center text-white text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-4xl">
          {" "}
          {/* Adjust the width here */}
          <h2 className="text-4xl font-bold mb-4">Welcome to Wandr</h2>
          <p className="text-xl mb-8">
            Plan, organize, and share your trips with ease and style.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 w-full sm:w-auto"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
