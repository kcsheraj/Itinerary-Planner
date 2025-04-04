const ItineraryIcon = ({ emoji, title, onClick, onEdit }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md px-6 py-4 cursor-pointer relative group transition duration-200 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Edit Button (top-right) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevents triggering onClick for the whole card
          onEdit();
        }}
        className="absolute top-2 right-2 text-sm text-green-700 hover:text-green-900 opacity-0 group-hover:opacity-100 transition"
        title="Edit"
      >
        ✏️
      </button>

      <div className="text-4xl mb-2">{emoji}</div>
      <div className="font-medium text-green-800">{title}</div>
    </div>
  );
};

export default ItineraryIcon;
