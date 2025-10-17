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
    {/* Optional: Keep your design card if needed */}
       
      <div className="flex gap-4 flex-row justify-between items-center p-4 w-full flex-wrap">
        
         <DesignCard
          image={DesignImg}
          title="Design 03"
          description="Design T-shirt03"
        />
        {products.map((product) => (
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