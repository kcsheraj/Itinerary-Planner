import React, { useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add axios import

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated after redirect
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard"); // Redirect to dashboard if user is logged in
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
    <div>
      <h2>Login with Google</h2>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
