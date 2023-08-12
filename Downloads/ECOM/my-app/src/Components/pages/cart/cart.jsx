import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../../context/shop-context";
import { Navbar } from "../../navbar";
import axios from "axios";
import { CartItem } from "./cart-item";
import { UserContext } from "../UserContext";
import "./cart.css";

export const Cart = () => {
  const { products, setProducts, getTotalCartAmount, removeFromCart } =
    useContext(ShopContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_HOST}/products`
      );
      const productsData = response.data;
      setProducts(productsData);
      console.log(productsData);
      // console.log("Products data:", data); // Add this log statement

      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}`
      );
      const data = response.data;
      console.log("Cart items data:", data); // Add this log statement

      // Wait for products to be set before mapping cart items
      await fetchProducts();

      const cartItemsWithPrice = data.cart_items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          ...item,
          price: product.price,
        };
      });

      setCartProducts(cartItemsWithPrice);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        `http://${process.env.REACT_APP_BACKEND_HOST}/checkout/${userId}`
      );
      setCartProducts([]);
      navigate("/contact");
    } catch (error) {
      console.log("Error during checkout:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when the component mounts
  }, []);

  useEffect(() => {
    if (userId && products.length > 0) {
      fetchCartItems();
    }
  }, [userId, products]);

  if (isLoading) {
    // Show loading message while products are being fetched
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="col pad"></div>
      <div className="cart">
        <div>
          <h1>Your Cart Items</h1>
        </div>
        <div className="cart">
          {cartProducts.map((product) => (
            <CartItem key={product.id} data={product} />
          ))}
        </div>

        {totalAmount > 0 ? (
          <div className="checkout">
            <p>Subtotal: ${totalAmount}</p>
            <button onClick={() => navigate("/")}>Continue Shopping</button>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        ) : (
          <h1>Your Shopping Cart is Empty</h1>
        )}
      </div>
    </>
  );
};

export default Cart;
