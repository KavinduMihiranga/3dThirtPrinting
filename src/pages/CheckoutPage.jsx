import React, { useState } from "react";

function CheckoutPage() {
  const [sameAddress, setSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
  });

  const handleCheckboxChange = () => {
    setSameAddress(!sameAddress);
    if (!sameAddress) {
      setShippingAddress(billingAddress);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>

      <form className="space-y-6">
        {/* Full-Width Name Input */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">Email Address</label>
          <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Enter your email" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter your phone number" required />
        </div>
        </div>
         


        {/* Billing & Shipping Addresses Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing Address */}
          <div>
            <h2 className="text-xl font-bold mb-2">Billing Address</h2>
            {Object.keys(billingAddress).map((field) => (
              <input
                key={field}
                type="text"
                className="w-full px-3 py-2 border rounded mb-2"
                placeholder={`Enter your ${field}`}
                required
              />
            ))}
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
            {!sameAddress &&
              Object.keys(shippingAddress).map((field) => (
                <input
                  key={field}
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-2"
                  placeholder={`Enter your ${field}`}
                  required
                />
              ))}
          </div>
        </div>
      </form>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={sameAddress}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        Shipping address same as billing
      </label>
      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-blue-600 transition duration-200">
          Continue
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
