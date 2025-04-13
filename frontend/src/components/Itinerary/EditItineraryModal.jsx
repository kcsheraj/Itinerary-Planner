import { useState } from "react";
import EmojiPicker from "./EmojiPicker"; // ✅ fixed relative path

const EditItineraryModal = ({ itinerary, onClose, setItineraries }) => {
const [title, setTitle] = useState(itinerary.title);
const [emoji, setEmoji] = useState(itinerary.emoji || "📍");
const [slug, setSlug] = useState(itinerary.slug || "");
const [error, setError] = useState("");

const handleUpdate = async () => {
const updated = {
    ...itinerary,
    title,
    emoji,
    slug,
};

try {
    const res = await fetch(`http://localhost:5001/api/itineraries/${itinerary._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
    });

    if (!res.ok) throw new Error("Failed to update itinerary");

    const updatedItinerary = await res.json();
    setItineraries((prev) =>
    prev.map((item) => (item._id === itinerary._id ? updatedItinerary : item))
    );
    onClose(); // ✅ closes the modal
} catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
}
};
  
if (!itinerary) return null; // ✅ Prevent modal if no itinerary selected

return (
<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
    <h2 className="text-xl font-semibold mb-4 text-green-700">Edit Itinerary</h2>

    <EmojiPicker selectedEmoji={emoji} setSelectedEmoji={setEmoji} />

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
        <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:underline">
        Cancel
        </button>
        <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
        Save
        </button>
    </div>
    </div>
</div>
);
};

export default EditItineraryModal;
