// Import dependencies
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to allow cross-origin requests
app.use(cors());

// Sample route for testing
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Add user to MongoDB (to be called from the frontend after login)
app.post("/api/add-user", async (req, res) => {
  const { username, email } = req.body;

  console.log(username, email);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists, proceeding to login" });
    }

    // Create a new user in MongoDB
    const user = new User({ username, email });
    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding user to database" });
  }
});

// // Signup Route
// app.post("/api/signup", async (req, res) => {
//   const { username, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const user = new User({ username, email, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(400).json({ error: "User already exists" });
//   }
// });

// // Login Route
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) return res.status(400).json({ error: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   res.json({ token, user: { username: user.username, email: user.email } });
// });

// // Middleware to Protect Routes
// const verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ error: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: "Invalid Token" });
//   }
// };

// // Protected Route (Example)
// app.get("/api/protected", verifyToken, (req, res) => {
//   res.json({ message: "You have access to this route" });
// });

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Hashed password
});

const User = mongoose.model("User", UserSchema);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Get the port from the .env file or default to 5000 if not found
const PORT = process.env.PORT || 5001;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running localhost:${PORT}`);
});
