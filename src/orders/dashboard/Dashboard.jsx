import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ✅ Export Order as Excel file
const exportToExcel = () => {
  if (!orders || orders.length === 0) {
    alert("No data available to export!");
    return;
  }

  // Convert orders objects into sheet data
  const dataToExport = orders.map((a, index) => ({
    "No": index + 1,
    "Customer Name": a.customerName,
    "T-Shirt Name": a.tShirtName,
    "Address": a.address,
    "Qty": a.qty,
    "Date": a.date,
    "Status": a.status,
    "Created Date": new Date(a.createdAt).toLocaleDateString(),
  }));

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "orders");

  // Convert workbook to binary and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Orders_Report.xlsx");
};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/order`);
        console.log("✅ Orders fetched:", res.data.data);
        setOrders(res.data.data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    console.log("Delete button clicked for ID:", id);
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/order/${id}`);
      alert("Order deleted successfully!");
      // Refresh orders
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("❌ Delete Error:", error);
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ArrowLeft size={24} className="mr-3 text-gray-500" />
          Order Management
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
             >
            Export Excel
         </button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
          <a href="/addOrder" className="flex items-center">
            Add New Order
          </a>
        </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">T-shirt Name</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-left">Qty</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {order.customerName}
                  </td>
                  <td className="py-3 px-6 text-left">{order.tShirtName}</td>
                  <td className="py-3 px-6 text-left">{order.address}</td>
                  <td className="py-3 px-6 text-left">{order.qty}</td>
                  <td className="py-3 px-6 text-center">{order.date}</td>
                  <td className="py-3 px-6 text-center">{order.status}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => navigate(`/addOrder/${order._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-12 px-6 text-center text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
