const emojiOptions = [
"📍", "✈️", "🍕", "🌸", "🍻", "🎨", "🎶", "🎉", "🏖️", "🌆", "🛍️", "🏛️", "🎢", "🍜", "🍿", "☕", "🗺️"
];

const EmojiPicker = ({ selectedEmoji, setSelectedEmoji }) => {
return (
    <div className="grid grid-cols-6 gap-2 mb-4">
    {emojiOptions.map((emoji, index) => (
        <button
        key={index}
        onClick={() => setSelectedEmoji(emoji)}
        className={`text-2xl p-2 rounded ${
            selectedEmoji === emoji ? "ring-2 ring-green-500" : ""
        }`}
        >
        {emoji}
        </button>
    ))}
    </div>
);
};

export default EmojiPicker;
