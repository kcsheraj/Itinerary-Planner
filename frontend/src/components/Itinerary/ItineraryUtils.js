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
    return `${formattedHour}:${minutes}${period}`;
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
        backgroundColor: "#E8F5E9"
      },
      {
        id: "act2",
        title: "Uber To Airport",
        icon: "🚕",
        time: "15:15",
        cost: 30,
        backgroundColor: "#FFCDD2"
      },
      {
        id: "act3",
        title: "Arrive At Airport",
        icon: "🏢",
        time: "16:00",
        cost: 0,
        backgroundColor: "#E3F2FD"
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
    return activities.reduce((total, activity) => total + (activity.cost || 0), 0);
  };