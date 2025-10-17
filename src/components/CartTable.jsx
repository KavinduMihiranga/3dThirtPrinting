import React from 'react';
import { TrashIcon } from "@heroicons/react/24/outline";
import TshirtImg from "../assets/TshirtPrintingImg.jpg";
import { useCart } from "../pages/CartContext";
import { useNavigate } from "react-router-dom";

function CartTable(props) {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem } = useCart();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Product Name</th>
            <th className="p-3 border">Size</th>
            <th className="p-3 border">Qty</th>
            <th className="p-3 border">Unit Price</th>
            <th className="p-3 border">Total Price</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-3 border">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
              </td>
              <td className="p-3 border">{item.name}</td>
              <td className="p-3 border">{item.size}</td>
              <td className="p-3 border">
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span className="mx-2">{item.qty}</span>
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </td>
              <td className="p-3 border">Rs. {item.price}</td>
              <td className="p-3 border font-semibold text-green-700">
                Rs. {item.qty * item.price}
              </td>
              <td className="p-3 border">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate('/checkoutPage')}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartTable;