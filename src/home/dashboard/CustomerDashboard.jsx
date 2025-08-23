import React from 'react';
import Dashboard from '../../customer/dashboard/Dashboard.jsx';
function CustomerDashboard() {
    return (
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col flex-1 overflow-hidden'>
                <Dashboard/>
            </div>
        </div>
    );
}

export default CustomerDashboard;