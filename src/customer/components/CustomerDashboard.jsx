import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Sidebar from "../../home/components/Sidebar.jsx";
import Dashboard from "../dashboard/Dashboard.jsx";

function CustomerDashboard(props) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Dashboard />
            </div>
        </div>
    );
}

export default CustomerDashboard;