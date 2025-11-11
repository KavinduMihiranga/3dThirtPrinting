import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [productSubmitted, setProductSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    size: "",
    description: "",
    price: "",
    qty: "",
    status: "",
    image: null,
  });

  // Fetch product data when editing
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchProductData(id);
    }
  }, [id]);

  const fetchProductData = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/product/${productId}`);
      if (res.data.data) {
        setFormData(res.data.data);
        // Set image preview if image exists
        if (res.data.data.image) {
          setImagePreview(`http://localhost:5000${res.data.data.image}`);
        }
      } else {
        console.error("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProductSubmitted(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("category", formData.category);
    payload.append("size", formData.size);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("qty", formData.qty);
    payload.append("status", formData.status);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/product/${id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Product updated");
      } else {
        await axios.post("http://localhost:5000/api/product", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Product added");
      }
      setProductSubmitted(false);
      navigate("/productDashboard");
    } catch (error) {
      console.error("Error saving product:", error);
      setProductSubmitted(false);
    }
  };

  return (
    <div className="w-[500px] mx-auto mt-10 border rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-green-300 text-black font-semibold text-lg px-6 py-3 flex justify-between items-center rounded-t-lg">
        <span>{isEdit ? "EDIT PRODUCT" : "ADD PRODUCT"}</span>
        <button className="text-xl font-bold hover:text-red-600" onClick={() => navigate(-1)}>
          ×
        </button>
      </div>

      {/* Form */}
      <form className="p-6 space-y-4" onSubmit={handleSubmit}>
        {/* Image Preview */}
        {imagePreview && (
          <div className="flex justify-center">
            <div className="w-32 h-32 border rounded-md overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Product Name</label>
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
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
            <option value="">Select Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
       

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
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
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select            
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Status</option>
            <option value="in stock">In Stock</option>
            <option value="out of stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Image Upload</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            accept="image/*"
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

export default AddProduct;