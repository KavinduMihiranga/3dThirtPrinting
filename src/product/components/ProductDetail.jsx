import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../pages/CartContext.jsx";
import axios from "axios";

function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();

  // ✅ Directly receive product from state (if available)
  const [product, setProduct] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [quantity, setQuantity] = useState(1);

  console.log("Product Detail Data:", product);

  useEffect(() => {
    if (!product && id) {
      fetchProductById(id);
    }
  }, [id]);

  const fetchProductById = async (productId) => {
    try {
      const res = await axios.get(`/api/product/${productId}`);
      const data = res.data.data;

      const normalizedProduct = {
        ...data,
        _id: data._id || data.id,
        title: data.title || data.name,
      };

      setProduct(normalizedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    const productToAdd = {
      id: product._id || product.id,
      name: product.title,
      size: product.size,
      price: product.price,
      image: product.image,
    };

    addToCart(productToAdd);
    navigate("/cartPage");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto rounded-lg shadow-md"
            onError={(e) => {
              e.target.src = "/default-image.jpg";
            }}
          />
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {product.title}
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 font-medium">Category</p>
              <p className="text-gray-800">{product.category}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Size</p>
              <p className="text-gray-800">{product.size}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Status</p>
              <p className="text-gray-800">{product.status}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Price</p>
              <p className="text-2xl font-bold text-green-600">
                Rs. {product.price}
              </p>
              
            </div>
            <div>
              <p className="text-gray-600 font-medium">Quantity</p>
              <p className="text-gray-800">{product.qty} In stock</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 font-medium">Description</p>
            <p className="text-gray-800">{product.description}</p>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            {/* <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
              Buy Now
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
