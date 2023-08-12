import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../Components/pages/UserContext";
import axios from "axios";

export const ShopContext = createContext({
  products: [],
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemCount: () => {},
  getTotalCartAmount: () => {},
  userId: null,
});

export const ShopContextProvider = (props) => {
  const { userId } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get(
            `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}`
          );
          const data = response.data;
          setCartItems(data.cart_items);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };

      fetchCartItems();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://${process.env.REACT_APP_BACKEND_HOST}/products`
        );
        const data = response.data;
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Removed "products" dependency

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}`,
        {
          productId: productId,
          quantity: quantity,
        }
      );

      if (response.status === 201) {
        const updatedCartItems = [
          ...cartItems,
          response.data.cart_items[response.data.cart_items.length - 1],
        ];
        setCartItems(updatedCartItems);
        console.log("Product added to cart successfully");
      } else {
        console.error("Error adding product to cart:", response.data.error);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Remove product from cart logic here
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const updateCartItemCount = async (newQuantity, productId) => {
    try {
      const response = await axios.post(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}/update`,
        {
          newQuantity: newQuantity,
          productId: productId,
        }
      );

      if (response.status === 200) {
        console.log("Cart item count updated successfully");
      } else {
        console.error("Error updating cart item count:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating cart item count:", error);
    }
  };

  const getTotalCartAmount = () => {
    // Calculate total cart amount logic here
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
    return totalAmount;
  };

  const value = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getTotalCartAmount,
    userId,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
