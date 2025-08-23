import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/announcements');
        setAnnouncements(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      setAnnouncements(announcements.filter(announcement => announcement._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading announcements...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
        <button
          onClick={() => navigate('/addAnnouncement')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Add New Announcement
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <tr key={announcement._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{announcement.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{announcement.content.substring(0, 50)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/editAnnouncement/${announcement._id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnnouncementPage;