// Import dependencies
import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Sample route for testing
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Get the port from the .env file or default to 5000 if not found
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
