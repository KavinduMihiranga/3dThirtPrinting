import React from "react";
import { Link } from "react-router-dom";

function DesignCard({ image, title, description }) {
  return (
    <div className="w-full max-w-sm h-[480px] flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white">
      <img
        src={image}
        alt={title}
        className="w-full h-[180px] object-contain bg-white"
      />
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <Link
          to={"/design"}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
        >
          DESIGN
        </Link>
      </div>
    </div>
  );
}

export default DesignCard;
