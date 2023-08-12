import React, { useContext } from "react";
import { ShopContext } from "../../../context/shop-context";

export const CartItem = (props) => {
  const { id, productName, price, productImage, quantity } = props.data;
  const { removeFromCart, updateCartItemCount } = useContext(ShopContext);

  const handleRemoveFromCart = () => {
    removeFromCart(id);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateCartItemCount(newQuantity, id);
  };

  return (
    <div className="cartItem">
      <img src={productImage} alt={productName} />
      <div className="description">
        <p>
          <b>{productName}</b>
        </p>
        <p>Price: ${price}</p>
        <div className="countHandler">
          <button onClick={handleRemoveFromCart}> - </button>
          <input
            type="number"
            min="0"
            value={quantity} // Use the quantity from props.data instead of props.quantity
            onChange={handleQuantityChange}
          />
        </div>
      </div>
    </div>
  );
};
