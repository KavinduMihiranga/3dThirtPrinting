import React, { useEffect, useState } from 'react';
import Sidebar from '../../home/components/Sidebar.jsx';
import { ArrowLeft } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard() {
    const [admin, setAdmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [adminPerPage, setAdminsPerPage] = useState(10);

    // Get the auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('adminToken');
    };

    // Configure axios to include the token in requests
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    // Add request interceptor to include token
    api.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle token errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    // ✅ Export admin as Excel file
    const exportToExcel = () => {
        if (!admin || admin.length === 0) {
            alert("No data available to export!");
            return;
        }

        const dataToExport = admin.map((a, index) => ({
            "No": index + 1,
            "Username": a.username || 'N/A',
            "Email": a.email || 'N/A',
            "Phone": a.phone || 'N/A',
            "NIC": a.nic || 'N/A',
            "Role": a.role || 'N/A',
            "Status": a.status || 'Active',
            "Created Date": a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Admins");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Admins_Report.xlsx");
    };

    useEffect(() => {
        // Check if user is authenticated
        const token = getAuthToken();
        if (!token) {
            navigate('/login');
            return;
        }
        getAdmins();  
    }, [navigate]);

    const getAdmins = async () => {
        try {
            console.log('🔐 Fetching admins with token...');
            const res = await api.get("/admin");
            console.log('✅ Admins data received:', res.data);
            setAdmin(res.data.data || []);
            setLoading(false);
        } catch(error) {
            console.error("❌ Error fetching Admin:", error);
            console.error("❌ Error response:", error.response?.data);
            
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Admin?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/admin/${id}`);
            alert("Admin deleted successfully!");
            getAdmins();
        } catch (error) {
            console.error("Delete Error:", error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
                navigate('/login');
            } else {
                alert("Failed to delete admin.");
            }
        }
    };

    // FIXED: Safe search filter
    const filteredAdmins = admin.filter(admin => {
        if (!admin) return false;
        
        const searchableFields = [
            admin.username || '',
            admin.email || '',
            admin.name || '',
            admin.phone || '',
            admin.nic || '',
            admin.role || ''
        ];
        
        return searchableFields.some(field => 
            field.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Pagination logic
    const indexOfLastAdmin = currentPage * adminPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <ArrowLeft 
                            size={24} 
                            className="mr-3 text-gray-500 cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        Admin Management
                    </h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={exportToExcel}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                            Export Excel
                        </button>
                        <button 
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                            onClick={() => navigate("/addAdmin")}
                        >
                            Add New Admin
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search by username, email, phone..."
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Username</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Phone</th>
                                <th className="py-3 px-6 text-left">NIC</th>
                                <th className="py-3 px-6 text-left">Role</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Loading Admins...</td>
                                </tr>
                            ) : currentAdmins.length > 0 ? (
                                currentAdmins.map((admin) => (
                                    <tr key={admin._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left">
                                            <button 
                                                className="text-blue-500 hover:underline"
                                                onClick={() => navigate(`/admin/${admin._id}`)}
                                            >
                                                {admin.username || 'N/A'}
                                            </button>
                                        </td>
                                        <td className="py-3 px-6 text-left">{admin.email || 'N/A'}</td>
                                        <td className="py-3 px-6 text-left">{admin.phone || 'N/A'}</td>
                                        <td className="py-3 px-6 text-left">{admin.nic || 'N/A'}</td>
                                        <td className="py-3 px-6 text-left">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                admin.role === 'superadmin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {admin.role || 'admin'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                (admin.status === 'Active' || !admin.status) 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {admin.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center space-x-2">
                                            <button 
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => navigate(`/addAdmin/${admin._id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(admin._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-400">
                                        {searchTerm ? "No matching admin found" : "No Admins available"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: Math.ceil(filteredAdmins.length / adminPerPage) }, (_, i) => (
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