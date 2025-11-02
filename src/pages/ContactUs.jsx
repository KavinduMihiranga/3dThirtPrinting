import React, { useState,useRef  } from "react";
import axios from "axios";
import sendGif from "../assets/send.gif";

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

  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, designFile: e.target.files[0] }));
  };

  // Add this new function
const handleBlur = (e) => {
  const { name, value } = e.target;
  setTouched(prev => ({ ...prev, [name]: true }));
  
  const error = validateField(name, value);
  setErrors(prev => ({ ...prev, [name]: error }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach(key => {
    if (key !== 'designFile') {
      newTouched[key] = true;
      newErrors[key] = validateField(key, formData[key]);
    }
  });
  
    setTouched(newTouched);
    setErrors(newErrors);

  const hasErrors = Object.values(newErrors).some(error => error !== '');
  
  if (hasErrors) {
    setLoading(false);
    setError("Please fix the errors before submitting");
    return;
  }
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("subject", formData.subject);
      submitData.append("quantity", formData.quantity);
      submitData.append("address", formData.address);
      submitData.append("message", formData.message);
      
      if (formData.designFile) {
        submitData.append("designFile", formData.designFile);
      }

      const response = await axios.post(
        "http://localhost:5000/api/contact-us",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          quantity: "",
          address: "",
          message: "",
          designFile: null,
        });
        
         if (fileInputRef.current) {
        fileInputRef.current.value = "";
       }

        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 10000);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Failed to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
  const validations = {
    name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]*$/,
      message: "Name should be 2-50 characters and contain only letters"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    phone: {
      required: true,
      pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/,
      message: "Please enter a valid phone number"
    },
    subject: {
      required: true,
      minLength: 5,
      message: "Subject should be at least 5 characters"
    },
    message: {
      required: true,
      minLength: 10,
      message: "Message should be at least 10 characters"
    },
    quantity: {
      pattern: /^[0-9]*$/,
      min: 1,
      message: "Quantity should be a positive number"
    }
  };

  const rules = validations[name];
  if (!rules) return '';

  if (rules.required && !value.trim()) {
    return 'This field is required';
  }
  if (rules.minLength && value.length < rules.minLength) {
    return rules.message;
  }
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message;
  }
  if (rules.min && value < rules.min) {
    return rules.message;
  }

  return '';
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
          <h1 className="w-full font-bold text-3xl">Contact Us</h1>
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ {error}
            </div>
          )}

          {/* Full-Width Name Input */}
          <div>
            <label className="block text-gray-700 mb-2">Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded ${
              errors.name ? 'border-red-500' : 'border-gray-300'
              }`} 
              placeholder="Enter your name" 
              required 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Two-Column Layout for Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
                }`} 
                placeholder="Enter your email" 
                required 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}  
                placeholder="Enter your phone number" 
                required 
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Subject & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Subject *</label>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange}
                onBlur={handleBlur} 
                className={`w-full px-3 py-2 border rounded ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`} 
                placeholder="Enter subject" 
                required 
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`} 
                placeholder="Enter quantity" 
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Enter your address" 
            />
          </div>

          {/* Message Box */}
          <div>
            <label className="block text-gray-700 mb-2">Message *</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded h-24 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`} 
              placeholder="Enter your message" 
              required 
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 mb-2">Upload Your Design (Optional)</label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              className="w-full px-3 py-2 border rounded" 
              accept=".jpg,.jpeg,.png,.pdf,.glb,.gltf"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || Object.values(errors).some(error => error !== '')}
              className={`px-6 py-2 text-white rounded transition duration-200 ${
                loading || Object.values(errors).some(error => error !== '')
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;