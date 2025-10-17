import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Order data sent to backend
      const paymentData = {
        customerName: state?.name,
        email: state?.email,
        phone: state?.phone,
        items: state?.cartItems?.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          qty: item.qty
  })),
  totalAmount: state?.totalAmount,
  address: `${state?.billingAddress?.addressLine1}, ${state?.billingAddress?.city}`,
  paymentMethod,

      };

      const res = await axios.post("http://localhost:5000/api/payments", paymentData);

      if (res.data.success) {
        alert(`✅ Payment Successful!\nTransaction ID: ${res.data.transactionId}`);
        
        // Prepare order data for DB
      const orderData = {
        customerName: state?.name,
        tShirtName: state?.cartItems?.map((item) => item.name).join(", "),
        address: `${state?.billingAddress?.addressLine1}, ${state?.billingAddress?.city}`,
        qty: state?.cartItems?.reduce((sum, item) => sum + item.qty, 0),
        date: new Date().toLocaleDateString(),
        status: "Paid",
      };
      
        await axios.post("http://localhost:5000/api/order", orderData);
        navigate("/order"); // redirect to order dashboard
      } else {
        alert("❌ Payment failed! Try again.");
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      alert("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden m-4 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Secure Payment
      </h2>

      <div className="flex space-x-4 mb-6 justify-center">
        {["card", "bank", "crypto"].map((method) => (
          <button
            key={method}
            type="button"
            className={`px-4 py-2 rounded-md border ${
              paymentMethod === method
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setPaymentMethod(method)}
          >
            {method.charAt(0).toUpperCase() + method.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div className="text-gray-700 text-sm">
          <p>
            <strong>Customer:</strong> {state?.name}
          </p>
          <p>
            <strong>Email:</strong> {state?.email}
          </p>
          <p>
            <strong>Amount to Pay:</strong> Rs. {state?.totalAmount}
          </p>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                placeholder="5399 0000 0000 0000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleCardChange}
                placeholder="MM/YY"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                placeholder="CVV"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="saveCard"
                checked={cardDetails.saveCard}
                onChange={handleCardChange}
              />
              <span className="text-sm text-gray-700">Save card details</span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : `Pay Rs. ${state?.totalAmount || 0}`}
        </button>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Your data will be used to process your order securely.
        </p>
      </form>
    </div>
  );
};

export default PaymentPage;
