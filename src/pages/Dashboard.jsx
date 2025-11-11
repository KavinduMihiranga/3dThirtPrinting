import React, { useEffect, useState } from "react";
import CardComponent from "../components/CardComponent.jsx";
import DesignCard from "../components/DesignCard.jsx";
import axios from "axios";
import TshirtImg from "../assets/TshirtPrintingImg.jpg";
import DesignImg from "../assets/T-shirtDesignImg.png";
import PaginationBar from "../components/PaginationBar.jsx";
import Map from "../assets/map.png"; 
import Security from "../assets/security.png";
import IconText from "../components/IconText.jsx";
import SecurePayment from "../assets/secure-payment.png"; 
import CustomerCare from "../assets/customer-care.png";
import bannerImg from "/banner.jpg";

function Dashboard(props) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 7; // Adjust based on your grid layout

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/product");
      setProducts(res.data.data);
      // Calculate total pages based on number of products
      const totalProducts = res.data.data.length;
      setTotalPages(Math.ceil(totalProducts / productsPerPage));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Get current products for the page
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  return (
    <>
    <div 
    className="w-full bg-white"
    >
      <img
        src={bannerImg}
        alt="Tshirt Printing"
        className="w-full h-full object-cover"
      />
    </div>
      <div className="text-center my-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
          Kavindu T-Shirt Printing
        </h1>
        <p className="text-gray-600 mt-2">Custom Designs, Premium Quality</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        <DesignCard
          image={DesignImg}
          title="Design 03"
          description="Design T-shirt03"
        />
        {getCurrentProducts().map((product) => (
          <CardComponent
            key={product._id}
            id={product._id}
            title={product.title || product.name}
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

      {totalPages > 1 && (
        <div className="p-6">
          <PaginationBar 
            totalPages={totalPages} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </div>
      )}
      
      <div className="flex gap-1 flex-row justify-between items-center p-3">
        <IconText icon={Map} description={"test description"} />
        <IconText icon={Security} description={"test description"} />
        <IconText icon={SecurePayment} description={"test description"} />
        <IconText icon={CustomerCare} description={"test description"} />
      </div>
    </>
  );
}

export default Dashboard;