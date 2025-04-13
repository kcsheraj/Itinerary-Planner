const emojiOptions = [
"📍", "✈️", "🏖️", "🏕️", "🏙️", "🎢", "🎡", "🎟️",
"🎬", "🎨", "🍽️", "🍕", "🍣", "🍜", "🍺", "☕",
"🏛️", "🏟️", "🏞️", "🛍️", "🎉", "🎶", "🗺️", "🌸"
];

const EmojiPicker = ({ selected, onSelect }) => {
return (
    <div className="grid grid-cols-6 gap-2 border rounded p-2">
    {emojiOptions.map((emoji) => (
        <button
        key={emoji}
        type="button"
        className={`text-2xl p-2 rounded hover:bg-green-100 transition ${
            selected === emoji ? "ring-2 ring-green-500" : ""
        }`}
        onClick={() => onSelect(emoji)}
        >
        {emoji}
        </button>
    ))}
    </div>
);
};

export default EmojiPicker;
