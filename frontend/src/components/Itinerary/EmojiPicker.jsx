// src/components/Itinerary/EmojiPicker.jsx
const emojiOptions = [
"📍", "✈️", "🍕", "🌸", "🍻", "🎨", "🎶", "🎉", "🏖️", "🌆", "🛍️", "🏛️", "🎢", "🍜", "🍿", "☕", "🗺️"
];

const EmojiPicker = ({ selectedEmoji, setSelectedEmoji }) => {
return (
    <div className="grid grid-cols-6 gap-3 justify-center mb-4">
    {emojiOptions.map((emoji, index) => (
        <button
        key={index}
        onClick={() => setSelectedEmoji(emoji)}
        className={`text-2xl p-2 rounded hover:bg-green-100 transition ${
            selectedEmoji === emoji ? "ring-2 ring-green-600 bg-green-200" : ""
        }`}
        >
        {emoji}
        </button>
    ))}
    </div>
);
};

export default EmojiPicker;
