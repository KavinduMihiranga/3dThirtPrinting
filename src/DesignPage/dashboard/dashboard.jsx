import React from 'react';
import { useState } from 'react';

function dashboard(props) {

    const [qty, setQty] = useState(1);
  const [sizes, setSizes] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0,
  });

  const handleSizeChange = (size, value) => {
    setSizes({ ...sizes, [size]: parseInt(value) || 0 });
  };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md grid grid-cols-5 gap-6">

        {/* Left Panel */}
        <div className="col-span-1 space-y-3">
          <button className="bg-blue-300 px-4 py-2 rounded-full w-full">T-shirt</button>
          <button className="bg-cyan-200 px-4 py-2 rounded-full w-full">Men</button>
          <button className="bg-rose-400 px-4 py-2 rounded-full w-full">ScreenPrint</button>
          <button className="bg-green-400 px-4 py-2 rounded-full w-full">220GSM</button>

          <div className="mt-6 space-y-4">
            <button className="flex items-center gap-2 border p-2 rounded w-full">
              <span className="bg-black-400 px-4 py-2 rounded-full w-full">T</span> add Text
            </button>
            <button className="flex items-center gap-2 border p-2 rounded w-full">
              <img src="https://www.svgrepo.com/show/448213/image-add.svg" alt="Add" className="w-5 h-5" />
              add Image
            </button>
          </div>
        </div>

          {/* Center Preview */}
        <div className="col-span-3 flex justify-center items-center">
          <div className="bg-white p-6 border rounded-lg">
            <img
              src="https://i.ibb.co/1M6ndVt/plain-tshirt.png" // Replace with your actual shirt image
              alt="T-shirt"
              className="w-72 h-auto object-contain"
            />
            <div className="text-center mt-2 font-semibold text-lg">Text</div>
            <img
              src="https://i.ibb.co/pL4mV6r/beach-design.png" // Replace with your logo/image
              alt="Design"
              className="mx-auto mt-1 w-20"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 space-y-4">
          <button className="bg-green-700 text-white px-4 py-2 rounded w-full">Save and Order</button>

          <div className="bg-gray-200 rounded p-4 text-center">
            <div className="text-sm">Color</div>
            <div className="w-8 h-8 bg-black mx-auto mt-2 rounded"></div>
          </div>

          <div className="bg-gray-200 rounded p-4 text-center">
            <div className="text-sm mb-1">Qty</div>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full text-center p-1 rounded"
            />
          </div>

          <div className="bg-gray-200 rounded p-4 text-sm">
            <div className="font-semibold mb-2">Sizes</div>
            {Object.keys(sizes).map((size) => (
              <div key={size} className="flex justify-between items-center mb-1">
                <span>{size}</span>
                <input
                  type="number"
                  value={sizes[size]}
                  onChange={(e) => handleSizeChange(size, e.target.value)}
                  className="w-12 text-center rounded"
                />
              </div>
            ))}
          </div>
        </div>
     {/* Price */}
      <div className="max-w-6xl mx-auto mt-6 p-4 bg-white rounded shadow text-xl font-semibold">
        Price: <span className="text-green-600">Rs : 2000.00</span>
      </div>

        </div>
        </div>
    );
}

export default dashboard;