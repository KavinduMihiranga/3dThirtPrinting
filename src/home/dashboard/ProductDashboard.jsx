import React from 'react';
import Sidebar from '../components/Sidebar'
import Dashboard from '../../product/dashboard/Dashboard.jsx';

function ProductDashboard(props) {
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className='flex flex-col flex-1'>
                <Dashboard/>
                </div>
        </div>
    );
}

export default ProductDashboard;