
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";

function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  // Get data from navigation state
  const { state } = location;
  const customerDetails = state?.customerDetails;
  const designData = state?.designData;

  useEffect(() => {
    console.log("📍 Payment Gateway - Received State:", state);
    console.log("👤 Customer Details:", customerDetails);
    console.log("🎨 Design Data:", designData);

    if (!customerDetails) {
      setError("No customer details found. Please go back and try again.");
      return;
    }

    // Prepare order data
    const order = {
      customerName: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      billingAddress: customerDetails.billingAddress,
      shippingAddress: customerDetails.shippingAddress,
      tShirtName: designData?.tShirtName || "Custom T-Shirt Design",
      designFile: designData?.designFile,
      designPreview: designData?.designPreview,
      description: designData?.description || "Custom T-Shirt Design Order",
      qty: designData?.qty || 1,
      price: designData?.price || 0,
      status: "pending",
      paymentStatus: "pending",
      date: new Date().toISOString()
    };

    console.log("📦 Prepared Order Data:", order);
    setOrderData(order);
  }, [state, customerDetails, designData]);

  const handleCreateOrder = async () => {
    if (!orderData) {
      setError("Order data not ready. Please wait...");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🟢 Sending order data to backend:", orderData);

      // Validate required fields
      const requiredFields = ['customerName', 'email', 'phone', 'shippingAddress'];
      const missingFields = requiredFields.filter(field => !orderData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await axios.post("http://localhost:5000/api/order", orderData);
      
      console.log("✅ Order created successfully:", response.data);
      
      // Redirect to success page or order details
      navigate("/payment-success", { 
        state: { 
          order: response.data.data,
          orderId: response.data.data._id 
        }
      });

    } catch (error) {
      console.error("❌ Error creating order:", error);
      
      if (error.response?.data) {
        setError(error.response.data.message || "Failed to create order");
        console.error("🔍 Backend error details:", error.response.data);
      } else if (error.request) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayHerePayment = () => {
    if (!orderData) {
      setError("Order data not ready. Please wait...");
      return;
    }

    // Load PayHere script dynamically
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    
    script.onload = () => {
      const payment = {
        sandbox: true, // Set to false for production
        merchant_id: "1218408", // Your merchant ID - get from PayHere dashboard
        return_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-cancel",
        notify_url: "http://localhost:5000/api/payments/notify",
        order_id: `ORDER_${Date.now()}`,
        items: orderData.tShirtName || "Custom T-Shirt Design",
        amount: orderData.price || 1000, // Default amount if not set
        currency: "LKR",
        first_name: orderData.customerName?.split(' ')[0] || "Customer",
        last_name: orderData.customerName?.split(' ').slice(1).join(' ') || "",
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.shippingAddress?.addressLine1 || "No Address",
        city: orderData.shippingAddress?.city || "Colombo",
        country: "Sri Lanka",
      };

      console.log("💳 PayHere Payment Data:", payment);

      if (window.payhere) {
        window.payhere.startPayment(payment);
      } else {
        setError("Payment gateway not loaded. Please try again.");
      }
    };

    script.onerror = () => {
      setError("Failed to load payment gateway. Please check your internet connection.");
    };

    document.body.appendChild(script);
  };

  if (!customerDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <Shield size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error || "No customer information found."}</p>
          <button
            onClick={() => navigate("/design")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Design
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Order Details
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Payment Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard size={32} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Payment Gateway</h1>
                  <p className="text-blue-100">Complete your purchase securely</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Order Total</p>
                <p className="text-2xl font-bold">
                  LKR {orderData?.price ? orderData.price.toLocaleString() : "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Shield size={20} className="text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {customerDetails.name}</p>
                  <p><strong>Email:</strong> {customerDetails.email}</p>
                  <p><strong>Phone:</strong> {customerDetails.phone}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Order Details</h3>
                <div className="space-y-2">
                  <p><strong>Product:</strong> {orderData?.tShirtName || "Custom T-Shirt"}</p>
                  <p><strong>Quantity:</strong> {orderData?.qty || 1}</p>
                  <p><strong>Description:</strong> {orderData?.description || "Custom design"}</p>
                  <p className="text-green-600 font-semibold">
                    <strong>Total:</strong> LKR {orderData?.price ? orderData.price.toLocaleString() : "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              {customerDetails.shippingAddress && (
                <div className="space-y-1">
                  <p>{customerDetails.shippingAddress.addressLine1}</p>
                  {customerDetails.shippingAddress.addressLine2 && (
                    <p>{customerDetails.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {customerDetails.shippingAddress.city}, {customerDetails.shippingAddress.province}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
              
              <div className="space-y-4">
                {/* Option 1: Create Order First */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Create Order First</h4>
                      <p className="text-sm text-gray-600">
                        Save order details and proceed to payment later
                      </p>
                    </div>
                    <button
                      onClick={handleCreateOrder}
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Create Order
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Option 2: Pay with PayHere */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Pay with PayHere</h4>
                      <p className="text-sm text-gray-600">
                        Secure payment via PayHere gateway
                      </p>
                    </div>
                    <button
                      onClick={handlePayHerePayment}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <CreditCard size={16} className="mr-2" />
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Shield size={20} className="text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">
                  Your payment information is secure and encrypted. We do not store your credit card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react";

// function PaymentGateway() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [orderData, setOrderData] = useState(null);
//   const [orderType, setOrderType] = useState("");

//   // Get data from navigation state
//   const { state } = location;

//   useEffect(() => {
//     console.log("📍 Payment Gateway - Full State:", state);

//     if (!state) {
//       setError("No order data received. Please start from the beginning.");
//       return;
//     }

//     const { customerDetails, designData, cartItems, totalAmount } = state;

//     // Determine order type and prepare data
//     if (designData && customerDetails) {
//       // Design Order
//       setOrderType("design");
//       const order = {
//         customerName: customerDetails.name,
//         email: customerDetails.email,
//         phone: customerDetails.phone,
//         billingAddress: customerDetails.billingAddress,
//         shippingAddress: customerDetails.shippingAddress,
//         tShirtName: designData.tShirtName || "Custom T-Shirt Design",
//         designFile: designData.designFile,
//         designPreview: designData.designPreview,
//         description: designData.description || "Custom T-Shirt Design Order",
//         qty: designData.qty || 1,
//         price: designData.price || 0,
//         status: "pending",
//         paymentStatus: "pending",
//         orderDate: new Date().toISOString(),
//         type: "design"
//       };
//       console.log("📦 Design Order Data:", order);
//       setOrderData(order);
//     } else if (cartItems && customerDetails) {
//       // Regular Order
//       setOrderType("regular");
//       const order = {
//         customerName: customerDetails.name,
//         email: customerDetails.email,
//         phone: customerDetails.phone,
//         billingAddress: customerDetails.billingAddress,
//         shippingAddress: customerDetails.shippingAddress,
//         items: cartItems,
//         totalAmount: totalAmount,
//         tShirtName: cartItems.map(item => item.name).join(", "),
//         qty: cartItems.reduce((total, item) => total + (item.quantity || 1), 0),
//         description: `Order of ${cartItems.length} item(s)`,
//         price: totalAmount,
//         status: "pending",
//         paymentStatus: "pending",
//         orderDate: new Date().toISOString(),
//         type: "regular"
//       };
//       console.log("📦 Regular Order Data:", order);
//       setOrderData(order);
//     } else {
//       setError("Missing required order information. Please ensure customer details are provided.");
//       console.error("Missing data:", { customerDetails, designData, cartItems });
//     }
//   }, [state]);

//   const handleCreateOrder = async () => {
//     if (!orderData) {
//       setError("Order data not ready. Please wait...");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       console.log("🟢 Sending order to backend:", orderData);

//       // Validate required fields
//       if (!orderData.customerName || !orderData.email || !orderData.phone) {
//         throw new Error("Missing required customer information");
//       }

//       if (!orderData.shippingAddress) {
//         throw new Error("Shipping address is required");
//       }

//       // Choose endpoint based on order type
//       const endpoint = orderType === "design" 
//         ? "http://localhost:5000/api/design-inquiry" 
//         : "http://localhost:5000/api/order";

//       console.log(`📤 POST to: ${endpoint}`);

//       const response = await axios.post(endpoint, orderData);
      
//       console.log("✅ Order created:", response.data);
      
//       // Navigate to success page
//       navigate("/payment-success", { 
//         state: { 
//           order: response.data.data,
//           orderId: response.data.data._id,
//           orderType: orderType,
//           message: "Order created successfully!"
//         },
//         replace: true
//       });

//     } catch (error) {
//       console.error("❌ Error creating order:", error);
      
//       if (error.response?.data) {
//         setError(error.response.data.message || "Failed to create order");
//       } else if (error.request) {
//         setError("Cannot connect to server. Please try again.");
//       } else {
//         setError(error.message || "An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Error state
//   if (error && !orderData) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
//           <div className="text-red-500 mb-4">
//             <AlertCircle size={48} className="mx-auto" />
//           </div>
//           <h2 className="text-xl font-semibold mb-4">Payment Error</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Loading state
//   if (!orderData) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Preparing your order...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-4xl mx-auto">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center mb-6 text-gray-600 hover:text-gray-800"
//         >
//           <ArrowLeft size={20} className="mr-2" />
//           Back
//         </button>

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <CreditCard size={32} className="mr-3" />
//                 <div>
//                   <h1 className="text-2xl font-bold">Payment Gateway</h1>
//                   <p className="text-blue-100">
//                     {orderType === "design" ? "Custom Design Order" : "Regular Order"}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-blue-100">Total Amount</p>
//                 <p className="text-3xl font-bold">
//                   LKR {orderData.price ? orderData.price.toLocaleString() : "0.00"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {/* Error Display */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                 <div className="flex items-center">
//                   <AlertCircle size={20} className="text-red-500 mr-2" />
//                   <p className="text-red-700">{error}</p>
//                 </div>
//               </div>
//             )}

//             {/* Order Summary */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//               {/* Customer Info */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
//                 <div className="space-y-2">
//                   <p><strong>Name:</strong> {orderData.customerName}</p>
//                   <p><strong>Email:</strong> {orderData.email}</p>
//                   <p><strong>Phone:</strong> {orderData.phone}</p>
//                 </div>
//               </div>

//               {/* Order Details */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="text-lg font-semibold mb-3">Order Details</h3>
//                 <div className="space-y-2">
//                   <p><strong>Items:</strong> {orderData.tShirtName}</p>
//                   <p><strong>Quantity:</strong> {orderData.qty}</p>
//                   <p className="text-green-600 font-semibold">
//                     <strong>Total:</strong> LKR {orderData.price.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
//               {orderData.shippingAddress && (
//                 <div className="space-y-1">
//                   <p>{orderData.shippingAddress.addressLine1}</p>
//                   {orderData.shippingAddress.addressLine2 && (
//                     <p>{orderData.shippingAddress.addressLine2}</p>
//                   )}
//                   <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.province}</p>
//                 </div>
//               )}
//             </div>

//             {/* Design Preview (for design orders) */}
//             {orderType === "design" && orderData.designPreview && (
//               <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                 <h3 className="text-lg font-semibold mb-3">Design Preview</h3>
//                 <img
//                   src={orderData.designPreview}
//                   alt="Design"
//                   className="w-full max-w-md rounded-lg shadow-md mx-auto"
//                 />
//               </div>
//             )}

//             {/* Payment Button */}
//             <div className="border-t pt-6">
//               <button
//                 onClick={handleCreateOrder}
//                 disabled={loading}
//                 className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold transition"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                     Processing Order...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={20} className="mr-2" />
//                     Complete Order
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Security Notice */}
//             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//               <div className="flex items-center">
//                 <Shield size={20} className="text-blue-500 mr-2" />
//                 <p className="text-sm text-blue-700">
//                   Your information is secure and encrypted. Order will be processed immediately.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentGateway;