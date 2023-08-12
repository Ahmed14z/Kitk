import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navbar } from "../../navbar";
import "./CartPage.css"; // Import the CSS file for custom styles

function CartPage() {
  const { userId } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  useEffect(() => {
    calculateTotalPrice(); // Calculate total price whenever cart items change
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart_items);
      } else {
        console.log("Error retrieving cart items:", response.status);
      }
    } catch (error) {
      console.log("Error retrieving cart items:", error);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
        console.log("Cart item removed successfully");
      } else {
        console.log("Failed to remove cart item:", response.status);
      }
    } catch (error) {
      console.log("Error removing cart item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}/clear`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setCartItems([]);
        console.log("Cart cleared successfully");
      } else {
        console.log("Failed to clear cart:", response.status);
      }
    } catch (error) {
      console.log("Error clearing cart:", error);
    }
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_BACKEND_HOST}/cart/${userId}/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (response.ok) {
        const updatedCartItems = cartItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        setCartItems(updatedCartItems);
        console.log("Cart item quantity updated successfully");
      } else {
        console.log("Failed to update cart item quantity:", response.status);
      }
    } catch (error) {
      console.log("Error updating cart item quantity:", error);
    }
  };

  const decreaseQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateCartItemQuantity(itemId, newQuantity);
    } else {
      removeCartItem(itemId);
    }
  };

  const increaseQuantity = (itemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateCartItemQuantity(itemId, newQuantity);
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return totalPrice.toFixed(2); // Return the total price rounded to 2 decimal places
  };

  const checkout = async () => {
    // Create a new purchase object
    const newPurchase = {
      userId: userId,
      items: cartItems,
      totalPrice: calculateTotalPrice(),
    };

    try {
      // Make a POST request to save the purchase
      const response = await fetch(
        `https://${process.env.REACT_APP_BACKEND_HOST}/purchases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPurchase),
        }
      );
      if (response.ok) {
        // Clear the cart after successful purchase
        clearCart();
        console.log(newPurchase.items);
        console.log("Purchase saved successfully");
      } else {
        console.log("Failed to save purchase:", response.status);
      }
    } catch (error) {
      console.log("Error saving purchase:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-title">Cart</h1>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                className="cart-item-image"
                src={`https://${process.env.REACT_APP_BACKEND_HOST}/uploads/${item.productImage}`}
                alt={item.productName}
              />
              <div className="cart-item-details">
                <h3>{item.productName}</h3>
                <p>Price: ${item.price}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => decreaseQuantity(item.id, item.quantity)}
                  >
                    -
                  </button>
                  <p>Quantity: {item.quantity}</p>
                  <button
                    className="quantity-button"
                    onClick={() => increaseQuantity(item.id, item.quantity)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="remove-button"
                onClick={() => removeCartItem(item.id)}
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-total">
            <p>Total Price: ${calculateTotalPrice()}</p>
          </div>
        )}
        <div className="cart-buttons">
          <button className="clear-cart-button" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="checkout-button" onClick={checkout}>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default CartPage;
