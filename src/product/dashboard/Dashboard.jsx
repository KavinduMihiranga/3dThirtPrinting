import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductsPerPage] = useState(10); // You can adjust this number

  // ✅ Export announcements as Excel file
  const exportToExcel = () => {
    if (!products || products.length === 0) {
      alert("No data available to export!");
      return;
    }
  
    // Convert announcement objects into sheet data
    const dataToExport = products.map((a, index) => ({
      "No": index + 1,
      "Product": a.name,
      "Description": a.description,
      "Category": a.category,
      "Price": a.price,
      "Stock": a.qty,
      "Status": a.status,
      "Created Date": new Date(a.createdAt).toLocaleDateString(),
    }));
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
    // Convert workbook to binary and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Products_Report.xlsx");
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      console.log("Products Data:", res.data.data);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/product/${id}`);
      alert("Product deleted successfully!");
      getProducts();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) =>
    (product.title || product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ArrowLeft size={24} className="mr-3 text-gray-500" />
          Product Management
        </h1>
        <div className="flex space-x-3">
           <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
             >
            Export Excel
         </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={() => navigate("/addProduct")}
        >
          Add New Product
        </button>
        </div>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price (LKR)</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        navigate(`/product/${product._id}`, { state: product })
                      }
                    >
                      {product.title || product.name}
                    </button>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {product.description?.length > 50
                      ? `${product.description.substring(0, 50)}...`
                      : product.description}
                  </td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-left">
                    {product.price?.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-left">{product.qty}</td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.status === "in stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => navigate(`/addProduct/${product._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  {searchTerm ? "No matching products found" : "No products available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: Math.ceil(products.length / productPerPage) }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === i + 1
              ? "bg-green-600 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
    </div>
  );
}

export default Dashboard;
