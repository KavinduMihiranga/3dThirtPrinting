// ContactUsManagement.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../home/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Download } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ContactUsManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const contactsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contact-us");
        if (res.data.data && Array.isArray(res.data.data)) {
          const sortedData = [...res.data.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setContacts(sortedData);
        } else {
          setContacts([]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    getContacts();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/contact-us/${id}`, {
        status: newStatus,
      });
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, status: newStatus } : contact
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      await axios.put(`http://localhost:5000/api/contact-us/${id}`, {
        priority: newPriority,
      });
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, priority: newPriority } : contact
        )
      );
    } catch (error) {
      console.error("Error updating priority:", error);
      alert("Failed to update priority. Please try again.");
    }
  };

  const exportToExcel = () => {
    if (contacts.length === 0) {
      alert("No data available to export!");
      return;
    }

    const dataToExport = contacts.map((contact, index) => ({
      No: index + 1,
      "Customer Name": contact.name,
      Email: contact.email,
      Phone: contact.phone,
      Subject: contact.subject,
      Message: contact.message,
      Quantity: contact.quantity || "N/A",
      Address: contact.address || "N/A",
      Status: contact.status,
      Priority: contact.priority,
      "Assigned To": contact.assignedTo || "N/A",
      "Created Date": new Date(contact.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact_Us_Requests");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Contact_Us_Requests_Report.xlsx");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'spam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts
    .filter((contact) => {
      const matchesSearch = [contact.name, contact.email, contact.subject, contact.message]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  if (loading)
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-gray-600">Loading contact requests...</div>
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
            Contact Us Management
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
          >
            <Download size={18} className="mr-2" />
            Export Excel
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="spam">Spam</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Contact Cards */}
        {paginatedContacts.length > 0 ? (
          <div className="space-y-4">
            {paginatedContacts.map((contact) => (
              <div
                key={contact._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {contact.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(contact.status)}`}>
                        {contact.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(contact.priority)}`}>
                        {contact.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Mail size={14} className="mr-2" />
                        {contact.email}
                      </div>
                      <div className="flex items-center">
                        <Phone size={14} className="mr-2" />
                        {contact.phone}
                      </div>
                      {contact.address && (
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-2" />
                          {contact.address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(contact.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Subject and Message */}
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700 mb-1">{contact.subject}</h4>
                  <p className="text-gray-600 text-sm">{contact.message}</p>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  {contact.quantity && (
                    <span>Quantity: {contact.quantity}</span>
                  )}
                  {contact.assignedTo && (
                    <span>Assigned to: {contact.assignedTo}</span>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <select
                      value={contact.status || "new"}
                      onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="spam">Spam</option>
                    </select>
                    
                    <select
                      value={contact.priority || "medium"}
                      onChange={(e) => handlePriorityChange(contact._id, e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <button
                  onClick={() => navigate(`/contactUsDetails/${contact._id}`)} // Changed from /contact-us/ to /contactUsDetails/
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  View Details
                </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No contact requests found.
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
                    ? "bg-blue-600 text-white"
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

export default ContactUsManagement;