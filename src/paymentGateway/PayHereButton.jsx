import React, { useEffect } from "react";

const PayHereButton = ({ orderData }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePay = () => {
    const payment = {
      sandbox: true,
      merchant_id: orderData.merchantId,
      return_url: "http://localhost:5173/payment/success",
      cancel_url: "http://localhost:5173/payment/cancel",
      notify_url: "http://localhost:5000/api/order/notify",
      order_id: orderData.orderId,
      items: "Online T-Shirt Order",
      amount: orderData.amount,
      currency: orderData.currency,
      first_name: orderData.customerName,
      last_name: "",
      email: "kavindu@example.com",
      phone: "0771234567",
      address: orderData.address,
      city: "Colombo",
      country: "Sri Lanka",
    };

    if (window.payhere) {
      window.payhere.startPayment(payment);
    } else {
      alert("PayHere SDK not loaded yet. Please wait a few seconds.");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">
        Order ID: {orderData.orderId}
      </h2>
      <button
        onClick={handlePay}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Pay with PayHere
      </button>
    </div>
  );
};

export default PayHereButton;
