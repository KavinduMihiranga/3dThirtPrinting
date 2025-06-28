import React from 'react';
import { ArrowLeft } from 'lucide-react';

function Dashboard(props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md min-h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ArrowLeft size={24} className="mr-3 text-gray-500" />
                    User Management
                </h1>
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                    <a href="/addUser" className="flex items-center">
                    Add New Customer
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
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Address</th>
                        <th className="py-3 px-6 text-left">Contact Number</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                    {/* Example Row */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">John Doe</td>
                        <td className="py-3 px-6 text-left">123 Main St</td>
                        <td className="py-3 px-6 text-left">123-456-7890</td>
                        <td className="py-3 px-6 text-left">Active</td>
                        <td className="py-3 px-6 text-center">
                            <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                            <button className="text-red-500 hover:text-red-700">Delete</button>
                        </td>
                    </tr>
                    {/* More rows will go here */}
                    <tr>
                        <td colSpan="5" className="py-12 px-6 text-center text-gray-400">No customers found.</td>
                    </tr>
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