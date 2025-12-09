import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditAnnouncement() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendEmail, setResendEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/announcements/${id}`);
        setFormData({
          title: response.data.title,
          content: response.data.content
        });
      } catch (err) {
        setError(err.message || 'Failed to load announcement');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // If resendEmail is checked, show confirmation
      if (resendEmail) {
        const shouldResend = window.confirm(
          `📧 Resend Updated Announcement to All Customers?\n\n` +
          `This updated announcement will be sent to ALL registered customers.\n\n` +
          `Title: ${formData.title}\n` +
          `✅ Customers will see this as an updated announcement\n` +
          `Are you sure you want to resend?`
        );
        
        if (!shouldResend) {
          setIsSubmitting(false);
          return;
        }
      }

      const response = await axios.put(
        `http://localhost:5000/api/announcements/${id}`, 
        { ...formData, resendEmail }
      );

      setSuccess(true);
      
      if (resendEmail && response.data.emailSent) {
        setTimeout(() => {
          alert(
            `✅ Announcement Updated Successfully!\n\n` +
            `✏️ Announcement has been updated\n` +
            `📧 Email resent to ${response.data.recipientsCount || 'all'} customers\n` +
            `Customers have been notified of the update!`
          );
          navigate('/announcements');
        }, 500);
      } else {
        setTimeout(() => {
          alert('✅ Announcement updated successfully!');
          navigate('/announcements');
        }, 500);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update announcement');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="page-title">
              ✏️ Edit Announcement
            </h1>
            <p className="text-gray-600">
              Update your announcement details
            </p>
          </div>
          <button
            onClick={() => navigate('/announcements')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Announcements
          </button>
        </div>
      </div>
      
      {error && (
        <div 
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
          data-testid="error-message"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div 
          className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded"
          data-testid="success-message"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700">
              Announcement updated successfully! Redirecting...
            </span>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">💡 Editing Tips</h2>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Check for typos and formatting issues</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Ensure information is accurate and up-to-date</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Consider if customers need to be notified of the changes</span>
          </li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl overflow-hidden" data-testid="announcement-form">
        <div className="p-8">
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Announcement Title *
              </span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              data-testid="title-input"
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
                Announcement Content *
              </span>
            </label>
            <textarea
              id="content"
              name="content"
              rows="10"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              data-testid="content-textarea"
            />
          </div>
          
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="resendEmail"
                  checked={resendEmail}
                  onChange={(e) => setResendEmail(e.target.checked)}
                  className="mt-1 mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="resendEmail" className="block text-lg font-medium text-gray-800 mb-2">
                    📧 Resend to All Customers
                  </label>
                  <p className="text-gray-600 mb-3">
                    Check this box if you want to send the updated announcement to all customers via email.
                    Customers will receive a special "Updated Announcement" email.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> This will send an email to <strong>all registered customers</strong> 
                      with the updated announcement. Use this when changes are important and customers need to be notified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">What happens when you resend?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Customers receive a new email with "UPDATED" badge</li>
              <li>• Email shows previous title for reference</li>
              <li>• Special highlighting for updated content</li>
              <li>• All registered customers receive the email</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/announcements')}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
              data-testid="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <div className="space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : resendEmail 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500'
                    : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:ring-blue-500'
                }`}
                data-testid="update-button"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                    {resendEmail ? 'Updating & Sending...' : 'Updating...'}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {resendEmail ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Update & Resend to All
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Update Announcement
                      </>
                    )}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Preview Section */}
      <div className="mt-12 bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h2 className="text-xl font-semibold">
            {resendEmail ? '📧 Updated Email Preview' : '✏️ Edit Preview'}
          </h2>
          <p className="text-purple-100 mt-1">
            {resendEmail 
              ? 'How your updated announcement will look to customers' 
              : 'Preview your changes'}
          </p>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[300px]">
            <div className="space-y-4">
              {resendEmail ? (
                <>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{formData.title}</h3>
                        <p className="text-indigo-100 text-sm mt-1">🔄 Updated Announcement - Kavindu T-Shirt Printing</p>
                      </div>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        UPDATED
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-700">
                      <strong>Important Update:</strong> This announcement has been updated with new information.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 rounded-lg">
                  <h3 className="font-bold text-lg">{formData.title || "Announcement Title"}</h3>
                  <p className="text-blue-100 text-sm mt-1">From: Kavindu T-Shirt Printing</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {formData.content || "Your updated announcement content will appear here..."}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm text-gray-600">
                  {resendEmail 
                    ? "This updated announcement will be sent to all registered customers."
                    : "Save changes to update this announcement in the system."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAnnouncement;