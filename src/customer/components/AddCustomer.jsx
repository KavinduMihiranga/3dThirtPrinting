import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AddCustomer() {
  const { id } = useParams(); // get customer ID for editing
  const [isEdit, setIsEdit] = useState(false);
  const [customerSubmitted, setCustomerSubmitted] = useState(false);

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
      fetchCustomerData(id);
    }
  }, [id]);

   const fetchCustomerData = async (customerId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/customer/${customerId}`);
    if (res.data.data) {
      setFormData(res.data.data); // adjust this based on your API response
    } else {
      console.error("Customer not found");
    }
  } catch (err) {
    console.error('Error fetching customer data:', err);
  }
};

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setCustomerSubmitted(true);

    const payload = {
      name: formData.name,
      gender: formData.gender,
      email: formData.email,
      password: formData.password,
      nic: formData.nic,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      country: formData.country
    };

    if (isEdit) {
 // Edit existing customer
      axios.put(`http://localhost:5000/api/customer/${id}`, payload)
        .then((response) => {
          console.log('Customer updated:', response.data);
          setCustomerSubmitted(false);
          navigate('/customerDashboard');
        })
        .catch((error) => {
          console.error('Error updating customer:', error);
          setCustomerSubmitted(false);
        });
    } else {
      // Add new customer
      axios.post('http://localhost:5000/api/customer', payload)
        .then((response) => {
          console.log('Customer added:', response.data);
          setCustomerSubmitted(false);
          navigate('/customerDashboard');
        })
        .catch((error) => {
          console.error('Error adding customer:', error);
          setCustomerSubmitted(false);
        });
    
    }

    console.log('Adding customer with payload:', payload);

    axios.post('http://localhost:5000/api/customer', payload)
      .then((response) => {
        console.log('Customer added successfully:', response.data);
        setCustomerSubmitted(false);
        navigate('/customerDashboard'); // optional
      })
      .catch((error) => {
        console.error('Error adding customer:', error);
        setCustomerSubmitted(false);
      });
  };

  return (
    <div className="w-[500px] mx-auto mt-10 border rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-green-300 text-black font-semibold text-lg px-6 py-3 flex justify-between items-center rounded-t-lg">
        <span>{isEdit ? 'EDIT CUSTOMER' : 'ADD CUSTOMER'}</span>
        <button className="text-black text-xl font-bold hover:text-red-600"
          onClick={() => navigate(-1)}>×</button>
      </div>

      {/* Form */}
      <form
        className="p-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
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
          <button
            type="submit"
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
          >
             {isEdit ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomer;
