import React, {useEffect, useState} from 'react';
import { ArrowLeft } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Dashboard(props) {

    const [order, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getOrder();  
    },[]);

    const getOrder = async() => {
        try {
        const res = await axios.get("/api/order")
        console.log("Axios Response:", res.data.data);
        setOrders(res.data.data || []);
        setLoading(false);
    } catch(error) {
        console.error("Axios Error:", error);
        setLoading(false);
    };
};

    const handleDelete = async (id) => {
        console.log("Delete button clicked for ID:", id);
         const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
        await axios.delete(`/api/order/${id}`);
        alert("Order deleted successfully!");
        // Refresh the admin list
        getOrder();
    } catch (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete user.");
    }
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md min-h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ArrowLeft size={24} className="mr-3 text-gray-500" />
                    Order Management
                </h1>
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                    <a href="/addOrder" className="flex items-center">
                    Add New Order
                    </a>
                </button>
            </div>

            <div className="mb-6 flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
                    Search
                </button>
            </div>

            {/* Customer Data Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Customer Name</th>
                        <th className="py-3 px-6 text-left">T-shirt Name</th>
                        <th className="py-3 px-6 text-left">Address</th>
                        <th className="py-3 px-6 text-left">Qty</th>
                        <th className="py-3 px-6 text-center">Date</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                    {/* Example Row */}
                     {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : order.length > 0 ? (
                            order.map((order, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{order.customerName}</td>
                        <td className="py-3 px-6 text-left">{order.tShirtName}</td>
                        <td className="py-3 px-6 text-left">{order.address}</td>
                        <td className="py-3 px-6 text-left">{order.qty}</td>
                        <td className="py-3 px-6 text-left">{order.date}</td>
                        <td className="py-3 px-6 text-left">{order.status}</td>
                        <td className="py-3 px-6 text-center">
                            <button className="text-blue-500 hover:text-blue-700 mr-2"
                            onClick={() => navigate(`/addOrder/${order._id}`)}
                            >Edit</button>
                            <button className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(order._id)}
                            >Delete</button>
                        </td>
                    </tr>
                            ))
                        ) : (
                    <tr>
                        <td colSpan="5" className="py-12 px-6 text-center text-gray-400">No customers found.</td>
                    </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center mt-6 text-gray-600">
                <button className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50" disabled>
                    &lt;
                </button>
                <span className="mx-2">1 / 10</span>
                <button className="p-2 rounded-lg hover:bg-gray-200">
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default Dashboard;