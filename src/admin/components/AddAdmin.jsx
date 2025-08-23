import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddUser() {
  const { id } = useParams(); // get user ID for editing
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [adminSubmitted, setAdminSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    password: '',
    nic: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchAdminData(id);
    }
  }, [id]);

  const fetchAdminData = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/${userId}`);
      if (res.data.data) {
        setFormData(res.data.data);
      } else {
        console.error("User not found");
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminSubmitted(true);

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/admin/${id}`, formData);
        console.log("Admin updated");
      } else {
        await axios.post("http://localhost:5000/api/admin", formData);
        console.log("Admin added");
      }
      setAdminSubmitted(false);
      navigate("/adminDashboard");
    } catch (error) {
      console.error("Error saving admin:", error);
      setAdminSubmitted(false);
    }
  };

  return (
    <div className="w-[500px] mx-auto mt-10 border rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-green-300 text-black font-semibold text-lg px-6 py-3 flex justify-between items-center rounded-t-lg">
        <span>{isEdit ? 'EDIT ADMIN' : 'ADD ADMIN'}</span>
        <button 
          className="text-black text-xl font-bold hover:text-red-600"
          onClick={() => navigate(-1)}
        >
          ×
        </button>
      </div>

      {/* Form */}
      <form className="p-6 space-y-4" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required={!isEdit}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">NIC</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            className="border border-green-700 text-green-700 px-4 py-2 rounded hover:bg-green-100"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700">
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;