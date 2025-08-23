import React from 'react';
import Sidebar from '../components/Sidebar'
import Dashboard from '../../home/components/Dashboard.jsx';

function AdminDashboard(props) {
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className='flex flex-col flex-1'>
                <Dashboard/>
            </div>
        </div>
    );
}

export default AdminDashboard;