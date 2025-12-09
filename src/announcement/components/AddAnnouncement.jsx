import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function AddAnnouncement() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  setError(null);
  
  // Optional: Show confirmation dialog
  const shouldSendEmails = window.confirm(
      "📢 This announcement will be sent to ALL customers via email.\n\n" +
      "Make sure your announcement is:\n" +
      "✅ Clear and professional\n" +
      "✅ Free of errors\n" +
      "✅ Relevant to all customers\n\n" +
      "Are you ready to send this announcement?"
  );
  
  if (!shouldSendEmails) {
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/announcements', 
      formData
    );
    
    // Show success message with recipient count
    alert(`Announcement created successfully! Emails sent to ${response.data.recipientsCount || 'all'} customers.`);
    
    navigate('/announcements');
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6" data-testid="page-title">Add New Announcement</h1>
      
      {error && (
        <div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          data-testid="error-message"
        >
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6" data-testid="announcement-form">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            data-testid="title-input"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            data-testid="content-textarea"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            data-testid="save-button"
          >
            Save Announcement
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAnnouncement;