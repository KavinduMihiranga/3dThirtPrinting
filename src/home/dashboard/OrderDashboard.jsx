import React from 'react';
import Sidebar from "../components/Sidebar";
import Dashboard from '../../orders/dashboard/Dashboard.jsx';

function OrderDashboard(props) {
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className='flex flex-col flex-1'>
                <Dashboard/>
                </div>
        </div>
    );
}

export default OrderDashboard;