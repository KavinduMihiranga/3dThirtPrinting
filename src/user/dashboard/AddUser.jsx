import React, { use } from 'react';
import { Form } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddUser(props) {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('User added successfully!');
    }
    return (
         <div className="w-[500px] mx-auto mt-10 border rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-green-300 text-black font-semibold text-lg px-6 py-3 flex justify-between items-center rounded-t-lg">
        <span>ADD User</span>
        <button className="text-black text-xl font-bold hover:text-red-600"
        onClick={()=> navigate(-1)}
        >×</button>
      </div>

      {/* Form */}
      <form className="p-6 space-y-4">
        {/* Row 1 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Gender</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Email Address</label>
            <input type="email" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">NIC</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Phone Number</label>
            <input type="tel" className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {/* Single Column Fields */}
        <div>
          <label className="block text-sm font-medium">Address Line 1</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Address Line 2</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">City/State</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            className="border border-green-700 text-green-700 px-4 py-2 rounded hover:bg-green-100"
            onClick={()=> navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
           
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
    );
}

export default AddUser;