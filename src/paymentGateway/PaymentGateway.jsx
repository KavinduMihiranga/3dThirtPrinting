import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import md5 from "crypto-js/md5";

const PaymentGateway = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async () => {
    if (!state) {
      alert("No product details found!");
      return;
    }
console.log("🟢 State Details", state);
    const orderData = {
    customerName: state.name,
    tShirtName: state.cartItems.map((item) => item.name).join(", "),
    address: "Colombo, Sri Lanka",
    qty: state.qty,
    date: new Date().toISOString(),
    status: "Pending",
    amount: state.totalAmount,
    email: state.email || "abc@gmail.com",
    phone: state.phone || "0769622981",
    paymentId: "TEMP123",
  };

    console.log("🟢 Sending order data:", orderData);

    try {
      setLoading(true);
      // ✅ Normally you would send this to your backend:
      const res = await axios.post("/api/order", orderData);

      // ✅ Simulate success
      setFormValue({
      ...state,
      orderId: res.data.data._id, // MongoDB order ID
      totalAmount: state.totalAmount,
      customerName: state.name,
      email: state.email || "abc@gmail.com",
      phone: state.phone || "0769622981",
    });
      alert("Order created successfully!");
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

function setFormValue(data) {
  const merchant_id = "1232456";
  const order_id = data.orderId || "TEMP123"; // ✅ Now dynamic
  const amount = data.totalAmount;
  const currency = "LKR";
  const merchant_secret =
    "MTI3ODg1Mjk4ODM3Mjc3MTYxODAyODc4NTY3MzkzMjU2MDk4NjU2OQ==";

  const hash = md5(
    merchant_id +
      order_id +
      amount +
      currency +
      md5(merchant_secret).toString().toUpperCase()
  )
    .toString()
    .toUpperCase();

  const form = document.createElement("form");
  form.method = "post";
  form.action = "https://sandbox.payhere.lk/pay/checkout";

  const fields = {
    merchant_id,
    return_url: "http://localhost:5173/dashboard",
    cancel_url: "http://localhost:5173/dashboard",
    notify_url: "http://localhost:5000/api/payment/notify",
    order_id,
    items: "Online T-Shirt Order",
    currency,
    amount,
    first_name: data.customerName,
    last_name: "Customer",
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: "Colombo",
    country: "Sri Lanka",
    hash,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export default PaymentGateway;
