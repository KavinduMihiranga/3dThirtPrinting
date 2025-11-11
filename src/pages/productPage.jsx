import React, { useState, useEffect } from "react";
import CardComponent from "../components/CardComponent";
import axios from "axios";
import PaginationBar from "../components/PaginationBar";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 6; // Adjust based on your needs

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product");
        console.log("API Response:", response.data.data);
        const productsData = response.data.data || [];
        setProducts(productsData);
        
        // Calculate total pages based on number of products
        setTotalPages(Math.ceil(productsData.length / productsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Get current products for the page
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const currentProducts = getCurrentProducts();

  return (
    <div className="container mx-auto p-4">
      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products available.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <CardComponent
                key={product._id}
                id={product._id}
                title={product.title || product.name}
                size={product.size}
                description={product.description}
                price={product.price}
                image={
                  product.image?.startsWith("http")
                    ? product.image
                    : `http://localhost:5000${product.image}`
                }
                status={product.status}
                category={product.category}
                qty={product.qty}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <PaginationBar 
                totalPages={totalPages} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductPage;