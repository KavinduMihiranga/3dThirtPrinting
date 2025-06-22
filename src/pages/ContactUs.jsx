import React, { useState } from "react";
import sendGif from "../assets/send.gif"; // Replace with your image path
import upload from "../assets/upload.png"; // Replace with your image path

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    quantity: "",
    address: "",
    message: "",
    designFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, designFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Side - Image & Text */}
        <div className="text-center">
            <h1 className="text-3xl font-bold mt-4">Send Your Order to Us</h1>
            <p className="text-gray-600 mt-2">We create amazing printed T-shirts for you!</p>
            <img src={sendGif} alt="Printed T-Shirts" className="w-full rounded-lg shadow-md" />
         
        </div>

        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="w-full font-bold text-5xl">Contact Us</h1>
          {/* Full-Width Name Input */}
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Enter your name" required />
          </div>

          {/* Two-Column Layout for Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Enter your phone number" required />
            </div>
          </div>

          {/* Subject & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Enter subject" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Enter quantity" required />
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Enter your address" required />
          </div>

          {/* Message Box */}
          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} className="w-full px-3 py-2 border rounded h-24" placeholder="Enter your message" required />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 mb-2">Upload Your Design</label>
            
            <input type="file" onChange={handleFileChange} className="w-full px-3 py-2 border rounded" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
              Send Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;