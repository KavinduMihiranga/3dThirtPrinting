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

function Dashboard(props) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/product");
      setProducts(res.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <div className="flex gap-4 flex-row justify-between items-center p-4 w-full flex-wrap">
        {products.map((product) => (
          <CardComponent
            key={product._id} // Use _id instead of id for MongoDB
            image={
              product.image 
                ? `http://localhost:5000${product.image}` // Full URL to the image
                : TshirtImg // Fallback image
            }
            title={product.name}
            description={product.description}
            price={product.price}
          />
        ))}
        
        {/* Optional: Keep your design card if needed */}
        <DesignCard
          image={DesignImg}
          title="Design 03"
          description="Design T-shirt03"
        />
      </div>

      <div className="p-6">
        <PaginationBar 
          totalPages={totalPages} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />
      </div>
      
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