import React from "react";
import { Link } from "react-router-dom";

export const Product = (props) => {
  const { id, productName, price, productImage } = props.data;
  const { handleAddToCart } = props;

  return (
    <div className="description">
      <div className="image-container">
        <Link to={`/product/${id}`}>
          <img src={productImage} alt={productName} />
        </Link>
      </div>
      <p>
        <b>{productName}</b>
      </p>
      <p>${price}</p>
      <button className="addToCartBttn" onClick={() => handleAddToCart(id)}>
        Add To Cart
      </button>
    </div>
  );
};
