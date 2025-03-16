import React from "react";
import Navbar from "../Navbar/Navbar"; // Import the Navbar component

const Social = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-4xl mt-12 mx-auto text-center text-white px-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-4xl font-bold mb-4">Social Page</h1>
        <p className="text-lg">
          Welcome to the Social Page! More features coming soon.
        </p>
      </div>
    </div>
  );
};

export default Social;
