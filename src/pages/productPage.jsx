import React from "react";
import Product from "../components/Product";

function productPage(props) {
  return (
    <div>
      <Product
        title="Pubg Gaming T-shirt"
        brand="Brand Name"
        productCode="12345"
        availability="In Stock"
        price="$19.99"
      />
    </div>
  );
}

export default productPage;
