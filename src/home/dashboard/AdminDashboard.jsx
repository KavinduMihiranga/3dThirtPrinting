import React from 'react';
import Dashboard from '../../admin/dashboard/Dashboard.jsx';

function AdminDashboard() {
    return (
        <div className='flex h-screen bg-gray-100'>
             <div className='w-64 bg-white shadow-lg'>
            </div>
            <div className='flex flex-col flex-1 overflow-hidden'>
                <Dashboard/>
            </div>
        </div>
    );
}

export default AdminDashboard;