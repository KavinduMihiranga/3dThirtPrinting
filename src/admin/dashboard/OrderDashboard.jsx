import React from 'react';
import Sidebar from "../components/Sidebar";
import Header from '../components/Header';
import Dashboard from '../../orders/dashboard/Dashboard.jsx';

function OrderDashboard(props) {
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className='flex flex-col flex-1'>
                <Header/>
                <Dashboard/>
                </div>
        </div>
    );
}

export default OrderDashboard;