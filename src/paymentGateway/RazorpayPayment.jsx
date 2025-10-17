import React, { useEffect } from 'react';

const RazorpayPayment = ({ orderDetails, onSuccess, onClose }) => {
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const displayRazorpay = async () => {
      const res = await loadRazorpayScript();
      
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: 'Your Company Name',
        description: orderDetails.description,
        order_id: orderDetails.id,
        handler: function (response) {
          onSuccess(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
      paymentObject.open();
    };

    displayRazorpay();
  }, [orderDetails, onSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Redirecting to Payment Gateway</h3>
        <p className="text-gray-600">Please wait while we redirect you to the secure payment page...</p>
      </div>
    </div>
  );
};

export default RazorpayPayment;