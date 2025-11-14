import React, { useEffect, useState } from "react";
import Sidebar from "../../home/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard() {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [customerPerPage, setCustomersPerPage] = useState(10); // You can adjust this number

// ✅ Export customer as Excel file
// const exportToExcel = () => {
//   if (!customer || customer.length === 0) {
//     alert("No data available to export!");
//     return;
//   }

//   // Convert announcement objects into sheet data
//   const dataToExport = customer.map((a, index) => ({
//     "No": index + 1,
//     "Name": a.name,
//     "Email": a.email,
//     "Phone": a.phone,
//     "Address": a.addressLine1,
//     "Status": a.status,
//     "Created Date": new Date(a.createdAt).toLocaleDateString(),
//   }));

//   // Create worksheet and workbook
//   const workbook = XLSX.utils.book_new();

//       // Start with headers and title - ALL IN ONE ARRAY
//     const worksheetData = [
//         ["Kavindu T-Shirt Printing"],
//         ["Customer Management Report"],
//         [`Generated on: ${new Date().toLocaleDateString()}`],
//         [], // Empty row for spacing
//         Object.keys(dataToExport[0]), // Column headers
//         ...dataToExport.map(row => Object.values(row)) // Data rows
//     ];

//   // const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//   // XLSX.utils.book_append_sheet(workbook, worksheet, "customer");

//   // // Convert workbook to binary and trigger download
//   // const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//   // const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//   // saveAs(data, "Customer_Report.xlsx");

//       // Create worksheet from the complete data array
//       const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
//       // Merge cells for headers
//       if (!worksheet['!merges']) worksheet['!merges'] = [];
//       worksheet['!merges'].push(
//           { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Company name
//           { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Report title
//           { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }  // Generated date
//       );
//      // Style the header rows (A1, A2, A3)
//     ['A1', 'A2', 'A3'].forEach(cell => {
//         if (!worksheet[cell]) worksheet[cell] = { t: 's' };
//         worksheet[cell].s = {
//             font: { bold: true, color: { rgb: "FFFFFF" } },
//             fill: { fgColor: { rgb: "4F81BD" } },
//             alignment: { horizontal: "center" }
//         };
//     });

//     // Style the column headers (row 5, which is index 4)
//     const headerRowIndex = 4;
//     for (let col = 0; col < Object.keys(dataToExport[0]).length; col++) {
//         const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
//         if (!worksheet[cellRef]) worksheet[cellRef] = { t: 's' };
//         worksheet[cellRef].s = {
//             font: { bold: true },
//             fill: { fgColor: { rgb: "DCE6F1" } },
//             alignment: { horizontal: "center" },
//             border: {
//                 top: { style: 'thin', color: { rgb: "000000" } },
//                 left: { style: 'thin', color: { rgb: "000000" } },
//                 bottom: { style: 'thin', color: { rgb: "000000" } },
//                 right: { style: 'thin', color: { rgb: "000000" } }
//             }
//         };
//     }
  
//       // Style data rows
//       const dataStartRow = headerRowIndex + 1;
//       const dataEndRow = dataStartRow + dataToExport.length - 1;
      
//       for (let row = dataStartRow; row <= dataEndRow; row++) {
//           for (let col = 0; col < Object.keys(dataToExport[0]).length; col++) {
//               const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
//               if (worksheet[cellRef]) {
//                   if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
//                   worksheet[cellRef].s.border = {
//                       top: { style: 'thin', color: { rgb: "000000" } },
//                       left: { style: 'thin', color: { rgb: "000000" } },
//                       bottom: { style: 'thin', color: { rgb: "000000" } },
//                       right: { style: 'thin', color: { rgb: "000000" } }
//                   };
//               }
//           }
//       }
//      // Set column widths
//     worksheet['!cols'] = [
//         { wch: 5 },  // No
//         { wch: 15 }, // Username
//         { wch: 25 }, // Email
//         { wch: 15 }, // Phone
//         { wch: 15 }, // NIC
//         { wch: 12 }, // Role
//         { wch: 10 }, // Status
//         { wch: 12 }, // Created Date
//     ];
//      // Add the worksheet to the workbook
//      XLSX.utils.book_append_sheet(workbook, worksheet, "Customer");
 
//      // Generate and save the Excel file
//      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
     
//      // Generate filename with current date
//      const dateStamp = new Date().toISOString().split('T')[0];
//      saveAs(data, `Kavindu_TShirt_Printing_Customer_Management_${dateStamp}.xlsx`);      
// };

const exportToExcel = () => {
    if (!customer || customer.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Convert customer objects into sheet data - FIXED: Use address instead of addressLine1
    const dataToExport = customer.map((a, index) => ({
      "No": index + 1,
      "Name": a.name || 'N/A',
      "Email": a.email || 'N/A',
      "Phone": a.phone || 'N/A',
      "Address": a.address || 'N/A', // CHANGED: addressLine1 to address
      "Status": a.status || 'Active',
      "Created Date": a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A',
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Start with headers and title - ALL IN ONE ARRAY
    const worksheetData = [
      ["Kavindu T-Shirt Printing"],
      ["Customer Management Report"],
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
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Company name (6 columns)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Report title (6 columns)
      { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }  // Generated date (6 columns)
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

    // Set column widths - UPDATED for Customer data
    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 30 }, // Address (wider for addresses)
      { wch: 10 }, // Status
      { wch: 12 }, // Created Date
    ];

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer");

    // Generate and save the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    // Generate filename with current date
    const dateStamp = new Date().toISOString().split('T')[0];
    saveAs(data, `Kavindu_TShirt_Printing_Customer_Management_${dateStamp}.xlsx`);
  };


  // Fetch customers
  useEffect(() => {
    getCustomer();
  }, []);

    const getCustomer = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/customer");
            setCustomer(res.data.data || []);
            setLoading(false);
            console.log("Fetched Customers:", res.data.data);
        } catch(error) {
            console.error("Error fetching Customer:", error);
            setLoading(false);
        }
    };

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Customer?");
        if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/customer/${id}`);
      alert("Customer deleted successfully!");
            getCustomer();
    } catch (error) {
      console.error("Delete Error:", error);
        alert("Failed to delete customer.");
    }
  };

   const filteredCustomer = customer.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  // ✅ Return must be inside here
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ArrowLeft size={24} className="mr-3 text-gray-500" />
            Customer Management
          </h1>
          <div className="flex space-x-3">
            <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
             >
            Export Excel
         </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
            <a href="/addCustomer" className="flex items-center">
              Add New Customer
            </a>
          </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Customer..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Contact Number</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : customer.length > 0 ? (
                customer.map((customer, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">{customer.name}</td>
                    <td className="py-3 px-6">{customer.email}</td>
                    <td className="py-3 px-6">{customer.phone}</td>
                    <td className="py-3 px-6">{customer.address}</td>
                    <td className="py-3 px-6">{customer.status}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() =>
                          navigate(`/addCustomer/${customer._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(customer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-400"
                  >
                    No Customer found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
       
      <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: Math.ceil(customer.length / customerPerPage) }, (_, i) => (
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
    </div>
  );
}

export default Dashboard;
