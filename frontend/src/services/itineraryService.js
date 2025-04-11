// services/itineraryService.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export async function fetchItineraries() {
  const res = await fetch(`${BASE_URL}/api/itineraries`);
  if (!res.ok) throw new Error("Failed to fetch itineraries");
  return await res.json();
}
