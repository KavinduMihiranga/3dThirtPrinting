import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10); // You can adjust this number


  const filteredOrders = orders.filter(order => 
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tShirtName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);


// ✅ Export Order as Excel file
// const exportToExcel = () => {
//   if (!orders || orders.length === 0) {
//     alert("No data available to export!");
//     return;
//   }

//   // Convert orders objects into sheet data
//   const dataToExport = orders.map((a, index) => ({
//     "No": index + 1,
//     "Customer Name": a.customerName,
//     "T-Shirt Name": a.tShirtName,
//     "Address": a.address,
//     "Qty": a.qty,
//     "Date": a.date,
//     "Status": a.status,
//     "Created Date": new Date(a.createdAt).toLocaleDateString(),
//   }));

//   // Create worksheet and workbook
//   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "orders");

//   // Convert workbook to binary and trigger download
//   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(data, "Orders_Report.xlsx");
// };
// ✅ Export Order as Excel file
const exportToExcel = () => {
  if (!orders || orders.length === 0) {
    alert("No data available to export!");
    return;
  }

  // Convert orders objects into sheet data
  const dataToExport = orders.map((a, index) => ({
    "No": index + 1,
    "Customer Name": a.customerName || 'N/A',
    "T-Shirt Name": a.tShirtName || 'N/A',
    "Address": a.address || 'N/A',
    "Qty": a.qty || 'N/A',
    "Date": a.date || 'N/A',
    "Status": a.status || 'Pending',
    "Created Date": a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A',
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Start with headers and title - ALL IN ONE ARRAY
  const worksheetData = [
    ["Kavindu T-Shirt Printing"],
    ["Order Management Report"],
    [`Generated on: ${new Date().toLocaleDateString()}`],
    [], // Empty row for spacing
    Object.keys(dataToExport[0]), // Column headers
    ...dataToExport.map(row => Object.values(row)) // Data rows
  ];

  // Create worksheet from the complete data array
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Merge cells for headers
  if (!worksheet['!merges']) worksheet['!merges'] = [];
  worksheet['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Company name (7 columns)
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Report title (7 columns)
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }  // Generated date (7 columns)
  );

  // Style the header rows (A1, A2, A3)
  ['A1', 'A2', 'A3'].forEach(cell => {
    if (!worksheet[cell]) worksheet[cell] = { t: 's' };
    worksheet[cell].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center" }
    };
  });

  // Style the column headers (row 5, which is index 4)
  const headerRowIndex = 4;
  for (let col = 0; col < Object.keys(dataToExport[0]).length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { t: 's' };
    worksheet[cellRef].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "DCE6F1" } },
      alignment: { horizontal: "center" },
      border: {
        top: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
      }
    };
  }

  // Style data rows
  const dataStartRow = headerRowIndex + 1;
  const dataEndRow = dataStartRow + dataToExport.length - 1;
  
  for (let row = dataStartRow; row <= dataEndRow; row++) {
    for (let col = 0; col < Object.keys(dataToExport[0]).length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[cellRef]) {
        if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
        worksheet[cellRef].s.border = {
          top: { style: 'thin', color: { rgb: "000000" } },
          left: { style: 'thin', color: { rgb: "000000" } },
          bottom: { style: 'thin', color: { rgb: "000000" } },
          right: { style: 'thin', color: { rgb: "000000" } }
        };
      }
    }
  }

  // Set column widths for Order data
  worksheet['!cols'] = [
    { wch: 5 },   // No
    { wch: 20 },  // Customer Name
    { wch: 20 },  // T-Shirt Name
    { wch: 30 },  // Address
    { wch: 8 },   // Qty
    { wch: 12 },  // Date
    { wch: 12 },  // Status
    { wch: 12 },  // Created Date
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
  // Generate filename with current date
  const dateStamp = new Date().toISOString().split('T')[0];
  saveAs(data, `Kavindu_TShirt_Printing_Order_Management_${dateStamp}.xlsx`);
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
 // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
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
          placeholder="Search Order..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

{/* Rows per page selector */}
      <div className="mb-4 flex items-center justify-end space-x-2">
        <label htmlFor="rowsPerPage" className="text-sm text-gray-600 font-medium">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={ordersPerPage}
          onChange={(e) => {
            setOrdersPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
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
            ) : currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
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
                   {searchTerm ? "No orders match your search." : "No orders found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === i + 1
              ? "bg-green-600 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

    </div>
  );
}

export default Dashboard;
