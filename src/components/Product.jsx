import React from 'react';
import TshirtImg from "../assets/TshirtPrintingImg.jpg";

function Product({title,brand,productCode,availability,price}) {
    return (
         <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Product Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={TshirtImg}
            alt="PUBG Gaming T-shirt"
            className="w-full rounded-lg shadow-md"
          />
          <div className="flex space-x-2 mt-4">
            <img src={TshirtImg} alt="White T-shirt 1" className="w-16 h-16 rounded-lg shadow-md" />
            <img src={TshirtImg} alt="White T-shirt 2" className="w-16 h-16 rounded-lg shadow-md" />
            <img src={TshirtImg} alt="White T-shirt 3" className="w-16 h-16 rounded-lg shadow-md" />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 text-lg">★★★★☆</span>
            <span className="ml-2 text-gray-600">(1 Review)</span>
            <a href="#" className="ml-4 text-blue-500 hover:underline">Write a review</a>
          </div>
          <div className="mt-4 text-gray-700">
            <p><strong>Brand:</strong> {brand}</p>
            <p><strong>Product Code:</strong> {productCode}</p>
            <p><strong>Availability:</strong> <span className="text-green-500">{availability}</span></p>
          </div>
          <p className="text-2xl font-bold text-red-500 mt-4">{price}</p>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <input type="number" defaultValue="1" className="w-16 p-2 border rounded text-center" />
            <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Add To Cart
            </button>
            <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Design T-shirt
            </button>
            <button className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">♡</button>
          </div>
        </div>

      </div>
    </div>

    );
}

export default Product;