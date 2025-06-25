// services/api.js

import axios from "axios";

import useUserStore from "../store/useUserStore";

// TODO: only keep .env urls
const API_URL = import.meta.env.VITE_API_URL || "https://api.wandrr.org/api";

// Setup axios with Firebase token interceaaptor
const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const firebaseToken = localStorage.getItem("firebaseToken");
      if (firebaseToken) {
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Initialize interceptors
setupAxiosInterceptors();

// User service for collaboration features
export const userService = {
  // Sync Firebase user with our database
  syncUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/sync`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search for users by username or email (for adding collaborators)
  searchUsers: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user profile by username
  getUserProfile: async (username) => {
    try {
      const response = await axios.get(`${API_URL}/users/${username}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update current user's profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get collaborations (itineraries shared with current user)
  getCollaborations: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/collaborations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Itinerary service
export const itineraryService = {
  // Get all itineraries for current user
  getItineraries: async () => {
    try {
      const response = await axios.get(`${API_URL}/itineraries`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get itineraries for a specific user (includes collaboration access)
  getUserItineraries: async (username) => {
    try {
      const response = await axios.get(
        `${API_URL}/user/${username}/itineraries`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get public itineraries
  getPublicItineraries: async () => {
    try {
      const response = await axios.get(`${API_URL}/public/itineraries`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific itinerary by ID (own itinerary)
  getItinerary: async (itineraryId) => {
    try {
      const response = await axios.get(`${API_URL}/itineraries/${itineraryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific shared itinerary by username and itinerary ID
  getSharedItinerary: async (username, itineraryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/user/${username}/itineraries/${itineraryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Fixed portions of services/api.js for the itineraryService

  // Improved createItinerary function that properly handles style properties
  createItinerary: async (itineraryData) => {
    try {
      // Get current user from various possible storage locations
      let creatorUsername = null;

      // Try localStorage username
      creatorUsername = localStorage.getItem("username");

      // Try user object if stored as JSON
      if (!creatorUsername) {
        const userJson = localStorage.getItem("user");
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            creatorUsername =
              user.username || user.email || user.name || user.uid;
          } catch (e) {
            console.error("Error parsing user JSON:", e);
          }
        }
      }

      // Fallback to Firebase username if available
      if (!creatorUsername) {
        const firebaseUser = localStorage.getItem("firebaseUser");
        if (firebaseUser) {
          try {
            const user = JSON.parse(firebaseUser);
            creatorUsername = user.displayName || user.email || user.uid;
          } catch (e) {
            console.error("Error parsing Firebase user:", e);
          }
        }
      }

      // Use user store if available
      if (!creatorUsername) {
        const userStore = useUserStore?.getState?.();
        if (userStore && userStore.user) {
          creatorUsername = userStore.user.email || userStore.user.username;
        }
      }

      // If still no username, use a hard-coded fallback
      creatorUsername = creatorUsername || "default-user";

      // Add creatorUsername to the itinerary data and ensure style properties are present
      const dataWithCreator = {
        ...itineraryData,
        creatorUsername,
        // Ensure style properties exist (use defaults if not provided)
        emoji: itineraryData.emoji || "🗺️",
        color: itineraryData.color || "#E3F2FD",
        textColor: itineraryData.textColor || "#1565C0",
      };

      console.log("Creating itinerary with data:", dataWithCreator);

      const response = await axios.post(
        `${API_URL}/itineraries`,
        dataWithCreator
      );

      // Log the response to check what data was actually saved
      console.log("Create itinerary response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error creating itinerary:", error);
      throw error.response?.data || error;
    }
  },

  // Improved updateItinerary function
  updateItinerary: async (itineraryId, itineraryData) => {
    try {
      console.log("Updating itinerary with data:", itineraryData);

      // Get current itinerary first to preserve any fields not included in the update
      const currentItinerary = await itineraryService.getItinerary(itineraryId);

      // Merge the current data with the update data
      const mergedData = {
        ...currentItinerary,
        ...itineraryData,
        // Ensure style properties are explicitly included
        emoji: itineraryData.emoji || currentItinerary.emoji || "🗺️",
        color: itineraryData.color || currentItinerary.color || "#E3F2FD",
        textColor:
          itineraryData.textColor || currentItinerary.textColor || "#1565C0",
      };

      // Remove any properties that shouldn't be sent to the server
      // Like _id or __v if using MongoDB
      if (mergedData._id) delete mergedData._id;
      if (mergedData.__v !== undefined) delete mergedData.__v;

      const response = await axios.put(
        `${API_URL}/itineraries/${itineraryId}`,
        mergedData
      );

      // Log the response to verify what was updated
      console.log("Update itinerary response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error updating itinerary:", error);
      throw error.response?.data || error;
    }
  },

  // Delete an itinerary
  deleteItinerary: async (itineraryId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/itineraries/${itineraryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Checklist service
export const checklistService = {
  // Get checklist for an itinerary
  getChecklist: async (itineraryId) => {
    try {
      const response = await axios.get(`${API_URL}/checklists/${itineraryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save checklist for an itinerary
  saveChecklist: async (itineraryId, checklistData) => {
    try {
      const response = await axios.post(
        `${API_URL}/checklists/${itineraryId}`,
        checklistData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update a single item in a checklist
  updateChecklistItem: async (itineraryId, itemData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/checklists/${itineraryId}/item`,
        itemData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Share service
export const shareService = {
  // Get share settings for an itinerary
  getShareSettings: async (itineraryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/sharesettings/${itineraryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save share settings for an itinerary
  saveShareSettings: async (itineraryId, settingsData) => {
    try {
      const response = await axios.post(
        `${API_URL}/sharesettings/${itineraryId}`,
        settingsData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
