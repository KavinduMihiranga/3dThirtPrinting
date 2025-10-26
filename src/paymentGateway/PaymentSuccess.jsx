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
        // navigate("/dashboard");
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
