// // import React, { useState } from "react";
// // import axios from "axios";
// // import PayHereButton from "./PayHereButton";

// // const PaymentGateway = () => {
// //   const [orderData, setOrderData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// //   const handleCreateOrder = async (cartItems, customer) => {
// //     setLoading(true);
// //     try {
// //      const res = await axios.post(`${API_BASE_URL}/order`, {
// //       amount: cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
// //       cartItems,
// //       customerName: customer.name,
// //       email: customer.email,
// //       address: customer.address,
// //       tShirtName: cartItems[0].name,
// //       qty: cartItems[0].qty,
// //     });

// //       setOrderData(res.data.data);
// //       console.log("Order created:", res.data);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error creating order");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
// //       {orderData ? (
// //         <PayHereButton orderData={orderData} />
// //       ) : (
// //         <button
// //           onClick={() =>
// //             handleCreateOrder(
// //               [
// //                 { productId: "68e534f5b2a5da4d6a07a87f", name: "T-Shirt", price: 2000, qty: 1 },
// //               ],
// //               {
// //                 name: "Kavindu Mihiranga",
// //                 email: "kavindu@example.com",
// //                 address: "Colombo, Sri Lanka",
// //               }
// //             )
// //           }
// //           className="bg-green-600 text-white px-6 py-2 rounded"
// //           disabled={loading}
// //         >
// //           {loading ? "Processing..." : "Pay with PayHere"}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default PaymentGateway;
// import React, { useState } from "react";
// import axios from "axios";
// import PayHereButton from "./PayHereButton";

// const PaymentGateway = () => {
//   const [orderData, setOrderData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Make sure this is defined

//   const handleCreateOrder = async () => {
//     setLoading(true);
//     try {
//       const cartItems = [
//         {
//           name: "Polo Red T-shirt",
//           price: 5000,
//           qty: 1,
//         },
//       ];
//       const customer = {
//         name: "Kavindu Mihiranga",
//         email: "kavindu@example.com",
//         address: "Colombo, Sri Lanka",
//       };

//       const res = await axios.post(`${API_BASE_URL}/order`, {
//         amount: cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
//         customerName: customer.name,
//         address: customer.address,
//         tShirtName: cartItems[0].name,
//         qty: cartItems[0].qty,
//       });

//       console.log("✅ Order created:", res.data);
//       setOrderData(res.data.data);
//     } catch (err) {
//       console.error("❌ Error creating order:", err);
//       alert("Error creating order. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       {orderData ? (
//         <PayHereButton orderData={orderData} />
//       ) : (
//         <button
//           onClick={handleCreateOrder}
//           className="bg-green-600 text-white px-6 py-3 rounded-lg"
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Pay with PayHere"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default PaymentGateway;

import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentGateway = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async () => {
    if (!state || !state.product) {
      alert("No product details found!");
      return;
    }

    const orderData = {
      customerName: "Test User",
      tShirtName: state.product.title,
      address: "Colombo, Sri Lanka",
      qty: 1,
      date: new Date().toISOString(),
      status: "Paid",
    };

    console.log("🟢 Sending order data:", orderData);

    try {
      setLoading(true);

      // ✅ Correct: Vite proxy will forward this to localhost:5000/api/order
      const res = await axios.post("/api/order", orderData);

      console.log("✅ Order created successfully:", res.data);
      alert("Order created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert("Error creating order. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleCreateOrder}
        disabled={loading}
        className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-800 transition duration-300"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentGateway;
