import React, { useEffect, useState } from 'react';
import Sidebar from '../../home/components/Sidebar.jsx';
import { ArrowLeft } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [admin, setAdmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getAdmins();  
    }, []);

    const getAdmins = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin");
            setAdmin(res.data.data || []);
            setLoading(false);
        } catch(error) {
            console.error("Error fetching Admin:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Admin?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/${id}`);
            alert("Admin deleted successfully!");
            getAdmins();
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete admin.");
        }
    };

    const filteredAdmins = admin.filter(admin => 
        admin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <button 
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                        onClick={() => navigate("/addAdmin")}
                    >
                        Add New Admin
                    </button>
                </div>

                <div className="mb-6 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search Admin..."
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Phone</th>
                                <th className="py-3 px-6 text-left">NIC</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Loading Admins...</td>
                                </tr>
                            ) : filteredAdmins.length > 0 ? (
                                filteredAdmins.map((admin) => (
                                    <tr key={admin._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left">
                                            <button 
                                                className="text-blue-500 hover:underline"
                                                onClick={() => navigate(`/admin/${admin._id}`)}
                                            >
                                                {admin.name}
                                            </button>
                                        </td>
                                        <td className="py-3 px-6 text-left">{admin.email}</td>
                                        <td className="py-3 px-6 text-left">{admin.phone}</td>
                                        <td className="py-3 px-6 text-left">{admin.nic}</td>
                                        <td className="py-3 px-6 text-left">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                admin.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {admin.status}
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
                                    <td colSpan="6" className="text-center py-4 text-gray-400">
                                        {searchTerm ? "No matching admin found" : "No Admins available"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center mt-6 text-gray-600">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        disabled
                    >
                        &lt;
                    </button>
                    <span className="mx-2">1 / 10</span>
                    <button className="p-2 rounded-lg hover:bg-gray-200">
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;