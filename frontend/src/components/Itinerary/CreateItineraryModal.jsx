import { useState } from "react";
import EmojiPicker from "./EmojiPicker"; // Make sure the path is correct

const CreateItineraryModal = ({ onClose, itineraries, setItineraries }) => {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const slugExists = itineraries.some((i) => i.slug === slug);
    if (slugExists) {
      setError("Itinerary name is already taken. Try another.");
      return;
    }

    const newItinerary = {
      title,
      emoji,
      description: "",
      activities: [],
      slug,
    };

    try {
      const res = await fetch("http://localhost:5001/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItinerary),
      });

      if (!res.ok) throw new Error("Failed to create itinerary");

      const saved = await res.json();
      setItineraries([...itineraries, saved]); // ✅ correct variable here
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Create New Itinerary
        </h2>

        {/* 🎯 Emoji Palette */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Choose an Emoji:</p>
          <EmojiPicker selected={emoji} onSelect={setEmoji} />
        </div>

        <input
          type="text"
          placeholder="Itinerary Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Unique Name / Slug (e.g. beach-trip)"
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, "-"))
          }
          className="w-full px-4 py-2 mb-3 border rounded"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateItineraryModal;
