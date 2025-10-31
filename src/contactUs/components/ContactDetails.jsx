// ContactDetails.jsx (or ContactUsDetails.jsx - make sure the filename matches your import)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, MessageSquare } from "lucide-react";
import axios from "axios";

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contact-us/${id}`);
        setContact(res.data.data);
        setNotes(res.data.data.notes || "");
      } catch (error) {
        console.error("Error fetching contact:", error);
        setError("Failed to load contact details");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/contact-us/${id}`, {
        status: newStatus,
        notes: notes,
      });
      setContact({ ...contact, status: newStatus });
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await axios.put(`http://localhost:5000/api/contact-us/${id}`, {
        priority: newPriority,
        notes: notes,
      });
      setContact({ ...contact, priority: newPriority });
      alert("Priority updated successfully!");
    } catch (error) {
      console.error("Error updating priority:", error);
      alert("Failed to update priority");
    }
  };

  const handleNotesSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/contact-us/${id}`, {
        notes: notes,
      });
      alert("Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-4 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Contacts
        </button>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Contact</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center py-12">
          <p className="text-gray-600">Contact not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/contactUsManagement")}
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Contacts
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{contact.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(contact.status)}`}>
                {contact.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(contact.priority)}`}>
                {contact.priority}
              </span>
            </div>
            <p className="text-gray-600 text-lg">{contact.subject}</p>
          </div>
          <div className="flex gap-2">
            <select
              value={contact.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="spam">Spam</option>
            </select>
            <select
              value={contact.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <User className="mr-2" size={20} />
              Contact Information
            </h2>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{contact.phone}</p>
                </div>
              </div>
              {contact.address && (
                <div className="flex items-center">
                  <MapPin size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{contact.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Calendar size={16} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium">{new Date(contact.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
              <MessageSquare className="mr-2" size={20} />
              Message
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {(contact.quantity || contact.designFile) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Additional Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {contact.quantity && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 block mb-1">Quantity</label>
                  <p className="font-medium text-lg">{contact.quantity}</p>
                </div>
              )}
              {contact.designFile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 block mb-1">Design File</label>
                  <a 
                    href={`http://localhost:5000${contact.designFile}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    View Design File
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Internal Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add internal notes here..."
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleNotesSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactDetails;