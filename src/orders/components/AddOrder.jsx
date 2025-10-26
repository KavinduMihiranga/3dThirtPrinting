import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AddOrder(props) {

  const { id } = useParams(); // get user ID for editing
  const [isEdit, setIsEdit] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    tShirtName: '',
    address: '',
    qty: '',
    date: '',
    status: ''
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchOrderData(id);
    }
  }, [id]);

   const fetchOrderData = async (orderId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/order/${orderId}`);
    if (res.data?.data) {
      setFormData(res.data.data); // adjust this based on your API response
    } else {
      console.error("Order not found");
    }
  } catch (err) {
    console.error('Error fetching order data:', err);
  }
};

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = () => {
  setOrderSubmitted(true);

  const payload = {
    customerName: formData.customerName,
    tShirtName: formData.tShirtName,
    address: formData.address,
    qty: Number(formData.qty), // ✅ ensure it's a number
    date: formData.date, // Convert date to timestamp
    status: formData.status
  };

  console.log('Adding order with payload:', payload);

  if (isEdit) {
    // Edit mode
    axios.put(`http://localhost:5000/api/order/${id}`, payload)
      .then((response) => {
        console.log('Order updated:', response.data);
        setOrderSubmitted(false);
        navigate('/order');
      })
      .catch((error) => {
        console.error('Error updating order:', error.response?.data || error.message);
        setOrderSubmitted(false);
      });
  } else {
    // Add mode
    axios.post('http://localhost:5000/api/order', payload)
      .then((response) => {
        console.log('Order added:', response.data);
        setOrderSubmitted(false);
        navigate('/order');
      })
      .catch((error) => {
        console.error('Error adding order:', error.response?.data || error.message);
        setOrderSubmitted(false);
      });
  }
};
    return (
        <div className="w-[500px] mx-auto mt-10 border rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-green-300 text-black font-semibold text-lg px-6 py-3 flex justify-between items-center rounded-t-lg">
        <span>{isEdit ? 'EDIT ORDER' : 'ADD ORDER'}</span>
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
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">TShirt Name</label>
            <input
              type="text"
              name="tShirtName"
              value={formData.tShirtName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Qty</label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
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

export default AddOrder;