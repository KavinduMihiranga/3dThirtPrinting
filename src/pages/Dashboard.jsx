import React, { useState } from "react";
import CardComponent from "../components/CardComponent.jsx";
import DesignCard from "../components/DesignCard.jsx";

import TshirtImg from "../assets/TshirtPrintingImg.jpg";
import DesignImg from "../assets/T-shirtDesignImg.png";
import PaginationBar from "../components/PaginationBar.jsx";
import Map from "../assets/map.png"; 
import Security from "../assets/security.png";
import IconText from "../components/IconText.jsx";
import SecurePayment from "../assets/secure-payment.png"; 
import CustomerCare from "../assets/customer-care.png";
import CartIcon from "../assets/cart.png";

function Dashboard(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Set the total number of pages dynamically

  return (
    <>
      <div className="flex gap-1 flex-row justify-between items-center p-4 w-full ">
      <CardComponent
        image={TshirtImg}
        title="T-shirt01"
        description="test T-shirt01"
       
      />
      <CardComponent
        image={TshirtImg}
        title="T-shirt02"
        description="Cool T-shirt02"
       
      />
      <CardComponent
        image={TshirtImg}
        title="T-shirt03"
        description="Unique T-shirt03"
       
      />
      <DesignCard
        image={DesignImg}
        title="Design 03"
        description="Design T-shirt03"
        
      />
      </div>

      <div className="p-6">
      {/* Pagination Component */}
      <PaginationBar totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
    <div className="flex gap-1 flex-row justify-between items-center p-3 ">
    <IconText icon={Map} description={"test description"}></IconText>
    <IconText icon={Security} description={"test description"}></IconText>
    <IconText icon={SecurePayment} description={"test description"}></IconText>
    <IconText icon={CustomerCare} description={"test description"}></IconText>
    </div>
   
    </>
  );
}

export default Dashboard;
