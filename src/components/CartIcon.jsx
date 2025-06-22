import React from 'react';
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

function CartIcon(itemCount) {
    return (
        <div className="relative cursor-pointer">
      {/* Cart Icon */}
      <ShoppingCartIcon className="w-8 h-8 text-gray-800 hover:text-gray-600 transition" />

      {/* Item Count Badge */}
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {itemCount}
        </span>
      )}
    </div>

    );
}

export default CartIcon;