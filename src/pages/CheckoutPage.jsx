// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {useCart} from "../pages/CartContext";

// function CheckoutPage() {
//   const navigate = useNavigate();
//   const {cartItems} = useCart();
//   const [sameAddress, setSameAddress] = useState(true);
//   const [billingAddress, setBillingAddress] = useState({
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     province: "",
//   });
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   const [shippingAddress, setShippingAddress] = useState({
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     province: "",
//   });

//   const handleCheckboxChange = () => {
//     setSameAddress(!sameAddress);
//     if (!sameAddress) {
//       setShippingAddress(billingAddress);
//     }
//   };

//    const handleProceedToPayment = () => {

//     const totalAmount = cartItems.reduce(
//       (sum, item) => sum + item.price * item.qty,
//       0
//     );

//     // You would typically pass order details here
//     navigate('/payment', { 
//       state: { 
//         name,
//         email,
//         phone,
//         billingAddress,
//         cartItems,
//         totalAmount, 
//       } 
//     });
//   };
//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>

//       <form className="space-y-6">
//         {/* Full-Width Name Input */}
//         <div className="w-full">
//           <label className="block text-gray-700 mb-2">Full Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Enter your name"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-gray-700 mb-2">Email Address</label>
//           <input type="email"
//            className="w-full px-3 py-2 border rounded" 
//            value={email}
//           onChange={(e) => setEmail(e.target.value)}
//            placeholder="Enter your email" required />
//         </div>

//         <div>
//           <label className="block text-gray-700 mb-2">Phone Number</label>
//           <input type="text"
//            className="w-full px-3 py-2 border rounded" 
//            value={phone}
//            onChange={(e) => setPhone(e.target.value)}
//            placeholder="Enter your phone number" 
//            required />
//         </div>
//         </div>
         


//         {/* Billing & Shipping Addresses Side by Side */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Billing Address */}
//           <div>
//             <h2 className="text-xl font-bold mb-2">Billing Address</h2>
//             {Object.keys(billingAddress).map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 value={billingAddress[field]}
//                 onChange={(e) =>
//                 setBillingAddress({ ...billingAddress, [field]: e.target.value })
//                }
//                 className="w-full px-3 py-2 border rounded mb-2"
//                 placeholder={`Enter your ${field}`}
//                 required
//               />
//             ))}
//           </div>

//           {/* Shipping Address */}
//           <div>
//             <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
//             {!sameAddress &&
//               Object.keys(shippingAddress).map((field) => (
//                 <input
//                   key={field}
//                   type="text"
//                   className="w-full px-3 py-2 border rounded mb-2"
//                   placeholder={`Enter your ${field}`}
//                   required
//                 />
//               ))}
//           </div>
//         </div>
//       </form>
//       <label className="flex items-center mb-2">
//         <input
//           type="checkbox"
//           checked={sameAddress}
//           onChange={handleCheckboxChange}
//           className="mr-2"
//         />
//         Shipping address same as billing
//       </label>
//       {/* Submit Button */}
//       <div className="flex justify-end mt-6">
//         <button 
//         onClick={handleProceedToPayment}
//         className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// }

// export default CheckoutPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleCheckboxChange = () => {
    const newSameAddress = !sameAddress;
    setSameAddress(newSameAddress);
    if (newSameAddress) {
      // Copy billing to shipping when "same as billing" is checked
      setShippingAddress(billingAddress);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !billingAddress.addressLine1) {
      alert("Please fill in all required fields before continuing.");
      return;
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    navigate("/payment", {
      state: {
        name,
        email,
        phone,
        billingAddress,
        shippingAddress: sameAddress ? billingAddress : shippingAddress,
        cartItems,
        totalAmount,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>

      <form className="space-y-6" onSubmit={handleProceedToPayment}>
        {/* Full Name */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        {/* Billing & Shipping Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing Address */}
          <div>
            <h2 className="text-xl font-bold mb-2">Billing Address</h2>
            {Object.keys(billingAddress).map((field) => (
              <input
                key={field}
                type="text"
                value={billingAddress[field]}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    [field]: e.target.value,
                  })
                }
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
                  value={shippingAddress[field]}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded mb-2"
                  placeholder={`Enter your ${field}`}
                  required
                />
              ))}
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          Shipping address same as billing
        </label>

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
