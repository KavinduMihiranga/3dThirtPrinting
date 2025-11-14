import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    billingAddress: {
      addressLine1: "",
      city: "",
      province: "",
    },
    shippingAddress: {
      addressLine1: "",
      city: "",
      province: "",
    },
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    billingAddress: {
      addressLine1: false,
      city: false,
      province: false,
    },
  });

  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
  });

  // const [name, setName] = useState("");
  // const [nameError, setNameError] = useState("");
  // const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");

// Name validation function
  const validateName = (value) => {
     if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters long";
    if (value.trim().length > 50) return "Name cannot exceed 50 characters";
    if (/[0-9]/.test(value)) return "Name cannot contain numbers";
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return "Name cannot contain special characters";
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Name can only contain letters, spaces, hyphens, apostrophes, and periods";
    if (value.trim().split(/\s+/).length < 2) return "Please enter your full name (first and last name)";
    if (/\s{2,}/.test(value)) return "Name cannot contain multiple consecutive spaces";
    return "";
  };

   const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (value) => {
    if (!value.trim()) return "Phone number is required";
    // Remove all non-digit characters for validation
    const cleanPhone = value.replace(/\D/g, '');
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    if (!/^[+]?[\d\s-()]+$/.test(value)) return "Please enter a valid phone number";
    return "";
  };

  const validateAddressField = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required`;
    if (value.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?]/.test(value)) return `${fieldName} cannot contain special characters`;
    return "";
  };

 // Handle field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for touched fields
    // if (touched[field]) {
      let error = "";
      switch (field) {
        case 'name':
          error = validateName(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [field]: error }));
    // }
  };

 const handleBillingAddressChange = (field, value) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
    
    // if (touched.billingAddress[field]) {
      const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
      const error = validateAddressField(value, fieldName);
      setErrors(prev => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [field]: error }
      }));
    // }

    // If same address is checked, update shipping address too
    if (sameAddress) {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

   const handleShippingAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    
    const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
    const error = validateAddressField(value, fieldName);
    setErrors(prev => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: error }
    }));
  };

   // Handle blur events
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = "";
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

   const handleAddressBlur = (type, field) => {
    setTouched(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: true }
    }));

    const value = type === 'billingAddress' ? billingAddress[field] : shippingAddress[field];
    const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
    const error = validateAddressField(value, fieldName);

    setErrors(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: error }
    }));
  };

  

  // const handleNameChange = (e) => {
  //   const value = e.target.value;
  //   setName(value);
    
  //   // Real-time validation
  //   const error = validateName(value);
  //   setNameError(error);
  // };

  // const handleNameBlur = () => {
  //   // Additional validation on blur
  //   const error = validateName(name);
  //   setNameError(error);
  // };

 const handleCheckboxChange = () => {
    const newSameAddress = !sameAddress;
    setSameAddress(newSameAddress);
    if (newSameAddress) {
      setShippingAddress(billingAddress);
      // Clear shipping address errors when using same as billing
      setErrors(prev => ({
        ...prev,
        shippingAddress: {
          addressLine1: "",
          city: "",
          province: "",
        }
      }));
    }
  };

  // const handleCheckboxChange = () => {
  //   const newSameAddress = !sameAddress;
  //   setSameAddress(newSameAddress);
  //   if (newSameAddress) {
  //     // Copy billing to shipping when "same as billing" is checked
  //     setShippingAddress(billingAddress);
  //   }
  // };


  const validateAllFields = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      billingAddress: {
        addressLine1: validateAddressField(billingAddress.addressLine1, "address line 1"),
        city: validateAddressField(billingAddress.city, "city"),
        province: validateAddressField(billingAddress.province, "province"),
      },
      shippingAddress: {
        addressLine1: sameAddress ? "" : validateAddressField(shippingAddress.addressLine1, "address line 1"),
        city: sameAddress ? "" : validateAddressField(shippingAddress.city, "city"),
        province: sameAddress ? "" : validateAddressField(shippingAddress.province, "province"),
      },
    };

 setErrors(newErrors);

  // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      billingAddress: {
        addressLine1: true,
        city: true,
        province: true,
      },
    });

    // Check if any errors exist
    const hasErrors = 
      newErrors.name || 
      newErrors.email || 
      newErrors.phone ||
      newErrors.billingAddress.addressLine1 ||
      newErrors.billingAddress.city ||
      newErrors.billingAddress.province ||
      (!sameAddress && (
        newErrors.shippingAddress.addressLine1 ||
        newErrors.shippingAddress.city ||
        newErrors.shippingAddress.province
      ));

    return !hasErrors;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();


     // Validate all fields before proceeding
    // const nameValidationError = validateName(name);
    // if (nameValidationError) {
    //   setNameError(nameValidationError);
    //   return;
    // }

    // if (!email || !phone || !billingAddress.addressLine1) {
    //   alert("Please fill in all required fields before continuing.");
    //   return;
    // }
    if (!validateAllFields()) {
      alert("Please fix all validation errors before continuing.");
      return;
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    navigate("/payment", {
      state: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        billingAddress,
        shippingAddress: sameAddress ? billingAddress : shippingAddress,
        cartItems,
        totalAmount,
      },
    });
  };

 const getInputClassName = (error) => {
    return `w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
      error 
        ? "border-red-500 focus:ring-red-200" 
        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
    }`;
  };

  const renderValidationIcon = (error, value) => {
    if (error) {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (value && !error) {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  const isSubmitDisabled = () => {
    return !formData.name || !formData.email || !formData.phone || 
           !billingAddress.addressLine1 || !billingAddress.city || !billingAddress.province ||
           (!sameAddress && (!shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.province));
  };


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>

      <form className="space-y-6" onSubmit={handleProceedToPayment}>
        {/* Full Name */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2">Full Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getInputClassName(errors.name)}
            placeholder="Enter your full name (first and last name)"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              {renderValidationIcon(errors.name, formData.name)}
              {errors.name}
            </p>
          )}
          {!errors.name && formData.name && (
            <p className="text-green-500 text-sm mt-1 flex items-center">
              {renderValidationIcon(errors.name, formData.name)}
              Name looks good!
            </p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Email Address
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={getInputClassName(errors.email)}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                {renderValidationIcon(errors.email, formData.email)}
                {errors.email}
              </p>
            )}
            {!errors.email && formData.email && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                {renderValidationIcon(errors.email, formData.email)}
                Email looks good!
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number
            <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className={getInputClassName(errors.phone)}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                {renderValidationIcon(errors.phone, formData.phone)}
                {errors.phone}
              </p>
            )}
            {!errors.phone && formData.phone && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                {renderValidationIcon(errors.phone, formData.phone)}
                Phone looks good!
              </p>
            )}
          </div>
        </div>

        {/* Billing & Shipping Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing Address */}
          <div>
            <h2 className="text-xl font-bold mb-2">Billing Address
              <span className="text-red-500">*</span>
            </h2>
            {Object.keys(billingAddress).map((field) => (
              <div key={field} className="mb-2">
              <input
                type="text"
                value={billingAddress[field]}
                onChange={(e) =>
                  handleBillingAddressChange(field, e.target.value)}
                onBlur={() => handleAddressBlur('billingAddress', field)}
                className={getInputClassName(errors.billingAddress[field])}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                required={['addressLine1', 'city', 'province'].includes(field)}
              />
              {errors.billingAddress[field] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    {renderValidationIcon(errors.billingAddress[field], billingAddress[field])}
                    {errors.billingAddress[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-bold mb-2">Shipping Address
               Shipping Address <span className="text-red-500">*</span>
            </h2>
            {!sameAddress ?(
              Object.keys(shippingAddress).map((field) => (
                <div key={field} className="mb-2">
                <input
                  type="text"
                  value={shippingAddress[field]}
                  onChange={(e) => handleShippingAddressChange(field, e.target.value)}
                  onBlur={() => handleAddressBlur('shippingAddress', field)}
                  className={getInputClassName(errors.shippingAddress[field])}
                  placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  required={['addressLine1', 'city', 'province'].includes(field)}
                />
                {errors.shippingAddress[field] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      {renderValidationIcon(errors.shippingAddress[field], shippingAddress[field])}
                      {errors.shippingAddress[field]}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Same as billing address
              </p>
            )}
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={handleCheckboxChange}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          Shipping address same as billing
        </label>

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md font-medium ${
              isSubmitDisabled() 
                ? "bg-gray-400 cursor-not-allowed text-gray-700" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isSubmitDisabled()}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
