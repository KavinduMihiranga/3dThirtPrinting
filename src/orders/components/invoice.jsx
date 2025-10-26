import React from "react";

const Invoice = ({ order }) => {
  const {
    orderId,
    customerName,
    email,
    phone,
    address,
    items,
    totalAmount,
    paymentStatus,
    date,
  } = order;

  return (
    <div className="max-w-2xl mx-auto p-6 border shadow-lg bg-white mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">🧾 Invoice</h2>

      <div className="mb-4">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Status:</strong> {paymentStatus}</p>
      </div>

      <div className="mb-4">
        <p><strong>Customer:</strong> {customerName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Address:</strong> {address}</p>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="p-2">{item.name}</td>
              <td className="p-2 text-right">{item.qty}</td>
              <td className="p-2 text-right">LKR {item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-4">
        <p className="text-lg font-semibold">Total: LKR {totalAmount}</p>
      </div>
    </div>
  );
};

export default Invoice;
