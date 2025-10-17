import React from 'react';

const PaymentSuccess = ({ paymentDetails }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-2">Payment Details</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Amount:</span> ₹{paymentDetails.amount / 100}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Payment ID:</span> {paymentDetails.paymentId}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Order ID:</span> {paymentDetails.orderId}
            </p>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;