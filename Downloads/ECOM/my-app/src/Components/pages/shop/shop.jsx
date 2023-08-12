import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../../context/shop-context";
import { Navbar } from "../../navbar";
import axios from "axios";
import "./shop.css";

export const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart, cartItems, removeFromCart, updateCartItemCount, userId } =
    useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_HOST}/products`
      );
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const handleAddToCart = (productId) => {
    if (!userId) {
      setShowNotification(true);
      return;
    }

    addToCart(productId, productQuantities[productId]);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateCartItemCount = (event, productId) => {
    const quantity = parseInt(event.target.value);
    updateCartItemCount(quantity, productId);
  };

  const getCartItemQuantity = (productId) => {
    return productQuantities[productId] || 1;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const decreaseQuantity = (productId) => {
    const currentQuantity = getCartItemQuantity(productId);
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      handleQuantityChange(productId, newQuantity);
    }
  };

  const increaseQuantity = (productId) => {
    const currentQuantity = getCartItemQuantity(productId);
    const newQuantity = currentQuantity + 1;
    handleQuantityChange(productId, newQuantity);
  };

  return (
    <>
      <Navbar />
      <div className="shop">
        <div className="col pad"></div>
        <div>
          <h1 className="playful-underline shopTitle">Mansy's Shop</h1>
        </div>
        <div className="templateContainer">
          <div className="searchInput_Container">
            <i className="searchIcon fas fa-search"></i>
            <input
              id="searchInput"
              type="text"
              className="curve"
              placeholder="Search here..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
          <div className="products">
            {products
              .filter((val) => {
                if (searchTerm === "") {
                  return val;
                } else if (
                  val.productName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((val) => {
                const productId = val.id;
                const cartItemQuantity = getCartItemQuantity(productId);

                return (
                  <div className="product" key={productId}>
                    <div className="description">
                      <div className="image-container">
                        <Link to={`/product/${productId}`}>
                          <img
                            src={`https://${process.env.REACT_APP_BACKEND_HOST}/uploads/${val.productImage}`}
                            alt={val.productName}
                          />
                        </Link>
                      </div>
                      <p>
                        <b>{val.productName}</b>
                      </p>
                      <p>${val.price}</p>
                      <div className="quantity-input">
                        <button
                          className="quantity-button"
                          onClick={() => decreaseQuantity(productId)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={cartItemQuantity}
                          min="1"
                          onChange={(event) =>
                            handleQuantityChange(
                              productId,
                              parseInt(event.target.value)
                            )
                          }
                        />
                        <button
                          className="quantity-button"
                          onClick={() => increaseQuantity(productId)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="addToCartBttn"
                        onClick={() => handleAddToCart(productId)}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Notification Alert */}
        {showNotification && (
          <div className="notification-alert">
            <p>Please log in to add items to your cart.</p>
            <button
              className="close-button"
              onClick={() => setShowNotification(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};
