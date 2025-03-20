// Helper functions for the Itinerary component

// Format currency amounts
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Format time (e.g., convert 24h to 12h format)
export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
};

// Calculate duration between two time points
export const calculateDuration = (startTime, endTime) => {
  // Parse times and calculate difference
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

// Format date for display (e.g., "Jan 1, 2025")
export const formatDate = (dateStr) => {
  if (!dateStr) return "Not specified";
  
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return dateStr; // If it's not a valid date, return the original string
    }
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  } catch (err) {
    console.error("Error formatting date:", err);
    return dateStr;
  }
};

// Group activities by date
export const groupActivitiesByDate = (activities) => {
  const grouped = {};
  
  activities.forEach((activity) => {
    // Ensure there's a date property, defaulting to "2025-01-01" if not provided
    const date = activity.date || "2025-01-01";
    
    // Create an empty array for this date if it doesn't exist yet
    if (!grouped[date]) {
      grouped[date] = [];
    }
    
    // Add the activity to the appropriate date group
    grouped[date].push(activity);
  });
  
  // Sort activities within each date by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => {
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      
      // Split into hours and minutes and convert to numbers for comparison
      const [hoursA, minutesA] = timeA.split(':').map(Number);
      const [hoursB, minutesB] = timeB.split(':').map(Number);
      
      // Compare hours first, then minutes if hours are equal
      if (hoursA !== hoursB) {
        return hoursA - hoursB;
      }
      return minutesA - minutesB;
    });
  });
  
  return grouped;
};

// Generate a random ID for new items
export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Sample data for demonstration
export const sampleItineraryData = {
  title: "JAPAN 2025",
  startDate: "2025-01-01",
  activities: [
    {
      id: "act1",
      title: "Leave Home",
      icon: "🏠",
      time: "15:05",
      cost: 0,
      date: "2025-01-01",
      backgroundColor: "#E8F5E9",
      bubbleClass: "home-bubble"
    },
    {
      id: "act2",
      title: "Uber To Airport",
      icon: "🚕",
      time: "15:15",
      cost: 30,
      date: "2025-01-01",
      backgroundColor: "#FFEBEE",
      bubbleClass: "uber-bubble"
    },
    {
      id: "act3",
      title: "Arrive At Airport",
      icon: "🏢",
      time: "16:00",
      cost: 0,
      date: "2025-01-01",
      backgroundColor: "#E3F2FD",
      bubbleClass: "airport-bubble"
    },
    {
      id: "act4",
      title: "Flight to Tokyo",
      icon: "✈️",
      time: "19:30",
      duration: 720,
      cost: 850,
      date: "2025-01-01",
      backgroundColor: "#E3F2FD",
      bubbleClass: "airport-bubble",
      address: "SFO International Airport, Terminal 2",
      description: "Japan Airlines Flight JL7075. 12-hour flight to Tokyo Narita Airport."
    },
    {
      id: "act5",
      title: "Arrive in Tokyo",
      icon: "🏢",
      time: "14:30",
      cost: 0,
      date: "2025-01-02",
      backgroundColor: "#E3F2FD",
      bubbleClass: "airport-bubble",
      address: "Narita International Airport, Tokyo, Japan",
      description: "Arrival at Narita Terminal 2. Proceed to immigration and customs."
    },
    {
      id: "act6",
      title: "Hotel Check-in",
      icon: "🏨",
      time: "17:00",
      cost: 120,
      date: "2025-01-02",
      backgroundColor: "#EDE7F6",
      bubbleClass: "purple-bubble",
      address: "Shinjuku Washington Hotel, Tokyo",
      description: "Check in at the hotel. Reservation under your name."
    }
  ]
};

// Add a new activity to the itinerary
export const addActivity = (activities, newActivity) => {
  return [...activities, { ...newActivity, id: generateId() }];
};

// Remove an activity from the itinerary
export const removeActivity = (activities, activityId) => {
  return activities.filter(activity => activity.id !== activityId);
};

// Update an existing activity
export const updateActivity = (activities, updatedActivity) => {
  return activities.map(activity => 
    activity.id === updatedActivity.id ? updatedActivity : activity
  );
};

// Calculate total cost of the itinerary
export const calculateTotalCost = (activities) => {
  return activities.reduce((total, activity) => {
    // Parse the cost to ensure it's a number
    let cost = 0;
    
    if (typeof activity.cost === 'number') {
      cost = activity.cost;
    } else if (typeof activity.cost === 'string') {
      cost = parseFloat(activity.cost.replace('$', '')) || 0;
    }
    
    return total + cost;
  }, 0);


  
};