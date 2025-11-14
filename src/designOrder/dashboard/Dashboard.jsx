import React, { useEffect, useState } from "react";
import Sidebar from "../../home/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Dashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const getInquiries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/design-inquiry");
        if (res.data.data && Array.isArray(res.data.data)) {
          const sortedData = [...res.data.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setInquiries(sortedData);
        } else {
          setInquiries([]);
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    };
    getInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/design-inquiry/${id}`, {
        status: newStatus,
      });
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === id ? { ...inq, status: newStatus } : inq
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // const exportToExcel = () => {
  //   if (inquiries.length === 0) {
  //     alert("No data available to export!");
  //     return;
  //   }

  //   const dataToExport = inquiries.map((inq, index) => ({
  //     No: index + 1,
  //     "Customer Name": inq.customerName,
  //     Email: inq.email,
  //     Phone: inq.phone || "N/A",
  //     Description: inq.description,
  //     "Total Items": inq.totalItems || 0,
  //     "Total Price": inq.totalPrice ? `Rs ${inq.totalPrice}` : "N/A",
  //     Status: inq.status,
  //     Price: inq.price ? `Rs ${inq.price}` : "N/A",
  //     "Created Date": new Date(inq.createdAt).toLocaleString(),
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Design_Inquiries");

  //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(data, "Design_Inquiry_Report.xlsx");
  // };

  const exportToExcel = () => {
  if (inquiries.length === 0) {
    alert("No data available to export!");
    return;
  }

  // Convert inquiry objects into sheet data
  const dataToExport = inquiries.map((inq, index) => ({
    No: index + 1,
    "Customer Name": inq.customerName || 'N/A',
    Email: inq.email || 'N/A',
    Phone: inq.phone || "N/A",
    Description: inq.description || 'N/A',
    "Total Items": getTotalItems(inq),
    "Total Price": inq.totalPrice ? `Rs ${inq.totalPrice}` : "N/A",
    "T-Shirt Price": inq.price ? `Rs ${inq.price}` : "N/A",
    "T-Shirt Color": inq.tshirtColor || 'N/A',
    Status: inq.status || 'pending',
    "Created Date": inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'N/A',
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Start with headers and title - ALL IN ONE ARRAY
  const worksheetData = [
    ["Kavindu T-Shirt Printing"],
    ["Design Order Management Report"],
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
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Company name (9 columns)
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Report title (9 columns)
    { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }  // Generated date (9 columns)
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

  // Set column widths for Design Order data
  worksheet['!cols'] = [
    { wch: 5 },   // No
    { wch: 20 },  // Customer Name
    { wch: 25 },  // Email
    { wch: 15 },  // Phone
    { wch: 40 },  // Description (wider for design descriptions)
    { wch: 12 },  // Total Items
    { wch: 15 },  // Total Price
    { wch: 15 },  // T-Shirt Price
    { wch: 15 },  // T-Shirt Color
    { wch: 12 },  // Status
    { wch: 20 },  // Created Date
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Design_Orders");

  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
  // Generate filename with current date
  const dateStamp = new Date().toISOString().split('T')[0];
  saveAs(data, `Kavindu_TShirt_Printing_Design_Order_Management_${dateStamp}.xlsx`);
};

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Parse design data to get total items
  const getTotalItems = (inquiry) => {
    if (inquiry.totalItems) return inquiry.totalItems;
    if (inquiry.designData && inquiry.designData.totalItems) return inquiry.designData.totalItems;
    return 0;
  };

  // Parse design data to get sizes
  const getSizesSummary = (inquiry) => {
    if (inquiry.sizes) return inquiry.sizes;
    if (inquiry.designData && inquiry.designData.sizes) return inquiry.designData.sizes;
    return {};
  };

  const filteredInquiries = [...inquiries]
    .filter((inq) =>
      [inq.customerName, inq.email, inq.description, inq.phone]
        .filter(Boolean) // Remove null/undefined values
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  if (loading)
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-gray-600">Loading design inquiries...</div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ArrowLeft size={24} className="mr-3 text-gray-500" />
            Design Order Management
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Export Excel
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or description..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Inquiry Cards */}
        {paginatedInquiries.length > 0 ? (
          <div className="space-y-4">
            {paginatedInquiries.map((inq) => {
              const totalItems = getTotalItems(inq);
              const sizes = getSizesSummary(inq);
              
              return (
                <div
                  key={inq._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800">
                        {inq.customerName}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {inq.email} {inq.phone && `| ${inq.phone}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <select
                        value={inq.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(inq._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(inq.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 mb-4">
                    {inq.designPreview && (
                      <img
                        src={inq.designPreview}
                        alt="Design"
                        className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-700 mb-2">{inq.description}</p>
                      
                      {/* Order Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Items:</span>
                          <span className="font-semibold ml-2">{totalItems}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="font-semibold text-green-700 ml-2">
                            {inq.price ? `Rs ${inq.price}` : 'Not set'}
                          </span>
                        </div>
                        {inq.tshirtColor && (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Color:</span>
                            <div 
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: inq.tshirtColor }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Order ID: {inq._id}
                    </div>
                    <button
                      onClick={() => navigate(`/designOrderDetails/${inq._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-lg">No design inquiries found.</p>
            {searchTerm && (
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;