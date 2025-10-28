import React, { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function ModelViewer({ designFile }) {
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!designFile) {
      setError('No design file provided');
      return;
    }

    if (typeof designFile === 'string' && designFile.startsWith('/uploads')) {
      setModelUrl(`http://localhost:5000${designFile}`);
      return;
    }

    if (typeof designFile === 'string' && (designFile.startsWith('http://') || designFile.startsWith('https://'))) {
      setModelUrl(designFile);
      return;
    }

    if (typeof designFile === 'string' && designFile.startsWith('data:model/gltf-binary;base64,')) {
      try {
        const base64Data = designFile.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: 'model/gltf-binary' });
        const blobUrl = URL.createObjectURL(blob);
        setModelUrl(blobUrl);

        return () => URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error('Failed to convert base64 to blob:', err);
        setError('Failed to process 3D model data');
      }
      return;
    }

    if (typeof designFile === 'object') {
      const path = designFile.url || designFile.path || designFile.location || designFile.filename;
      if (path) {
        setModelUrl(path.startsWith('http') ? path : `http://localhost:5000${path}`);
        return;
      }
    }

    setError('Invalid model file format');
  }, [designFile]);

  const isValidModelUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.match(/\.(gltf|glb)$/i) || url.includes('/uploads/designs/');
    }
    
    return url.match(/\.(gltf|glb)$/i);
  };

  if (error) {
    return (
      <div className="h-96 border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
          <p className="text-gray-700 font-medium">Failed to Load 3D Model</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="h-96 border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isValidModelUrl(modelUrl)) {
    return (
      <div className="h-96 border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-3 text-yellow-500" size={48} />
          <p className="text-gray-700 font-medium">Invalid 3D Model File</p>
          <p className="text-sm text-gray-500 mt-2">
            The design file format is not supported
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 border rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Canvas
        camera={{ position: [0, 1, 3], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f9fafb');
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={10}
        />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function DesignOrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const navigate = useNavigate();

  const customerDetails = location.state?.customerDetails;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/design-inquiry/${id}`);
        console.log("Order data:", res.data.data);
        setOrder(res.data.data);
        setPriceInput(res.data.data.price || "");
        setError(null);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      // Use PUT method instead of PATCH
      await axios.put(`http://localhost:5000/api/design-inquiry/${id}`, {
        ...order,
        status: newStatus,
      });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please check if the update endpoint is available.");
    }
  };

  const handlePriceUpdate = async () => {
    try {
      const numericPrice = parseFloat(priceInput);
      if (isNaN(numericPrice) || numericPrice < 0) {
        alert("Please enter a valid price");
        return;
      }

      // Use PUT method instead of PATCH
      await axios.put(`http://localhost:5000/api/design-inquiry/${id}`, {
        ...order,
        price: numericPrice,
      });
      
      setOrder({ ...order, price: numericPrice });
      setEditingPrice(false);
      alert("Price updated successfully!");
    } catch (err) {
      console.error("Error updating price:", err);
      alert("Failed to update price. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-4 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Orders
        </button>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Order</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center py-12">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Orders
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{order.customerName}</h1>
            <p className="text-gray-700 mb-3">{order.description}</p>
            
            {/* Price Editor */}
            <div className="flex items-center space-x-2">
              {!editingPrice ? (
                <>
                  <p className="text-lg font-semibold text-green-700">
                    Price: LKR {order.price ? order.price.toLocaleString() : "Not set"}
                  </p>
                  <button
                    onClick={() => setEditingPrice(true)}
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                  >
                    Edit Price
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">Price: LKR</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 w-32 focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                  <button
                    onClick={handlePriceUpdate}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPrice(false);
                      setPriceInput(order.price || "");
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Dropdown */}
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">Status:</span>
              <select
                value={order.status || "pending"}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-gray-300 rounded-md text-sm px-3 py-1.5 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status || 'pending'}
            </span>
          </div>
        </div>

        {/* Design Preview Image */}
        {order.designPreview && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Design Preview</h2>
            <img
              src={order.designPreview}
              alt="Design preview"
              className="w-full max-w-md rounded-lg shadow-md border"
            />
          </div>
        )}

        {/* Customer Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Contact Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              <Mail className="mr-2" size={20} />
              Customer Information
            </h2>
            
            {customerDetails ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{customerDetails.name}</p>
                </div>
                
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customerDetails.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{customerDetails.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                {order.email && (
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{order.email}</p>
                    </div>
                  </div>
                )}
                {order.phone && (
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{order.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Address Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              <MapPin className="mr-2" size={20} />
              Shipping Address
            </h2>
            
            {customerDetails ? (
              <div className="space-y-2">
                <p className="font-medium">{customerDetails.name}</p>
                <p className="text-sm">{customerDetails.shippingAddress.addressLine1}</p>
                {customerDetails.shippingAddress.addressLine2 && (
                  <p className="text-sm">{customerDetails.shippingAddress.addressLine2}</p>
                )}
                <p className="text-sm">
                  {customerDetails.shippingAddress.city}, {customerDetails.shippingAddress.province}
                </p>
              </div>
            ) : order.shippingAddress && typeof order.shippingAddress === 'object' ? (
              <div className="space-y-2">
                <p className="text-sm">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-sm">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.province}
                </p>
              </div>
            ) : order.shippingAddress ? (
              <p className="text-sm">{order.shippingAddress}</p>
            ) : (
              <p className="text-sm text-gray-500">No address information available</p>
            )}
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">3D Model Viewer</h2>
          <ModelViewer designFile={order.designFile} />
          <p className="text-xs text-gray-500 mt-2">
            Use mouse to rotate, scroll to zoom, right-click to pan
          </p>
        </div>

        {/* Order Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <p>Order ID: {order._id}</p>
              <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p>Last Updated: {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignOrderDetails;