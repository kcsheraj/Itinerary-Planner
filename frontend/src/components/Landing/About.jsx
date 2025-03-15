import React from "react";
import NavbarLogin from "../Navbar/NavbarLogin"; // Import the Navbar component

const About = () => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex flex-col">
      <NavbarLogin /> {/* Include the Navbar component */}
      <div className="flex-grow flex items-center justify-center text-white text-center px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-4xl p-4">
          <h2 className="text-4xl font-bold mb-4">About Wandr</h2>
          <p className="text-xl mb-8">
            Wandr helps you plan, organize, and share your trips with ease. Keep
            all your itineraries in one place, collaborate with others, and get
            real-time updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
