import React from "react";
import "./App.css";
import Itinerary from "./components/Itinerary/Itinerary";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./components/Landing/About";
import Dashboard from "./components/Landing/Dashboard"; // Protected route
import Login from "./components/Landing/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // Protect dashboard
import Social from "./components/Social/Social";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social"
          element={
            <ProtectedRoute>
              <Social />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary"
          element={
            <ProtectedRoute>
              <Itinerary />
            </ProtectedRoute>
          }
        />
        {/* Add dynamic itinerary route */}
        <Route
          path="/itinerary/:id" // Define the dynamic route with `:id`
          element={
            <ProtectedRoute>
              <Itinerary />{" "}
              {/* You may want to pass the ID as a prop to Itinerary */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
