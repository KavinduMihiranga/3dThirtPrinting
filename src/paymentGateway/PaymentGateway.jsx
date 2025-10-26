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
    console.log("📧 Email:", state.email);
    console.log("📱 Phone:", state.phone);
if (!state.email || !state.phone) {
      alert("Missing email or phone number. Please check your details.");
      return;
    }

console.log("🟢 State Details", state);
    const orderData = {
    customerName: state.name,
    tShirtName: state.cartItems.map((item) => item.name).join(", "),
    address: "Colombo, Sri Lanka",
    qty: state.cartItems.reduce((total, item) => total + (item.qty || 1), 0),
    date: new Date().toISOString(),
    status:"Pending",
    amount: state.totalAmount,
    email: state.email || "kavindutest0001@gmail.com",
    phone: state.phone || "0769622981",

  };

    console.log("🟢 Sending order data:", orderData);

    try {
      setLoading(true);
      // ✅ Normally you would send this to your backend:
      const res = await axios.post("http://localhost:5000/api/order", orderData);
      const orderId = res?.data?.data?._id || "TEMP123";
      console.log("🟢 Order created with ID:", orderId);
      // ✅ Simulate success
      setFormValue({
      ...state,
      orderId,
      totalAmount: state.totalAmount,
      customerName: state.name,
      email: state.email || "kavindutest0001@gmail.com",
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
  console.log("🟢 Preparing payment form:", data);

  const merchant_id = "1232456";
  const merchant_secret = "ODU1OTkzODQyMjMwNDc0MjQ2NTIxOTcxNzIzNjcxNDY1OTE4MzE=";

  const order_id = data.orderId || "TEMP123";
  const amount = parseFloat(data.totalAmount).toFixed(2); 
  const currency = "LKR";

  // ✅ Hash generation (exactly as per PayHere docs)
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
  form.method = "POST";
  form.action = "https://sandbox.payhere.lk/pay/checkout";

  const fields = {
    merchant_id,
    return_url: "http://localhost:5173/payment-success", //db status eka update wenna one
    cancel_url: "http://localhost:5173/dashboard",
    notify_url: "http://localhost:5173/dashboard",
    order_id,
    items: "Online T-Shirt Order",
    currency,
    amount,
    first_name: data.customerName,
    last_name: "Customer",
    email: data.email,
    phone: data.phone,
    address: "Test Address",
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
