// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

console.log("Mongo URI:", process.env.MONGO_URI);


// Middleware to allow cross-origin requests
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));

// Itinerary Schema
const ActivitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, default: "📍" },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 },
  cost: { type: Number, default: 0 },
  date: { type: String, required: true },
  backgroundColor: { type: String, default: "#E3F2FD" },
  bubbleClass: { type: String, default: "airport-bubble" },
  address: String,
  description: String
});

const ItinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  emoji: {
    type: String,
    default: "📍"
  },
  activities: [ActivitySchema],
});

// Checklist Schema
const ChecklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const ChecklistCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  items: [ChecklistItemSchema]
});

const ChecklistSchema = new mongoose.Schema({
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true
  },
  categories: [ChecklistCategorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Define models
const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
const Checklist = mongoose.model("Checklist", ChecklistSchema);

// ===== Itinerary Routes =====

// Get all itineraries
app.get("/api/itineraries", async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific itinerary by ID
app.get("/api/itineraries/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json(itinerary);
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add to your server.js file

// ShareSettings Schema
const ShareSettingsSchema = new mongoose.Schema({
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ""
  },
  collaborators: [
    {
      username: String,
      email: String,
      permission: {
        type: String,
        enum: ['read', 'write', 'admin'],
        default: 'read'
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ShareSettings = mongoose.model("ShareSettings", ShareSettingsSchema);

// Add share settings routes
app.get("/api/sharesettings/:itineraryId", async (req, res) => {
  try {
    const settings = await ShareSettings.findOne({ 
      itineraryId: req.params.itineraryId 
    });
    
    if (!settings) {
      return res.json({
        itineraryId: req.params.itineraryId,
        isPublic: false,
        description: "",
        collaborators: []
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error("Error fetching share settings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/sharesettings/:itineraryId", async (req, res) => {
  try {
    const { isPublic, description, collaborators } = req.body;
    
    // Check if settings exist
    let settings = await ShareSettings.findOne({ 
      itineraryId: req.params.itineraryId 
    });
    
    if (settings) {
      // Update existing settings
      settings.isPublic = isPublic;
      settings.description = description;
      settings.collaborators = collaborators;
      settings.updatedAt = Date.now();
      await settings.save();
    } else {
      // Create new settings
      settings = new ShareSettings({
        itineraryId: req.params.itineraryId,
        isPublic,
        description,
        collaborators
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error("Error saving share settings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new itinerary
app.post("/api/itineraries", async (req, res) => {
  try {
    const { title, description, emoji, activities } = req.body;

    const newItinerary = new Itinerary({
      title,
      description,
      emoji,
      activities: activities || []
    });

    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
});




// Update an existing itinerary
app.put("/api/itineraries/:id", async (req, res) => {
  try {
    const { title, description, activities } = req.body;
    
    // Check if the itinerary exists
    const itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    // Update the itinerary fields
    itinerary.title = title || itinerary.title;
    itinerary.description = description || itinerary.description;
    itinerary.activities = activities || itinerary.activities;
    itinerary.updatedAt = Date.now();
    
    const updatedItinerary = await itinerary.save();
    res.json(updatedItinerary);
  } catch (error) {
    console.error("Error updating itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete an itinerary
app.delete("/api/itineraries/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    // Also delete associated checklist
    await Checklist.deleteMany({ itineraryId: req.params.id });
    
    // Delete the itinerary
    await Itinerary.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Checklist Routes =====

// Get a checklist for a specific itinerary
app.get("/api/checklists/:itineraryId", async (req, res) => {
  try {
    // Check if the itinerary exists
    const itinerary = await Itinerary.findById(req.params.itineraryId);
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    // Find the checklist
    const checklist = await Checklist.findOne({
      itineraryId: req.params.itineraryId
    });
    
    if (!checklist) {
      // Return an empty checklist structure if none exists
      return res.json({
        itineraryId: req.params.itineraryId,
        categories: []
      });
    }
    
    res.json(checklist);
  } catch (error) {
    console.error("Error fetching checklist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create or update a checklist
app.post("/api/checklists/:itineraryId", async (req, res) => {
  try {
    // Check if the itinerary exists
    const itinerary = await Itinerary.findById(req.params.itineraryId);
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    const { categories } = req.body;
    
    // Find existing checklist or create a new one
    let checklist = await Checklist.findOne({
      itineraryId: req.params.itineraryId
    });
    
    if (checklist) {
      // Update existing checklist
      checklist.categories = categories;
      checklist.updatedAt = Date.now();
      await checklist.save();
    } else {
      // Create new checklist
      checklist = new Checklist({
        itineraryId: req.params.itineraryId,
        categories
      });
      await checklist.save();
    }
    
    res.json(checklist);
  } catch (error) {
    console.error("Error saving checklist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a single item in the checklist
app.patch("/api/checklists/:itineraryId/item", async (req, res) => {
  try {
    const { categoryId, itemId, completed } = req.body;
    
    // Find the checklist
    const checklist = await Checklist.findOne({
      itineraryId: req.params.itineraryId
    });
    
    if (!checklist) {
      return res.status(404).json({ error: "Checklist not found" });
    }
    
    // Find and update the specific item
    let itemUpdated = false;
    checklist.categories = checklist.categories.map(category => {
      if (category.id === categoryId) {
        category.items = category.items.map(item => {
          if (item.id === itemId) {
            item.completed = completed;
            itemUpdated = true;
          }
          return item;
        });
      }
      return category;
    });
    
    if (!itemUpdated) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    checklist.updatedAt = Date.now();
    await checklist.save();
    
    res.json(checklist);
  } catch (error) {
    console.error("Error updating checklist item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    family: 4 // Forces IPv4 to avoid weird DNS issues on Windows
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err.message); // only show the useful message
    console.error("🧠 Make sure your IP is whitelisted in MongoDB Atlas");
  });


export default app;