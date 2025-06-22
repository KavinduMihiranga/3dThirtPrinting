import React from 'react'

export default function Dashboard() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-semibold mb-2">Good Morning!</h1>
      <h2 className="text-xl mb-6">Kavindu</h2>
      <div className="space-x-4">
        <button className="border px-4 py-2">Orders</button>
        <button className="border px-4 py-2">Customers</button>
        <button className="border px-4 py-2">Products</button>
      </div>
    </div>
  )
}
