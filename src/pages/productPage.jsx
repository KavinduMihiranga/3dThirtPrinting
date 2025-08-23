import React, { useState, useEffect } from "react";
import CardComponent from "../components/CardComponent";
import axios from "axios";

function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product");
        console.log("API Response:", response.data.data); // Debug response
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <CardComponent
            key={product._id}
            id={product._id}
            title={product.name}
            description={product.description}
            price={product.price}
            image={`http://localhost:5000${product.image}`}
            status={product.status}
            category={product.category}
            qty={product.qty}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;