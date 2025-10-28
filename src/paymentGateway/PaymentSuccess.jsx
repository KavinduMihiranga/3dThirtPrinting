import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/payment/confirm", {
          order_id: orderId,
        });
        console.log("✅ Payment confirmed:", res.data);
        alert("Payment successful!");
        navigate("/");
      } catch (err) {
        console.error("❌ Payment confirmation failed:", err);
        alert("Payment confirmation failed.");
      }
    };

    if (orderId) confirmPayment();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-2xl font-bold text-green-800">Processing Payment Confirmation...</h1>
    </div>
  );
};

export default PaymentSuccess;

// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CheckCircle, Package, Home, FileText } from "lucide-react";

// function PaymentSuccess() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { order, orderId, orderType, message } = location.state || {};

//   useEffect(() => {
//     // Clear any stored cart data if it's a regular order
//     if (orderType === "regular") {
//       localStorage.removeItem("cart");
//     }
//   }, [orderType]);

//   // If no order data, show error
//   if (!order && !orderId) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-md max-w-md w-full p-8 text-center">
//           <div className="text-yellow-500 mb-4">
//             <Package size={64} className="mx-auto" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             No Order Found
//           </h1>
//           <p className="text-gray-600 mb-6">
//             We couldn't find your order details. Please check your email for confirmation.
//           </p>
//           <button
//             onClick={() => navigate("/")}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
//         {/* Success Icon */}
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
//             <CheckCircle size={48} className="text-green-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Order Successful!
//           </h1>
//           <p className="text-gray-600">
//             {message || "Thank you for your order. We've received it successfully."}
//           </p>
//         </div>

//         {/* Order Details Card */}
//         <div className="bg-gray-50 rounded-lg p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
//             <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//               {orderType === "design" ? "Custom Design" : "Regular Order"}
//             </span>
//           </div>
          
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Order ID:</span>
//               <span className="font-mono font-semibold text-sm">{orderId}</span>
//             </div>
            
//             {order && (
//               <>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Customer:</span>
//                   <span className="font-medium">{order.customerName}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Email:</span>
//                   <span className="font-medium">{order.email}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Items:</span>
//                   <span className="font-medium">{order.qty || 1}</span>
//                 </div>
                
//                 <div className="flex justify-between border-t pt-3 mt-3">
//                   <span className="text-gray-800 font-semibold">Total Amount:</span>
//                   <span className="text-green-600 font-bold text-lg">
//                     LKR {order.price ? order.price.toLocaleString() : "0.00"}
//                   </span>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* What's Next Section */}
//         <div className="bg-blue-50 rounded-lg p-6 mb-6">
//           <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
//             <FileText size={20} className="mr-2" />
//             What's Next?
//           </h3>
//           <ul className="space-y-2 text-sm text-gray-700">
//             <li className="flex items-start">
//               <span className="text-blue-600 mr-2">•</span>
//               <span>You'll receive a confirmation email at <strong>{order?.email}</strong></span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-blue-600 mr-2">•</span>
//               <span>We'll process your order and notify you of any updates</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-blue-600 mr-2">•</span>
//               <span>Estimated delivery: 5-7 business days</span>
//             </li>
//           </ul>
//         </div>

//         {/* Action Buttons */}
//         <div className="space-y-3">
//           {orderType === "design" && (
//             <button
//               onClick={() => navigate("/design")}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-semibold"
//             >
//               <Package size={20} className="mr-2" />
//               Create Another Design
//             </button>
//           )}
          
//           <button
//             onClick={() => navigate(orderType === "design" ? "/design-inquiry" : "/orderDashboard")}
//             className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center font-semibold"
//           >
//             <FileText size={20} className="mr-2" />
//             View Order Details
//           </button>
          
//           <button
//             onClick={() => navigate("/")}
//             className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center font-semibold"
//           >
//             <Home size={20} className="mr-2" />
//             Back to Home
//           </button>
//         </div>

//         {/* Order Number for Reference */}
//         <div className="mt-6 pt-6 border-t text-center">
//           <p className="text-sm text-gray-500">
//             Please save your order ID for future reference
//           </p>
//           <p className="font-mono text-xs text-gray-400 mt-1">{orderId}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentSuccess;