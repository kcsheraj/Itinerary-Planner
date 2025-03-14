import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Your firebase auth setup

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  // If the user is authenticated, return the children (Dashboard); otherwise, redirect to Login
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
