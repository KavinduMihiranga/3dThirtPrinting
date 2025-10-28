import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [adminSubmitted, setAdminSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    phone: '',
    nic: '',
    name: '',
    gender: ''
  });

  // Get the auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Configure axios to include the token in requests
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  // Add request interceptor to include token
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    if (id) {
      setIsEdit(true);
      fetchAdminData(id);
    }
  }, [id, navigate]);

  const fetchAdminData = async (userId) => {
    try {
      console.log('🔍 Fetching admin data for ID:', userId);
      const res = await api.get(`/admin/${userId}`);
      console.log('✅ Admin data received:', res.data);
      
      if (res.data.data) {
        setFormData(res.data.data);
      } else {
        console.error("Admin not found");
        setErrors({ general: "Admin not found" });
      }
    } catch (err) {
      console.error('❌ Error fetching admin data:', err);
      if (err.response?.status === 401) {
        setErrors({ general: "Session expired. Please login again." });
      } else if (err.response?.status === 404) {
        setErrors({ general: "Admin not found" });
      } else {
        setErrors({ general: "Error fetching admin data" });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!isEdit && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    // NIC is optional but if provided, validate format
    if (formData.nic && !/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/.test(formData.nic)) {
      newErrors.nic = 'NIC format is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setAdminSubmitted(true);
    setErrors({});

    try {
      const payload = { ...formData };
      
      // Remove password field if it's empty during edit
      if (isEdit && !payload.password) {
        delete payload.password;
      }
      
      // Ensure NIC is not null - send empty string instead
      if (!payload.nic) {
        payload.nic = '';
      }
      
      console.log("📤 Sending payload:", payload);

      if (isEdit) {
        await api.put(`/admin/${id}`, payload);
        console.log("✅ Admin updated");
        alert("Admin updated successfully!");
      } else {
        await api.post("/admin", payload);
        console.log("✅ Admin added");
        alert("Admin added successfully!");
      }
      
      setAdminSubmitted(false);
      navigate("/adminDashboard");
    } catch (error) {
      console.error("❌ Error saving admin:", error);
      console.error("❌ Error details:", error.response?.data);
      
      // Handle specific backend errors
      if (error.response?.data?.message?.includes('duplicate key error')) {
        if (error.response.data.message.includes('email')) {
          setErrors({ email: 'This email is already registered' });
        } else if (error.response.data.message.includes('username')) {
          setErrors({ username: 'This username is already taken' });
        } else if (error.response.data.message.includes('nic')) {
          setErrors({ nic: 'This NIC is already registered' });
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else if (error.response?.status === 401) {
        setErrors({ general: "Session expired. Please login again." });
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to save admin' });
      }
      
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
        {/* Error Message */}
        {errors.general && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
            {errors.general}
          </div>
        )}

        {/* Username */}
        <div>
          <label className="block text-sm font-medium">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">
            Password {!isEdit && '*'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            required={!isEdit}
            placeholder={isEdit ? "Leave blank to keep current password" : "Enter password (min. 6 characters)"}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            placeholder="e.g., 0771234567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* NIC */}
        <div>
          <label className="block text-sm font-medium">NIC</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.nic ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 123456789V or 123456789012"
          />
          {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
          <p className="text-gray-500 text-xs mt-1">Optional - Leave blank if not available</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter full name"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
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
          <button 
            type="submit" 
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={adminSubmitted}
          >
            {adminSubmitted ? "Saving..." : (isEdit ? "Update" : "Submit")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAdmin;