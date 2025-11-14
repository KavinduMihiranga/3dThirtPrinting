import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../home/components/Sidebar.jsx';
import { ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Export announcements as Excel file
  // const exportToExcel = () => {
  //   if (!announcements || announcements.length === 0) {
  //     alert("No data available to export!");
  //     return;
  //   }

  //   const dataToExport = announcements.map((a, index) => ({
  //     "No": index + 1,
  //     "Title": a.title,
  //     "Content": a.content,
  //     "Created Date": new Date(a.createdAt).toLocaleDateString(),
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Announcements");

  //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(data, "Announcements_Report.xlsx");
  // };

  // ✅ Export announcements as Excel file
const exportToExcel = () => {
  if (!announcements || announcements.length === 0) {
    alert("No data available to export!");
    return;
  }

  // Convert announcement objects into sheet data
  const dataToExport = announcements.map((a, index) => ({
    "No": index + 1,
    "Title": a.title || 'N/A',
    "Content": a.content || 'N/A',
    "Created Date": a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A',
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Start with headers and title - ALL IN ONE ARRAY
  const worksheetData = [
    ["Kavindu T-Shirt Printing"],
    ["Announcement Management Report"],
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
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Company name (3 columns)
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // Report title (3 columns)
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } }  // Generated date (3 columns)
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

  // Set column widths for Announcement data
  worksheet['!cols'] = [
    { wch: 5 },   // No
    { wch: 25 },  // Title
    { wch: 50 },  // Content (wider for announcement content)
    { wch: 12 },  // Created Date
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Announcements");

  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
  // Generate filename with current date
  const dateStamp = new Date().toISOString().split('T')[0];
  saveAs(data, `Kavindu_TShirt_Printing_Announcement_Management_${dateStamp}.xlsx`);
};

  // ✅ Fetch announcements from backend
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

  // ✅ Delete an announcement
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading announcements...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Sidebar Section */}
      <Sidebar />

      {/* ✅ Main Content Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ArrowLeft
              size={24}
              className="mr-3 text-gray-500 cursor-pointer"
              onClick={() => navigate(-1)}
              data-testid="back-button"
            />
            Announcement Management
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={exportToExcel}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              data-testid="export-excel-button"
            >
              Export Excel
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              onClick={() => navigate('/addAnnouncement')}
              data-testid="add-announcement-button"
            >
              Add New Announcement
            </button>
          </div>
        </div>

        {/* ✅ Announcement Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden" data-testid="announcements-table">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200" data-testid="announcements-tbody">
              {announcements.length === 0 ? (
                <tr data-testid="no-announcements-row">
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No announcements found.
                  </td>
                </tr>
              ) : (
                announcements.map((announcement, index) => (
                  <tr key={announcement._id} data-testid={`announcement-row-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {announcement.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {announcement.content.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/editAnnouncements/${announcement._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        data-testid={`edit-button-${index}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="text-red-600 hover:text-red-900"
                        data-testid={`delete-button-${index}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;