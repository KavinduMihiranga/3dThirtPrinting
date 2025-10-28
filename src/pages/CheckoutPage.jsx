import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import axios from "axios";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [sameAddress, setSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if there's a pending design order
  const [hasPendingDesign, setHasPendingDesign] = useState(false);

  useEffect(() => {
    const pendingDesign = localStorage.getItem('pendingDesign');
    if (pendingDesign) {
      setHasPendingDesign(true);
    }
  }, []);

  const handleCheckboxChange = () => {
    const newSameAddress = !sameAddress;
    setSameAddress(newSameAddress);
    if (newSameAddress) {
      setShippingAddress(billingAddress);
    }
  };

  const handleBillingAddressChange = (field, value) => {
    const newBillingAddress = {
      ...billingAddress,
      [field]: value
    };
    setBillingAddress(newBillingAddress);
    
    if (sameAddress) {
      setShippingAddress(newBillingAddress);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert("Please enter your full name");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    if (!billingAddress.addressLine1.trim()) {
      alert("Please enter your billing address line 1");
      return false;
    }
    if (!billingAddress.city.trim()) {
      alert("Please enter your city");
      return false;
    }
    if (!billingAddress.province.trim()) {
      alert("Please enter your province");
      return false;
    }
    
    if (!sameAddress) {
      if (!shippingAddress.addressLine1.trim()) {
        alert("Please enter your shipping address line 1");
        return false;
      }
      if (!shippingAddress.city.trim()) {
        alert("Please enter your shipping city");
        return false;
      }
      if (!shippingAddress.province.trim()) {
        alert("Please enter your shipping province");
        return false;
      }
    }
    
    return true;
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if this is a design order
      const pendingDesignData = localStorage.getItem('pendingDesign');
      
      if (hasPendingDesign && pendingDesignData) {
        // Handle design order submission
        const designData = JSON.parse(pendingDesignData);
        
        // Check if the file data is valid
        if (!designData.file || designData.file === "[object Object]") {
          throw new Error("Invalid design file data. Please recreate your design.");
        }

        // Convert base64 back to blob
        let blob;
        try {
          const binaryString = atob(designData.file);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: "model/gltf-binary" });
        } catch (error) {
          console.error("Error converting file:", error);
          throw new Error("Failed to process design file. Please try again.");
        }

        // Create customer details object
        const customerDetails = {
          name,
          email,
          phone,
          billingAddress,
          shippingAddress: sameAddress ? billingAddress : shippingAddress
        };

        // Create FormData with customer details
        const formData = new FormData();
        formData.append('customerName', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('description', `Custom T-shirt design order`);
        formData.append('billingAddress', JSON.stringify(billingAddress));
        formData.append('shippingAddress', JSON.stringify(
          sameAddress ? billingAddress : shippingAddress
        ));
        formData.append('customerDetails', JSON.stringify(customerDetails)); // ✅ Add customer details
        
        if (designData.preview) {
          formData.append('designPreview', designData.preview);
        }
        
        formData.append('designFile', blob, 'tshirt-design.glb');

        // Submit to backend
        const response = await axios.post(
          "http://localhost:5000/api/design-inquiry", 
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data' 
            },
            timeout: 30000
          }
        );

        // Clear pending design
        localStorage.removeItem('pendingDesign');
        setHasPendingDesign(false);

        alert('Design order submitted successfully!');
        
        // ✅ Redirect to order details page with customer data
        // navigate(`/designOrderDetails/${response.data.data._id}`, {
        //   state: {
        //     customerDetails: customerDetails
        //   }
        // });

      } else {
        // Handle regular product order (existing flow)
        const totalAmount = cartItems.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );

        navigate("/payment", {
          state: {
            name,
            email,
            phone,
            billingAddress,
            shippingAddress: sameAddress ? billingAddress : shippingAddress,
            cartItems,
            totalAmount,
          },
        });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      if (error.code === 'ECONNABORTED') {
        alert('Request timeout. Please check your connection and try again.');
      } else if (error.response?.status === 413) {
        alert('File too large. Please try with a smaller design file.');
      } else {
        alert('Failed to submit order: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address field labels for better UX
  const addressFields = [
    { key: 'addressLine1', label: 'Address Line 1', placeholder: 'Enter street address' },
    { key: 'addressLine2', label: 'Address Line 2', placeholder: 'Enter apartment, suite, etc. (optional)' },
    { key: 'city', label: 'City', placeholder: 'Enter your city' },
    { key: 'province', label: 'Province/State', placeholder: 'Enter your province or state' }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {hasPendingDesign ? 'Complete Your Design Order' : 'Checkout Page'}
      </h1>

      {hasPendingDesign && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">
            🎨 You have a custom T-shirt design ready! Complete your details to place the order.
          </p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleProceedToPayment}>
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-2">Personal Information</h2>
          
          {/* Full Name */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        </div>

        {/* Billing & Shipping Addresses */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-2">Address Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Address */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Billing Address *</h3>
              {addressFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-700 mb-1 text-sm">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={billingAddress[field.key]}
                    onChange={(e) => handleBillingAddressChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder}
                    required={field.key !== 'addressLine2'}
                  />
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              
              {/* Checkbox */}
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Same as billing address
              </label>

              {!sameAddress && (
                <div className="space-y-2">
                  {addressFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-gray-700 mb-1 text-sm">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={shippingAddress[field.key]}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={field.placeholder}
                        required={field.key !== 'addressLine2'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200 font-medium"
          >
            {isSubmitting ? 'Processing...' : (hasPendingDesign ? 'Place Design Order' : 'Continue to Payment')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;