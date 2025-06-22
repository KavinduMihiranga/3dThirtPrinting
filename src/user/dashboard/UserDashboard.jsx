import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Sidebar from "../../admin/components/Sidebar.jsx";
import Dashboard from "../../user/components/Dashboard.jsx";

function UserDashboard(props) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Dashboard />
            </div>
        </div>
    );
}

export default UserDashboard;