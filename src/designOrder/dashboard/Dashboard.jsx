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

  const exportToExcel = () => {
    if (inquiries.length === 0) {
      alert("No data available to export!");
      return;
    }

    const dataToExport = inquiries.map((inq, index) => ({
      No: index + 1,
      "Customer Name": inq.customerName,
      Email: inq.email,
      Phone: inq.phone,
      Description: inq.description,
      Status: inq.status,
      Price: inq.price || "N/A",
      "Created Date": new Date(inq.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Design_Inquiries");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Design_Inquiry_Report.xlsx");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredInquiries = [...inquiries]
    .filter((inq) =>
      [inq.customerName, inq.email, inq.description]
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
      <div className="flex-1 bg-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ArrowLeft size={24} className="mr-3 text-gray-500" />
            Design Order Management
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Export Excel
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by customer name, email, or description..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>
        </div>

        {/* Inquiry Cards */}
        {paginatedInquiries.length > 0 ? (
          <div className="space-y-4">
            {paginatedInquiries.map((inq) => (
              <div
                key={inq._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {inq.customerName}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {inq.email} | {inq.phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <select
                      value={inq.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(inq._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-gray-50 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(inq.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-2">
                  {inq.designPreview && (
                    <img
                      src={inq.designPreview}
                      alt="Design"
                      className="w-16 h-16 object-contain rounded border"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-700">{inq.description}</p>
                    {inq.price && (
                      <p className="text-sm text-green-700 font-semibold mt-1">
                        Price: ${inq.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/designOrderDetails/${inq._id}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No design inquiries found.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
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
        )}
      </div>
    </div>
  );
}

export default Dashboard;
