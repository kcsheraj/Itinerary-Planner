import React from "react";
import "./App.css";
import Itinerary from "./components/Itinerary/Itinerary";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Landing/Login";
import Dashboard from "./components/Landing/Dashboard"; // Protected route
import ProtectedRoute from "./components/ProtectedRoute"; // Protect dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
