import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../navbar";
import { Link } from "react-router-dom";
import { ShopContext } from "../../../context/shop-context";
import axios from "axios";
import "./product-details.css"; // Import the new CSS file

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const { addToCart, cartItems } = useContext(ShopContext);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_HOST}/products/${id}`
      );
      const productData = response.data;
      setProduct(productData);
      fetchImage(productData.productImage); // Fetch the image
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };

  const fetchImage = async (imageName) => {
    try {
      const response = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_HOST}/uploads/${imageName}`
      );
      setImageURL(
        `https://${process.env.REACT_APP_BACKEND_HOST}/uploads/${imageName}`
      );
    } catch (error) {
      console.log("Error fetching image:", error);
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  const { productName, price, description } = product;
  const cartItemCount = cartItems[product.id];

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  return (
    <>
      <Navbar />
      <div className="top-right"></div>
      <div className="product-details">
        <div className="product-content">
          <div className="product-image">
            <img src={imageURL} alt={productName} />
          </div>
          <div className="product-info">
            <h2 className="product-title">{productName}</h2>
            <p className="product-price">Price: ${price}</p>
            <div className="product-description">
              <h3>About this item:</h3>
              <p>{description}</p>
            </div>
            <button className="addToCartBttn" onClick={handleAddToCart}>
              Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
