import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <Dashboard />
      </div>
    </div>
  )
}
