import React from "react";

function CardComponent({ image, title, description }) {
  return (
     <div className="w-1/4 max-w-sm rounded-lg overflow-hidden shadow-md bg-gray-600">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          BUY
        </button>
      </div>
    </div>
  );
}

export default CardComponent;