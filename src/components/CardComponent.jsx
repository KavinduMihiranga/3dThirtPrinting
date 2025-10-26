import React from "react";
import { useNavigate } from "react-router-dom";

function CardComponent({ id, title, description, price, image, status, category, qty }) {
  const navigate = useNavigate();

  const handleBuyClick = () => {
    navigate(`/product/${id}`, { 
      state: { 
        _id: id, // Change this to _id to match your API
        title: title || 'No Title',
        description: description || 'No Description',
        price: price || 0,
        image: image || '/default-image.jpg',
        status: status || 'Unknown',
        category: category || 'Uncategorized',
        qty: qty || 0
      } 
    });
  };
  
  return (
    <div className="w-full max-w-sm h-[420px] flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white">
      <img
        src={image}
        alt={title}
        className="w-full h-[180px] object-contain bg-white"
        onError={(e) => {
          e.target.src = '/default-image.jpg';
        }}
      />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{status}</p>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{category}</p>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{qty}</p>
        <p className="text-green-600 font-bold mt-2">LKR {price.toLocaleString()}</p>
        <button 
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBuyClick}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default CardComponent;